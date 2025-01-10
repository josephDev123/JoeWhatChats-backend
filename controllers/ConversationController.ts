import { NextFunction, Request, Response } from "express";
import { ConversationService } from "../services/Conversation";
import { ConversationDTO } from "../DTO/conversationDTO";
import { GlobalError } from "../utils/globalError";
// import { UpdateConversationDTO } from "../DTO/UpdateConversationDTO";

export class ConversationController {
  constructor(private readonly ConversationService: ConversationService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const ExtractPayload: ConversationDTO = {
        creator: payload.creator,
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const payloadBody = req.body;
      const payloadId: string = payloadBody.conversation_id;
      const payload: ConversationDTO = {
        conversation_name: payloadBody.conversation_name,
        avatar: payloadBody.conversation_avatar,
      };
      const result = await this.ConversationService.update(payloadId, payload);
      return res.json(result).status(200);
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      next(ErrorFormat);
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

  async findBy(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation_id = req.params.id;
      const response = await this.ConversationService.findBy(
        conversation_id! as unknown as string
      );
      return res.json({ data: response }).status(200);
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      next(ErrorFormat);
    }
  }
}
