import mongoose, { Model } from "mongoose";
import { ConversationType } from "../models/Conversation";
import { ConversationDTO } from "../DTO/conversationDTO";
import { GlobalError } from "../utils/globalError";

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
        CustomError.operational,
        CustomError.stack
      );
    }
  }

  async find(page: number, limit: number) {
    try {
      // const skip = (page - 1) * limit;

      // const ConversationAndMemberGroup = [
      //   {
      //     $lookup: {
      //       from: "groupmembers",
      //       localField: "_id",
      //       foreignField: "conversation_id",
      //       as: "ConversationWithMember",
      //     },
      //   },
      // ];

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
