import mongoose, { Schema } from "mongoose";

export interface GroupMemberType extends Document {
  _id: Schema.Types.ObjectId;
  conversation_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  join_dateTime: Date;
  left_dateTime: Date;
}

const GroupMemberSchema = new Schema<GroupMemberType>({
  conversation_id: { type: Schema.Types.ObjectId, ref: "Conversation" },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  join_dateTime: { type: Date, default: Date.now },
  left_dateTime: { type: Date },
});
export const GroupMemberModel = mongoose.model<GroupMemberType>(
  "GroupMember",
  GroupMemberSchema
);
