import mongoose, { Model } from "mongoose";
import { ChatType } from "../models/Chat";
import { ChatDTO } from "../DTO/ChatDTO";
import { GlobalError } from "../utils/globalError";
import { Conversation } from "../routes/Conversation/conversation";
import { ConversationType } from "../models/Conversation";

export class ChatRepo {
  constructor(
    private readonly ChatModel: Model<ChatType>,
    private readonly ConversationModel: Model<ConversationType>
  ) {}

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
      // Step 1: Fetch messages
      const messagePipeline = [
        {
          $match: {
            conversation_id: new mongoose.Types.ObjectId(
              messageConversation_id
            ),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "from_userId",
            foreignField: "_id",
            as: "from_UserDetails",
          },
        },
        {
          $unwind: "$from_UserDetails",
        },
      ];

      const messages = await this.ChatModel.aggregate(messagePipeline);

      // Step 2: Fetch group members and user details
      const groupMemberPipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(messageConversation_id),
          },
        },
        {
          $lookup: {
            from: "groupmembers",
            localField: "_id",
            foreignField: "conversation_id",
            as: "GroupMembers",
          },
        },
        {
          $unwind: "$GroupMembers",
        },
        {
          $lookup: {
            from: "users",
            localField: "GroupMembers.user_id",
            foreignField: "_id",
            as: "UserDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            GroupMembers: { $addToSet: "$GroupMembers" },
            UserDetails: { $addToSet: { $arrayElemAt: ["$UserDetails", 0] } },
          },
        },
      ];

      const groupDetails = await this.ConversationModel.aggregate(
        groupMemberPipeline
      );

      // Combine the responses
      return {
        messages,
        groupDetails: groupDetails[0] || { GroupMembers: [], UserDetails: [] },
      };
    } catch (error) {
      const customError = error as GlobalError;
      throw new GlobalError(customError.message, customError.name, 500, false);
    }
  }
}
