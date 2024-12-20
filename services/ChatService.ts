import { Model } from "mongoose";
import { ChatDTO } from "../DTO/ChatDTO";
import { GlobalError } from "../utils/globalError";
import { ChatType } from "../models/Chat";
import { ChatRepo } from "../Repository/ChatRepo";

export class ChatService {
  constructor(private readonly ChatRepo: ChatRepo) {}
  async CreateChat(payload: ChatDTO) {
    try {
      const chatDoc = await this.ChatRepo.createChat(payload);
      return chatDoc;
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational,
        CustomError.stack
      );
    }
  }
}
