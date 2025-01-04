import Mongoose, { Document, Schema } from "mongoose";
export interface ConversationType extends Document {
  creator: Schema.Types.ObjectId;
  avatar?: string;
  conversation_name?: string;
}

const ConversationSchema = new Schema<ConversationType>({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  avatar: String,
  conversation_name: String,
});

export const ConversationModel = Mongoose.model<ConversationType>(
  "Conversation",
  ConversationSchema
);
