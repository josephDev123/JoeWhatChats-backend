import { Model } from "mongoose";
import { GroupMemberType } from "../models/GroupMember";

export class GroupMemberRepo {
  constructor(private readonly GroupMemberModel: Model<GroupMemberType>) {}

  async Join() {}
}
