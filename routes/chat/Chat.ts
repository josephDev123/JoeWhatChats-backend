import { Router } from "express";
import { ChatController } from "../../controllers/ChatController";
import { ChatService } from "../../services/ChatService";
import { ChatRepo } from "../../Repository/ChatRepo";
import { ChatModel } from "../../models/Chat";

export const chatRoute = Router();

const ChatRepoImpl = new ChatRepo(ChatModel);
const ChatServiceImpl = new ChatService(ChatRepoImpl);
const ChatControllerImp = new ChatController(ChatServiceImpl);

chatRoute.post("/create", ChatControllerImp.createChat.bind(ChatControllerImp));

chatRoute.get("/find", ChatControllerImp.find.bind(ChatControllerImp));
