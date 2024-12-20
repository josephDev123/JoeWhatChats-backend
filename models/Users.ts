import { string } from "joi";
import mongoose, { Document, Schema, Types } from "mongoose";

export type userType = {
  name: string;
  email: string;
  username: String;
  password: string;
  profile_img: String;
};
//user schema

const userSchema = new mongoose.Schema<userType>({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness
    // match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },

  password: {
    type: String,
    required: true,
    // maxlength: 10,
    // min: 6,
    unique: true,
  },

  username: {
    type: String,
    unique: true,
    validate: {
      validator: function (value: any) {
        // Alphanumeric with a length between 3 and 20 characters
        return /^[a-zA-Z0-9]{5,10}$/.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid username. Must be alphanumeric and between 3 to 20 characters.`,
    },
  },
  profile_img: String,
});

//user model

export const UserModel = mongoose.model("User", userSchema);
