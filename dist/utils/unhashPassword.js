"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unhashPassword = void 0;
// import * as bcrypt from "bcrypt";
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function unhashPassword(myPlaintextPassword, hash) {
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.compare(myPlaintextPassword, hash, function (err, result) {
            if (err) {
                reject(err.message);
            }
            else {
                resolve(result === true);
            }
        });
    });
}
exports.unhashPassword = unhashPassword;
//# sourceMappingURL=unhashPassword.js.map