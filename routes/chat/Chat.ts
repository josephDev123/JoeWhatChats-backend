import { Router } from "express";
import { ChatController } from "../../controllers/ChatController";
import { ChatService } from "../../services/ChatService";
import { ChatRepo } from "../../Repository/ChatRepo";
import { ChatModel } from "../../models/Chat";
import { ConversationModel } from "../../models/Conversation";

export const chatRoute = Router();

const ChatRepoImpl = new ChatRepo(ChatModel, ConversationModel);
const ChatServiceImpl = new ChatService(ChatRepoImpl);
const ChatControllerImp = new ChatController(ChatServiceImpl);

chatRoute.post("/create", ChatControllerImp.createChat.bind(ChatControllerImp));

chatRoute.get("/find", ChatControllerImp.find.bind(ChatControllerImp));
