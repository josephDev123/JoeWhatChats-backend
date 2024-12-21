import mongoose, { mongo, Schema } from "mongoose";

export interface ChatType extends Document {
  message_text: string;
  // from_number: Schema.Types.ObjectId;
  message_type: string;
  imgUrl: string;
  conversation_id: Schema.Types.ObjectId;
  sent_datetime: string;
}

const ChatSchema = new Schema<ChatType>({
  message_text: { type: String },
  // from_number: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message_type: { required: true, type: String },
  imgUrl: { required: true, type: String },
  conversation_id: { type: Schema.Types.ObjectId, ref: "Conversation" },
  sent_datetime: { type: String },
});

export const ChatModel = mongoose.model<ChatType>("Chat", ChatSchema);
