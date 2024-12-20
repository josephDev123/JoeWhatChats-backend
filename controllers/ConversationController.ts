import { NextFunction, Request, Response } from "express";
import { ConversationService } from "../services/Conversation";
import { ConversationDTO } from "../DTO/conversationDTO";
import { GlobalError } from "../utils/globalError";

export class ConversationController {
  constructor(private readonly ConversationService: ConversationService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const ExtractPayload: ConversationDTO = {
        conversation_name: payload.conversation_name,
      };
      console.log(ExtractPayload);
      const result = await this.ConversationService.create(
        ExtractPayload,
        payload.user_id
      );

      return res.json(result).status(200);
    } catch (error) {
      next(error);
    }
  }

  async create_single(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      // const ExtractPayload: ConversationDTO = {
      //   conversation_name: payload.conversation_name,
      // };
      // console.log(ExtractPayload);
      const result = await this.ConversationService.create_single(
        payload.user_id,
        payload.user_id2
      );

      return res.json(result).status(200);
    } catch (error) {
      next(error);
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = await req.body;
      const page = payload.page ?? 1;
      const limit = payload.limit ?? 4;
      const response = await this.ConversationService.find(page, limit);
      return res.json({ data: response }).status(200);
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      next(ErrorFormat);
    }
  }
}
