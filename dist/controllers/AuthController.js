"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareTesting = exports.refresh_token = exports.ConfirmOtp = exports.users = exports.loginController = exports.register = void 0;
const hashPassword_1 = require("../utils/hashPassword");
const comparePassword_1 = require("../utils/comparePassword");
const Users_1 = require("../models/Users");
const authDataValidation_1 = require("../utils/authDataValidation");
const isRegisteredEmail_1 = require("../utils/isRegisteredEmail");
const createToken_1 = require("../utils/createToken");
const isUsernameRegistered_1 = require("../utils/isUsernameRegistered");
const unhashPassword_1 = require("../utils/unhashPassword");
const globalError_1 = require("../utils/globalError");
const node_test_1 = require("node:test");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, username, password, profile_img } = req.body;
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        // const isPasswordAlreadyUsed = await isPasswordAlreadyTaken(password);
        // const isEmailUsed = await isEmailAlreadyUsed(email);
        const validationResult = yield (0, authDataValidation_1.registercredentialValidation)(username, name, email, password);
        if (validationResult.error) {
            const validationError = new globalError_1.GlobalError(validationResult.error.message, "validateError", 400, true);
            return next(validationError);
        }
        const userData = yield Users_1.UserModel.findOne({ email: email });
        if (userData !== null) {
            const error = new globalError_1.GlobalError("Email already taken/registered", "RegistrationError", 400, true);
            return next(error);
        }
        if (userData !== null) {
            let isPasswordTaken = yield (0, unhashPassword_1.unhashPassword)(password, userData.password);
            console.log(isPasswordTaken);
            if (isPasswordTaken) {
                const error = new globalError_1.GlobalError("Password already taken/registered", "RegistrationError ", 400, true);
                return next(error);
            }
        }
        const alreadyRegistered = yield (0, comparePassword_1.isEmailAlreadyUsed)(email);
        if (alreadyRegistered) {
            const error = new globalError_1.GlobalError("Email already taken/registered", "RegistrationError", 400, true);
            return next(error);
        }
        console.log("hello");
        const newUser = new Users_1.UserModel({
            name: name,
            email: email,
            username: username,
            password: hashedPassword,
            profile_img: profile_img,
        });
        const user = yield newUser.save();
        // res.cookie("user", user, {});
        return res.status(201).json({
            error: false,
            showMessage: true,
            message: "New user created successfully",
            // data: userAndProfile,
        });
    }
    catch (error) {
        // console.log("trying", error);
        if (error.name === "RegistrationError") {
            const customError = new globalError_1.GlobalError(error.message, error.name, error.statusCode, error.operational);
            return next(customError);
        }
        else {
            const customError = new globalError_1.GlobalError("something went wrong", "unknownError", 500, false);
            return next(customError);
        }
    }
});
exports.register = register;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const dbForPassword = yield Users_1.UserModel.findOne({ email });
        // console.log(dbPassword);
        const validationResult = yield (0, authDataValidation_1.loginCredentialValidation)(username, email, password);
        if (validationResult.error) {
            // Handle validation error
            console.log("validation error");
            return res.json({
                error: true,
                showMessage: true,
                message: validationResult.error.message,
            });
        }
        const hashedPassword = dbForPassword === null || dbForPassword === void 0 ? void 0 : dbForPassword.password;
        const comparePassword = yield (0, unhashPassword_1.unhashPassword)(password, hashedPassword);
        if (comparePassword === false) {
            console.log("The password is not yet registered");
            return res.json({
                error: true,
                showMessage: true,
                message: "The password is not yet registered",
            });
        }
        const new_Email = yield (0, isRegisteredEmail_1.isRegisteredEmail)(email);
        if (new_Email === false) {
            console.log("The email is not yet registered");
            return res.json({
                error: true,
                showMessage: true,
                message: "The email is not yet registered",
            });
        }
        const checkUsernameAlreadyRegistered = yield (0, isUsernameRegistered_1.isUsernameRegistered)(username);
        if (checkUsernameAlreadyRegistered === false) {
            console.log("The username is not yet registered");
            return res.json({
                error: true,
                showMessage: true,
                message: "The name is not yet registered",
            });
        }
        const token = yield (0, createToken_1.createToken)(email);
        const user = yield Users_1.UserModel.findOne({ email: email });
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
    }
    catch (error) {
        return res.json({
            error: true,
            showMessage: false,
            message: error.message,
        });
    }
});
exports.loginController = loginController;
const users = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const payload = yield req.body;
        const page = (_a = Number(payload.page)) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = Number(payload.limit)) !== null && _b !== void 0 ? _b : 4;
        const skip = (page - 1) * limit;
        const response = yield Users_1.UserModel.find({}).skip(skip).limit(limit);
        return res.json({ data: response }).status(200);
    }
    catch (error) {
        const ErrorFormat = error;
        next(ErrorFormat);
    }
});
exports.users = users;
const ConfirmOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email } = req.body;
        const formatOtp = otp.split(",").join("");
        // console.log(formatOtp);
        const confirmOtp = yield Users_1.UserModel.findOne({
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
        }
        else {
            const updatedUser = yield Users_1.UserModel.findOneAndUpdate({ email: email }, { confirm_otp: true }, { new: false } // This option returns the updated document
            );
            console.log(updatedUser);
            res.cookie("user", JSON.stringify(updatedUser));
            return res
                .status(200)
                .json({ error: false, showMessage: true, message: "Otp confirm" });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            showMessage: false,
            message: error.message,
        });
    }
});
exports.ConfirmOtp = ConfirmOtp;
node_test_1.skip;
const refresh_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    try {
        //  1. check whether the user exist
        const userExists = yield Users_1.UserModel.findOne({ email });
        if (userExists) {
            // The user with the specified email exists
            // You can add your logic here
            const token = yield (0, createToken_1.createToken)(email);
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
        }
        else {
            // The user with the specified email does not exist
            // You can add your logic here
            return res.status(400).json({
                error: true,
                showMessage: false,
                message: "User doesn't exist",
                data: "",
            });
        }
    }
    catch (error) {
        // Handle any errors, such as a database connection issue
        console.error(`Error checking if the user exists: ${error}`);
        return res.status(200).json({
            error: true,
            showMessage: false,
            message: error.message,
        });
    }
});
exports.refresh_token = refresh_token;
const MiddlewareTesting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({
            error: false,
            showMessage: true,
            message: "hello world from the middleware testing",
        });
    }
    catch (error) {
        return res.json({
            error: true,
            showMessage: true,
            message: error.message,
        });
    }
});
exports.MiddlewareTesting = MiddlewareTesting;
//# sourceMappingURL=AuthController.js.map