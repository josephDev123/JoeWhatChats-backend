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
exports.isEmailAlreadyUsed = void 0;
const Users_1 = require("../models/Users");
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
const isEmailAlreadyUsed = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isEmail = yield Users_1.UserModel.findOne({ email: email });
        if ((isEmail === null || isEmail === void 0 ? void 0 : isEmail.email) !== undefined && (isEmail === null || isEmail === void 0 ? void 0 : isEmail.email) !== null) {
            return true;
        }
        // return false;
    }
    catch (error) {
        throw new Error("Something went wrong");
        return;
    }
});
exports.isEmailAlreadyUsed = isEmailAlreadyUsed;
//# sourceMappingURL=comparePassword.js.map