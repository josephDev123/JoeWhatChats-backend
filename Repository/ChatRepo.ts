import mongoose, { Model } from "mongoose";
import { ChatType } from "../models/Chat";
import { ChatDTO } from "../DTO/ChatDTO";
import { GlobalError } from "../utils/globalError";

export class ChatRepo {
  constructor(private readonly ChatModel: Model<ChatType>) {}

  async createChat(payload: ChatDTO) {
    try {
      const chatDoc = new this.ChatModel(payload);
      return await chatDoc.save();
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational
      );
    }
  }

  async find(messageConversation_id: string) {
    try {
      const aggregatePipeline = [
        {
          $match: {
            conversation_id: new mongoose.Types.ObjectId(
              messageConversation_id
            ),
          },
        },
      ];
      const response = await this.ChatModel.aggregate(aggregatePipeline);
      return response;
    } catch (error) {
      const customError = error as GlobalError;
      throw new GlobalError(customError.message, customError.name, 500, false);
    }
  }
}
