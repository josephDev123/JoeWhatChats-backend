import mongoose, { Model } from "mongoose";
import { ChatType } from "../models/Chat";
import { ChatDTO } from "../DTO/ChatDTO";
import { GlobalError } from "../utils/globalError";
import { Conversation } from "../routes/Conversation/conversation";

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
        {
          $lookup: {
            from: "conversations",
            localField: "conversation_id",
            foreignField: "_id",
            as: "Conversation",
          },
        },

        // {
        //   $unwind: "$Conversation",
        // },
        {
          $lookup: {
            from: "groupmembers",
            localField: "Conversation._id",
            foreignField: "conversation_id",
            as: "GroupMember",
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "GroupMember.user_id",
            foreignField: "_id",
            as: "userDetails",
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
