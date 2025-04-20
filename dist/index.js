"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoute_1 = require("./routes/auths/authRoute");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const chatMsg_1 = require("./models/chatMsg");
const errorHandlerMiddleware_1 = require("./middleware/errorHandlerMiddleware");
const conversation_1 = require("./routes/Conversation/conversation");
const Polling_1 = require("./models/Polling");
const votePoll_1 = require("./routes/votePoll");
const Chat_1 = require("./routes/chat/Chat");
const groupmember_1 = require("./routes/groupmembers/groupmember");
const ChatRepo_1 = require("./Repository/ChatRepo");
const Chat_2 = require("./models/Chat");
const Conversation_1 = require("./models/Conversation");
const ChatService_1 = require("./services/ChatService");
dotenv_1.default.config();
// const corsOption = {
//   origin: process.env.ALLOWED_ORIGIN,
//   credentials: true,
// };
const app = (0, express_1.default)();
const HttpServer = (0, http_1.createServer)(app);
const DomainOrigin = [
    process.env.ALLOWED_ORIGIN,
    process.env.ALLOWED_ORIGIN2,
    process.env.ALLOWED_ORIGIN3,
    process.env.ALLOWED_ORIGIN4,
    process.env.ALLOWED_ORIGIN5,
    process.env.ALLOWED_ORIGIN6,
].filter((origin) => typeof origin === "string");
const io = new socket_io_1.Server(HttpServer, {
    cors: {
        // DomainOrigin
        origin: DomainOrigin,
    },
});
app.use((0, cors_1.default)({
    // origin: "*",
    origin: function (origin, callback) {
        if (!origin || DomainOrigin.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ChatRepoImpl = new ChatRepo_1.ChatRepo(Chat_2.ChatModel, Conversation_1.ConversationModel);
        const ChatServiceImpl = new ChatService_1.ChatService(ChatRepoImpl);
        // const user = new User();
        yield (0, db_1.dbConnection)();
        // socketServer.io
        io.on("connection", (socket) => {
            console.log(socket.id);
            socket.on("joinConversation", (data) => __awaiter(void 0, void 0, void 0, function* () {
                const { conversationId } = data;
                socket.join(conversationId);
                socket.emit("joinConversation", { conversationId });
            }));
            socket.on("sendMessage", ({ conversationId, message }) => __awaiter(void 0, void 0, void 0, function* () {
                io.to(conversationId).emit("receiveMessage", message);
                // Save to db
                const chatToDb = {
                    message_text: message.message_text,
                    from_userId: message.from_userId,
                    message_type: message.message_type,
                    imgUrl: message.imgUrl,
                    conversation_id: message.conversation_id,
                };
                yield ChatServiceImpl.CreateChat(chatToDb);
            }));
            socket.on("createPoll", (data) => __awaiter(void 0, void 0, void 0, function* () {
                const idA = String(Math.floor(Math.random() * 1000));
                const idB = String(Math.floor(Math.random() * 1000));
                try {
                    socket.join(data.room);
                    const pollObjDb = {
                        question: data.question,
                        options: [
                            { _id: idA, option: data.optionOne },
                            { _id: idB, option: data.optionTwo },
                        ],
                        multiple_answer: data.multipleAnswer,
                    };
                    const pollResp = new Polling_1.PollModel(Object.assign({}, pollObjDb));
                    // console.log(pollResp);
                    yield pollResp.save();
                    const chatMessageModel = new chatMsg_1.chatMsgModel({
                        name: data.user.data.name,
                        room: data.room,
                        type: data.type,
                        poll_id: pollResp._id,
                    });
                    yield chatMessageModel.save();
                    const pollObj = {
                        name: data.user.data.name,
                        room: data.room,
                        type: data.type,
                        poll_id: {
                            _id: pollResp._id,
                            question: data.question,
                            options: [
                                { _id: idA, option: data.optionOne, count: 0 },
                                { _id: idB, option: data.optionTwo, count: 0 },
                            ],
                            multiple_answer: data.multipleAnswer,
                            peopleWhovoted: [],
                        },
                    };
                    // console.log(pollObj);
                    io.to(data.room).emit("listenToCreatePoll", pollObj);
                }
                catch (error) {
                    console.log(error);
                }
            }));
            socket.on("onVoted", (data) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // real-time update
                    const newChat = data.chats.map((chat) => {
                        if (chat.poll_id && chat.poll_id.options) {
                            chat.poll_id.options = chat.poll_id.options.map((option) => {
                                if (option._id === data.whatToUpdateId) {
                                    console.log(chat.whatToUpdateId);
                                    // Increment count by 1
                                    option.count = (option.count || 0) + 1;
                                    // Add user to peopleWhovoted array if not already present
                                    if (!chat.poll_id.peopleWhovoted.includes(data.user)) {
                                        chat.poll_id.peopleWhovoted.push(data.user);
                                    }
                                }
                                return option;
                            });
                        }
                        return chat;
                    });
                    socket.emit("listToOnVoted", newChat);
                    // update the db
                    yield Polling_1.PollModel.updateOne({ _id: data.item._id, "options.option": data.optionToUpdate }, {
                        $inc: { "options.$.count": 1 },
                        $push: { peopleWhovoted: data.user },
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }));
        });
        // route
        app.use("/auth", authRoute_1.AuthRoute);
        app.use("/conversation", conversation_1.Conversation);
        app.use("/chat", Chat_1.chatRoute);
        app.use("/group-member", groupmember_1.GroupMemberRoute);
        // app.use("/chat", chatMsgRoute);
        app.use("/vote", votePoll_1.VoteRouter);
        app.use("/test", (req, res) => res.send("testing ..."));
        app.use(errorHandlerMiddleware_1.errorHandleMiddleware);
        HttpServer.listen(process.env.PORT, () => {
            console.log(`listening on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
startApp();
//# sourceMappingURL=index.js.map