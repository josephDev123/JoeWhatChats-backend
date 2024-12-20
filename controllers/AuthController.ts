import { Request, Response, NextFunction } from "express";
import { hashPassword } from "../utils/hashPassword";
import { isEmailAlreadyUsed } from "../utils/comparePassword";
import { UserModel } from "../models/Users";
import {
  loginCredentialValidation,
  registercredentialValidation,
} from "../utils/authDataValidation";
import { isRegisteredEmail } from "../utils/isRegisteredEmail";
import { createToken } from "../utils/createToken";
import { isUsernameRegistered } from "../utils/isUsernameRegistered";
import { unhashPassword } from "../utils/unhashPassword";
import { GlobalError } from "../utils/globalError";
import { skip } from "node:test";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, username, password, profile_img } = req.body;
    const hashedPassword = await hashPassword(password);
    // const isPasswordAlreadyUsed = await isPasswordAlreadyTaken(password);
    // const isEmailUsed = await isEmailAlreadyUsed(email);

    const validationResult = await registercredentialValidation(
      username,
      name,
      email,
      password
    );

    if (validationResult.error) {
      const validationError = new GlobalError(
        validationResult.error.message,
        "validateError",
        400,
        true
      );

      return next(validationError);
    }

    const userData: any = await UserModel.findOne({ email: email });

    if (userData !== null) {
      const error = new GlobalError(
        "Email already taken/registered",
        "RegistrationError",
        400,
        true
      );
      return next(error);
    }

    if (userData !== null) {
      let isPasswordTaken = await unhashPassword(password, userData.password);
      console.log(isPasswordTaken);
      if (isPasswordTaken) {
        const error = new GlobalError(
          "Password already taken/registered",
          "RegistrationError ",
          400,
          true
        );
        return next(error);
      }
    }

    const alreadyRegistered = await isEmailAlreadyUsed(email);
    if (alreadyRegistered) {
      const error = new GlobalError(
        "Email already taken/registered",
        "RegistrationError",
        400,
        true
      );
      return next(error);
    }
    console.log("hello");
    const newUser = new UserModel({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
      profile_img: profile_img,
    });
    const user = await newUser.save();
    // res.cookie("user", user, {});
    return res.status(201).json({
      error: false,
      showMessage: true,
      message: "New user created successfully",
      // data: userAndProfile,
    });
  } catch (error: any) {
    // console.log("trying", error);
    if (error.name === "RegistrationError") {
      const customError = new GlobalError(
        error.message,
        error.name,
        error.statusCode,
        error.operational
      );
      return next(customError);
    } else {
      const customError = new GlobalError(
        "something went wrong",
        "unknownError",
        500,
        false
      );
      return next(customError);
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const dbForPassword = await UserModel.findOne({ email });
    // console.log(dbPassword);

    const validationResult = await loginCredentialValidation(
      username,
      email,
      password
    );

    if (validationResult.error) {
      // Handle validation error
      console.log("validation error");
      return res.json({
        error: true,
        showMessage: true,
        message: validationResult.error.message,
      });
    }

    const hashedPassword = dbForPassword?.password;
    const comparePassword = await unhashPassword(password, hashedPassword);

    if (comparePassword === false) {
      console.log("The password is not yet registered");
      return res.json({
        error: true,
        showMessage: true,
        message: "The password is not yet registered",
      });
    }

    const new_Email = await isRegisteredEmail(email);
    if (new_Email === false) {
      console.log("The email is not yet registered");
      return res.json({
        error: true,
        showMessage: true,
        message: "The email is not yet registered",
      });
    }

    const checkUsernameAlreadyRegistered = await isUsernameRegistered(username);
    if (checkUsernameAlreadyRegistered === false) {
      console.log("The username is not yet registered");
      return res.json({
        error: true,
        showMessage: true,
        message: "The name is not yet registered",
      });
    }
    const token = await createToken(email);

    const user = await UserModel.findOne({ email: email });

    res.cookie("token", token, {
      maxAge: 300000,
      secure: true,
      httpOnly: false,
    });
    // res.cookie("user", JSON.stringify(user));

    return res.json({
      success: true,
      showMessage: true,
      data: user,
      message: "login successful",
    });
  } catch (error) {
    return res.json({
      error: true,
      showMessage: false,
      message: (error as Error).message,
    });
  }
};

export const users = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = await req.body;
    const page = Number(payload.page) ?? 1;
    const limit = Number(payload.limit) ?? 4;
    const skip = (page - 1) * limit;
    const response = await UserModel.find({}).skip(skip).limit(limit);
    return res.json({ data: response }).status(200);
  } catch (error) {
    const ErrorFormat = error as GlobalError;
    next(ErrorFormat);
  }
};

export const ConfirmOtp = async (req: Request, res: Response) => {
  try {
    const { otp, email } = req.body;
    const formatOtp = otp.split(",").join("");
    // console.log(formatOtp);

    const confirmOtp = await UserModel.findOne({
      email: email,
      otp: formatOtp,
    });

    // console.log(confirmOtp);

    if (!confirmOtp) {
      return res.status(500).json({
        error: true,
        showMessage: true,
        message: "User/Otp not found",
      });
    } else {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email },
        { confirm_otp: true },
        { new: false } // This option returns the updated document
      );
      console.log(updatedUser);
      res.cookie("user", JSON.stringify(updatedUser));

      return res
        .status(200)
        .json({ error: false, showMessage: true, message: "Otp confirm" });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      showMessage: false,
      message: (error as Error).message,
    });
  }
};
skip;

export const refresh_token = async (req: Request, res: Response) => {
  const { email } = req.query;

  try {
    //  1. check whether the user exist
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      // The user with the specified email exists
      // You can add your logic here
      const token = await createToken(email);
      // console.log(token);
      res.cookie("token", token, {
        maxAge: 300000,
        secure: true,
        httpOnly: false,
      });
      return res.status(200).json({
        error: false,
        showMessage: true,
        message: "token created successful",
        data: token,
      });
    } else {
      // The user with the specified email does not exist
      // You can add your logic here
      return res.status(400).json({
        error: true,
        showMessage: false,
        message: "User doesn't exist",
        data: "",
      });
    }
  } catch (error) {
    // Handle any errors, such as a database connection issue
    console.error(`Error checking if the user exists: ${error}`);
    return res.status(200).json({
      error: true,
      showMessage: false,
      message: (error as Error).message,
    });
  }
};

export const MiddlewareTesting = async (req: Request, res: Response) => {
  try {
    return res.json({
      error: false,
      showMessage: true,
      message: "hello world from the middleware testing",
    });
  } catch (error: any) {
    return res.json({
      error: true,
      showMessage: true,
      message: error.message,
    });
  }
};
