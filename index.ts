import express, { Express } from "express";
import { dbConnection } from "./db";
import cors from "cors";
import dotenv from "dotenv";
import { AuthRoute } from "./routes/auths/authRoute";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import { Server } from "socket.io";
import { createServer } from "http";
import { User } from "./utils/User";
import { chatMsgModel } from "./models/chatMsg";
import { errorHandleMiddleware } from "./middleware/errorHandlerMiddleware";
import { Conversation } from "./routes/Conversation/conversation";
import { PollModel } from "./models/Polling";
import { VoteRouter } from "./routes/votePoll";
import { chatRoute } from "./routes/chat/Chat";
import { GroupMemberRoute } from "./routes/groupmembers/groupmember";
import { ChatRepo } from "./Repository/ChatRepo";
import { ChatModel } from "./models/Chat";
import { ConversationModel } from "./models/Conversation";
import { ChatService } from "./services/ChatService";
import { ChatDTO } from "./DTO/ChatDTO";

dotenv.config();

// const corsOption = {
//   origin: process.env.ALLOWED_ORIGIN,
//   credentials: true,
// };

const app: Express = express();
const HttpServer = createServer(app);
const DomainOrigin = [
  process.env.ALLOWED_ORIGIN,
  process.env.ALLOWED_ORIGIN2,
  process.env.ALLOWED_ORIGIN3,
  process.env.ALLOWED_ORIGIN4,
  process.env.ALLOWED_ORIGIN5,
].filter((origin): origin is string => typeof origin === "string");

const io = new Server(HttpServer, {
  cors: {
    origin: DomainOrigin,
  },
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || DomainOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const startApp = async () => {
  try {
    const ChatRepoImpl = new ChatRepo(ChatModel, ConversationModel);
    const ChatServiceImpl = new ChatService(ChatRepoImpl);

    // const user = new User();
    await dbConnection();

    // socketServer.io
    io.on("connection", (socket) => {
      console.log(socket.id);

      socket.on("joinConversation", async (data) => {
        const { conversationId } = data;
        socket.join(conversationId);
        socket.emit("joinConversation", { conversationId });
      });

      socket.on("sendMessage", async ({ conversationId, message }) => {
        io.to(conversationId).emit("receiveMessage", message);

        // Save to db
        const chatToDb: ChatDTO = {
          message_text: message.message_text,
          from_userId: message.from_userId,
          message_type: message.message_type,
          imgUrl: message.imgUrl,
          conversation_id: message.conversation_id,
        };

        await ChatServiceImpl.CreateChat(chatToDb);
      });

      socket.on("createPoll", async (data) => {
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

          const pollResp = new PollModel({
            ...pollObjDb,
          });
          // console.log(pollResp);
          await pollResp.save();
          const chatMessageModel = new chatMsgModel({
            name: data.user.data.name,
            room: data.room,
            type: data.type,
            poll_id: pollResp._id,
          });

          await chatMessageModel.save();

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
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("onVoted", async (data) => {
        try {
          // real-time update

          const newChat = data.chats.map((chat: any) => {
            if (chat.poll_id && chat.poll_id.options) {
              chat.poll_id.options = chat.poll_id.options.map((option: any) => {
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
          await PollModel.updateOne(
            { _id: data.item._id, "options.option": data.optionToUpdate },
            {
              $inc: { "options.$.count": 1 },
              $push: { peopleWhovoted: data.user },
            }
          );
        } catch (error) {
          console.log(error);
        }
      });
    });

    // route
    app.use("/auth", AuthRoute);
    app.use("/conversation", Conversation);
    app.use("/chat", chatRoute);
    app.use("/group-member", GroupMemberRoute);
    // app.use("/chat", chatMsgRoute);
    app.use("/vote", VoteRouter);
    app.use("/test", (req, res) => res.send("testing ..."));
    app.use(errorHandleMiddleware);
    HttpServer.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
