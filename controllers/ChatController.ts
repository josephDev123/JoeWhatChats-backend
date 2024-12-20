import { NextFunction, Request, Response } from "express";
import { ChatDTO } from "../DTO/ChatDTO";
import { ChatService } from "../services/ChatService";
import { ChatModel } from "../models/Chat";
import { ChatRepo } from "../Repository/ChatRepo";
import { GlobalError } from "../utils/globalError";

export class ChatController {
  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const ChatRepoImpl = new ChatRepo(ChatModel);
      const ChatServiceImpl = new ChatService(ChatRepoImpl);
      const payload = req.body;

      const ExtractPayload: ChatDTO = {
        message_text: payload.message_text,
        from_number: payload.from_number,
        conversation_id: payload.conversation_id,
        sent_datetime: payload.sent_datetime,
      };

      const result = await ChatServiceImpl.CreateChat(ExtractPayload);
      // console.log(result);
      return res.status(200).json({
        message: "Successfully created a chat",
        data: result,
      });
    } catch (error) {
      const CustomError = error as GlobalError;
      next(CustomError);
    }
  }
}
