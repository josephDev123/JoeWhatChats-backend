import { Router } from "express";
import { ChatController } from "../../controllers/ChatController";

export const chatRoute = Router();
const ChatControllerImp = new ChatController();

chatRoute.post("/create", ChatControllerImp.createChat.bind(ChatControllerImp));
