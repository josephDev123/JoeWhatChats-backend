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
exports.ChatService = void 0;
const globalError_1 = require("../utils/globalError");
class ChatService {
    constructor(ChatRepo) {
        this.ChatRepo = ChatRepo;
    }
    CreateChat(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatDoc = yield this.ChatRepo.createChat(payload);
                return chatDoc;
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational, CustomError.stack);
            }
        });
    }
    find(messageConversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ChatRepo.find(messageConversation_id);
                return response;
            }
            catch (error) {
                const customError = error;
                throw new globalError_1.GlobalError(customError.message, customError.name, 500, false);
            }
        });
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=ChatService.js.map