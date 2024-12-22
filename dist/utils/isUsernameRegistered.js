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
exports.isUsernameRegistered = void 0;
const Users_1 = require("../models/Users");
const isUsernameRegistered = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isName = yield Users_1.UserModel.findOne({ username });
        if (isName) {
            return true;
        }
        return false;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.isUsernameRegistered = isUsernameRegistered;
//# sourceMappingURL=isUsernameRegistered.js.map