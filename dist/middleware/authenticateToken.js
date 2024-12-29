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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const VerifyToken_1 = __importDefault(require("../utils/VerifyToken"));
const globalError_1 = require("../utils/globalError");
function authenticateToken(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenHeader = req.headers.cookie;
            // const tokenHeader = req.headers.authorization;
            if (!tokenHeader) {
                throw new globalError_1.GlobalError("Missing authorization header", "AuthorizationError", 403, true);
            }
            const tokenParts = tokenHeader.split(" ");
            // console.log(tokenParts);
            // const [tokenCredential, user] = tokenParts;
            const tokenCredential = tokenParts.filter((token) => token.startsWith("token"));
            // console.log(tokenCredential);
            let token = (_a = tokenCredential[0]) === null || _a === void 0 ? void 0 : _a.split("=")[1];
            //check if token is present
            if (!token) {
                throw new globalError_1.GlobalError("token not provided", "TokenError", 403, true);
            }
            // verify the token
            const verifyToken = yield (0, VerifyToken_1.default)(token ? token : "");
            next();
        }
        catch (error) {
            // Handle any errors that occur within the try block here.
            console.log(error.message);
            if ((error === null || error === void 0 ? void 0 : error.message) === "jwt expired") {
                throw new globalError_1.GlobalError("jwt expired", "TokenError", 403, true);
            }
            else if ((error === null || error === void 0 ? void 0 : error.message) === "jwt malformed") {
                throw new globalError_1.GlobalError("Json Web Token error/improper jwt structure", "TokenError", 403, true);
            }
            else {
                throw new globalError_1.GlobalError("server internal error", "ServerError", 500, true);
            }
        }
    });
}
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=authenticateToken.js.map