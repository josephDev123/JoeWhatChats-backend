import * as bcrypt from "bcrypt";
import { UserModel } from "../models/Users";
import { hashPassword } from "./hashPassword";
import { GlobalError } from "./globalError";

// export const isPasswordAlreadyTaken = async (newPassword: string) => {
//   try {
//     const hashNewPassword = await hashPassword(newPassword);
//     const isPasswordRegistered = await UserModel.findOne({
//       password: hashNewPassword,
//     });
//     // const isPasswordRegistered = await bcrypt.compare(hashNewPassword, user.password);
//     console.log(isPasswordRegistered);
//     if (isPasswordRegistered) {
//       return true;
//     }
//   } catch (error) {
//     throw new Error("Something went wrong");
//     return;
//   }
// };

export const isEmailAlreadyUsed = async (email: string) => {
  try {
    const isEmail = await UserModel.findOne({ email: email });

    if (isEmail?.email !== undefined && isEmail?.email !== null) {
      return true;
    }
    // return false;
  } catch (error) {
    throw new Error("Something went wrong");
    return;
  }
};
