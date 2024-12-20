import { UserModel } from "../models/Users";

export const isUsernameRegistered = async (username: string) => {
  try {
    const isName = await UserModel.findOne({ username });
    if (isName) {
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
