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
const User_1 = require("./utils/User");
const chatMsg_1 = require("./models/chatMsg");
const errorHandlerMiddleware_1 = require("./middleware/errorHandlerMiddleware");
const rooms_1 = require("./models/rooms");
const conversation_1 = require("./routes/Conversation/conversation");
const Polling_1 = require("./models/Polling");
const votePoll_1 = require("./routes/votePoll");
const Chat_1 = require("./routes/chat/Chat");
const groupmember_1 = require("./routes/groupmembers/groupmember");
dotenv_1.default.config();
const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
};
const app = (0, express_1.default)();
const HttpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(HttpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new User_1.User();
        yield (0, db_1.dbConnection)();
        // socketServer.io
        io.on("connection", (socket) => {
            socket.on("offer", (data) => {
                io.emit("offer", data);
            });
            socket.on("answer", (data) => {
                io.emit("answer", data);
            });
            socket.on("iceCandidate", (data) => {
                io.emit("iceCandidate", data);
            });
            socket.on("MemberJoined", (data) => {
                io.emit("MemberJoined", data);
            });
            socket.on("createRoom", (roomOption) => __awaiter(void 0, void 0, void 0, function* () {
                socket.join(roomOption.roomUniqueName);
                io.to(roomOption.roomUniqueName).emit("getCreateRoom", roomOption);
                const roomModelDb = new rooms_1.roomModel(roomOption);
                yield roomModelDb.save();
            }));
            socket.on("JoinInviteRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // await roomModel.updateOne(
                    //   { roomUniqueName: data.roomUniqueName },
                    //   { $addToSet: { join: data } }
                    // );
                    socket.join(data.roomUniqueName);
                    const existingRooms = yield rooms_1.roomModel.find({
                        roomUniqueName: data.roomUniqueName,
                    });
                    existingRooms.forEach((existingRoom) => __awaiter(void 0, void 0, void 0, function* () {
                        const userEmailExists = existingRoom.join.some((joinData) => joinData.userEmail === data.userEmail);
                        if (!userEmailExists) {
                            yield rooms_1.roomModel.updateOne({ roomUniqueName: data.roomUniqueName }, { $addToSet: { join: data } });
                        }
                        else {
                            console.log("User email already exists in the join array for room:", existingRoom.roomUniqueName);
                        }
                    }));
                }
                catch (error) {
                    console.log(error);
                }
            }));
            socket.on("welcomeMessage", (room) => {
                socket.join(room.room);
                user.addUser(socket.id, room.room);
                // console.log(room.room);
                const userRoom = user.getUser(room.room);
                if (userRoom) {
                    io.to(userRoom.room).emit("welcomeMessage", `welcome to ${room.room} room`);
                }
                else {
                    console.log("User not found or missing room information.");
                }
            });
            socket.on("submitMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
                socket.join(data.room);
                const submittedChatData = {
                    name: data.name,
                    room: data.room,
                    chat: data.chat,
                    time: data.time,
                    img: data.img,
                };
                io.to(data.room).emit("exchangeMessage", submittedChatData);
                const chatMsg = new chatMsg_1.chatMsgModel(submittedChatData);
                yield chatMsg.save();
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
        // routes
        app.use("/auth", authRoute_1.AuthRoute);
        app.use("/conversation", conversation_1.Conversation);
        app.use("/chat", Chat_1.chatRoute);
        app.use("/group-member", groupmember_1.GroupMemberRoute);
        // app.use("/chat", chatMsgRoute);
        app.use("/vote", votePoll_1.VoteRouter);
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