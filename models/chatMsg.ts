import mongoose, { model, Schema, Types } from "mongoose";

export interface chatMsgType {
  name: string;
  room: string;
  chat: string;
  time: string;
  img: string;
  type?: string;
  poll_id?: string;
}

const chatRoomSchema = new Schema<chatMsgType>({
  name: { type: String },
  room: { type: String },
  chat: { type: String },
  time: { type: String },
  img: { type: String },
  type: String,
  poll_id: { type: Schema.Types.ObjectId, ref: "Poll" },
});

export const chatMsgModel = model("chatMsg", chatRoomSchema);
