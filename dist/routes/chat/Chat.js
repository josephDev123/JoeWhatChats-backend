"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoute = void 0;
const express_1 = require("express");
const ChatController_1 = require("../../controllers/ChatController");
const ChatService_1 = require("../../services/ChatService");
const ChatRepo_1 = require("../../Repository/ChatRepo");
const Chat_1 = require("../../models/Chat");
const Conversation_1 = require("../../models/Conversation");
exports.chatRoute = (0, express_1.Router)();
const ChatRepoImpl = new ChatRepo_1.ChatRepo(Chat_1.ChatModel, Conversation_1.ConversationModel);
const ChatServiceImpl = new ChatService_1.ChatService(ChatRepoImpl);
const ChatControllerImp = new ChatController_1.ChatController(ChatServiceImpl);
exports.chatRoute.post("/create", ChatControllerImp.createChat.bind(ChatControllerImp));
exports.chatRoute.get("/find", ChatControllerImp.find.bind(ChatControllerImp));
//# sourceMappingURL=Chat.js.map