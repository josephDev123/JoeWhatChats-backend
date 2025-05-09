import mongoose, { Model, Mongoose, Schema } from "mongoose";
import { ConversationType } from "../models/Conversation";
import { ConversationDTO } from "../DTO/conversationDTO";
import { GlobalError } from "../utils/globalError";
// import { UpdateConversationDTO } from "../DTO/UpdateConversationDTO";

export class ConversationRepo {
  constructor(private readonly ConversationModel: Model<ConversationType>) {}

  async create(
    payload?: ConversationDTO,
    session?: mongoose.mongo.ClientSession
  ) {
    try {
      const ConversationDocs = new this.ConversationModel(payload);
      return await ConversationDocs.save({ session });
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational
        // CustomError.stack
      );
    }
  }
  async update(id: string, payload: ConversationDTO) {
    try {
      const findIdResponse = await this.ConversationModel.findById(id);
      const doc: ConversationDTO = {
        conversation_name:
          payload.conversation_name || findIdResponse?.conversation_name,
        avatar: payload.avatar || findIdResponse?.avatar,
      };
      return await this.ConversationModel.findByIdAndUpdate(id, doc, {
        new: true,
      });
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational
        // CustomError.stack
      );
    }
  }

  async find(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const ConversationAndMemberGroup = [
        {
          $lookup: {
            from: "groupmembers",
            localField: "_id",
            foreignField: "conversation_id",
            as: "ConversationWithMember",
          },
        },
        {
          $unwind: "$ConversationWithMember", // Flatten the array for easier lookup
        },
        {
          $lookup: {
            from: "users", // Join with the users collection
            localField: "ConversationWithMember.user_id", // Assuming `user_id` is the field in groupmembers pointing to users
            foreignField: "_id",
            as: "ConversationWithMember.userDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            conversation_name: { $first: "$conversation_name" },
            avatar: { $first: "$avatar" },
            creator: { $first: "$creator" },
            ConversationWithMember: { $push: "$ConversationWithMember" },
          },
        },
        { $skip: skip },
        { $limit: limit },
      ];

      const response = await this.ConversationModel.aggregate(
        ConversationAndMemberGroup
      );

      return response;
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      throw new GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
    }
  }

  async findBy(conversation_id: string) {
    // console.log("conv id repo", conversation_id);
    try {
      const ConversationAndMemberGroup = [
        {
          $match: { _id: new mongoose.Types.ObjectId(conversation_id) },
        },
        {
          $lookup: {
            from: "groupmembers",
            localField: "_id",
            foreignField: "conversation_id",
            as: "ConversationWithMember",
          },
        },
        {
          $unwind: "$ConversationWithMember", // Flatten the array for easier lookup
        },
        {
          $lookup: {
            from: "users", // Join with the users collection
            localField: "ConversationWithMember.user_id", // Assuming `user_id` is the field in groupmembers pointing to users
            foreignField: "_id",
            as: "ConversationWithMember.userDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            conversation_name: { $first: "$conversation_name" },
            avatar: { $first: "$avatar" },
            creator: { $first: "$creator" },
            ConversationWithMember: { $push: "$ConversationWithMember" },
          },
        },
      ];

      const response = await this.ConversationModel.aggregate(
        ConversationAndMemberGroup
      );

      return response;
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      throw new GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
    }
  }

  async find_singleMember(user_id: string, user_id2: string) {
    console.log(user_id, user_id2);
    try {
      const ConversationAndMemberGroup = [
        {
          $lookup: {
            from: "groupmembers",
            localField: "_id",
            foreignField: "conversation_id",
            as: "ConversationWithMember",
          },
        },

        {
          $match: {
            conversation_name: { $exists: false },
            ConversationWithMember: {
              $all: [
                {
                  $elemMatch: { user_id: new mongoose.Types.ObjectId(user_id) },
                },
                {
                  $elemMatch: {
                    user_id: new mongoose.Types.ObjectId(user_id2),
                  },
                },
              ],
            },
          },
        },
      ];

      const response = await this.ConversationModel.aggregate(
        ConversationAndMemberGroup
      );
      console.log("from check", response);

      return response;
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      throw new GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
    }
  }
}
