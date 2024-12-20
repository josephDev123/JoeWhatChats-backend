import { Schema } from "mongoose";

export interface GroupMemberTypeDTO {
  _id?: string;
  conversation_id: string;
  user_id: string;
  join_dateTime?: Date;
  left_dateTime?: Date;
}
