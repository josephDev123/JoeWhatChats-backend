import { ConversationRepo } from "../Repository/Conversation";
import { ConversationDTO } from "../DTO/conversationDTO";
import { GlobalError } from "../utils/globalError";
import { GroupMemberRepo } from "../Repository/GroupMember";
import { GroupMemberTypeDTO } from "../DTO/GroupMemberDTO";
import mongoose, { Mongoose, Schema } from "mongoose";

export class ConversationService {
  constructor(
    private readonly ConversationRepo: ConversationRepo,
    private readonly GroupMember: GroupMemberRepo
  ) {}
  async create(payload: ConversationDTO, user_id: string) {
    // const option = {
    //   readPreference: "primary",
    //   readConcern: { level: "local" },
    //   writeConcern: { w: "majority" },
    // };

    //start session
    const session = await mongoose.startSession();
    try {
      const transactions = await session.withTransaction(async () => {
        const ConversationDoc = await this.ConversationRepo.create(
          payload,
          session
        );
        const GroupMemberPayload: GroupMemberTypeDTO = {
          conversation_id: String(ConversationDoc._id),
          user_id: user_id,
        };
        await this.GroupMember?.create(GroupMemberPayload, session);
      });
      console.log("The transaction was successful");
      return transactions;
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational,
        CustomError.stack
      );
    } finally {
      await session.endSession();
    }
  }

  async create_single(user_id: string, user_id2: string) {
    // const option = {
    //   readPreference: "primary",
    //   readConcern: { level: "local" },
    //   writeConcern: { w: "majority" },
    // };

    //start session
    // console.log(user_id, user_id2);
    const check = await this.ConversationRepo.find_singleMember(
      user_id,
      user_id2
    );
    // console.log("check ", check);
    // return check;
    if (check.length > 0) {
      throw new GlobalError(
        "Conversation already exist",
        "ConversationError",
        400,
        false
      );
    }

    const session = await mongoose.startSession();
    try {
      const transactions = await session.withTransaction(async () => {
        const payload: ConversationDTO = {};
        const ConversationDoc = await this.ConversationRepo.create(
          payload,
          session
        );
        const GroupMemberPayload: GroupMemberTypeDTO = {
          conversation_id: String(ConversationDoc._id),
          user_id: user_id,
        };

        const GroupMemberPayload2: GroupMemberTypeDTO = {
          conversation_id: String(ConversationDoc._id),
          user_id: user_id2,
        };

        await this.GroupMember?.create(GroupMemberPayload, session);
        await this.GroupMember?.create(GroupMemberPayload2, session);
      });
      console.log("The transaction was successful");
      return transactions;
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational,
        CustomError.stack
      );
    } finally {
      await session.endSession();
    }
  }

  async find(page: number, limit: number) {
    try {
      const response = await this.ConversationRepo.find(page, limit);
      return response;
    } catch (error) {
      const ErrorFormat = error as GlobalError;
      throw new GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
    }
  }
}
