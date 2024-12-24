import { NextFunction, Request, Response } from "express";
import { ChatDTO } from "../DTO/ChatDTO";
import { ChatService } from "../services/ChatService";
import { GlobalError } from "../utils/globalError";

export class ChatController {
  constructor(private readonly ChatService: ChatService) {}
  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const ExtractPayload: ChatDTO = {
        message_text: payload.message_text,
        from_userId: payload.from_userId,
        message_type: payload.message_type,
        imgUrl: payload.imgUrl,
        conversation_id: payload.conversation_id,
        // sent_datetime: payload.sent_datetime,
      };

      const result = await this.ChatService.CreateChat(ExtractPayload);
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

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const queryPayload = query as { conversation_id: string };

      const response = await this.ChatService.find(
        queryPayload?.conversation_id!
      );

      console.log(response);
      return res.status(200).json({ data: response });
    } catch (error) {
      const customError = error as GlobalError;
      return next(customError);
    }
  }
}
