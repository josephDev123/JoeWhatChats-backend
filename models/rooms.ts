import { model, Schema, Types } from "mongoose";

interface Room {
  userEmail: string;
  roomUniqueName: string;
  avatar: string;
  time: string;
  join: string[];
}

const RoomSchema = new Schema<Room>({
  userEmail: { type: String },
  roomUniqueName: String,
  avatar: String,
  time: String,
  join: [],
});

export const roomModel = model("Room", RoomSchema);
