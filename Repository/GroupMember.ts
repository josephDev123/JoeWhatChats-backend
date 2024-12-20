import mongoose, { Model } from "mongoose";
import { GroupMemberType } from "../models/GroupMember";
import { GroupMemberTypeDTO } from "../DTO/GroupMemberDTO";
import { GlobalError } from "../utils/globalError";

export class GroupMemberRepo {
  constructor(private readonly GroupMemberModel: Model<GroupMemberType>) {}
  async create(
    payload: GroupMemberTypeDTO,
    session?: mongoose.mongo.ClientSession
  ) {
    try {
      const GroupMemberDocs = new this.GroupMemberModel(payload);
      return await GroupMemberDocs.save({ session });
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
}
