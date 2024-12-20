import Mongoose, { Document, Schema } from "mongoose";
export interface ConversationType extends Document {
  conversation_name?: string;
}

const ConversationSchema = new Schema<ConversationType>({
  conversation_name: String,
});

export const ConversationModel = Mongoose.model<ConversationType>(
  "Conversation",
  ConversationSchema
);
