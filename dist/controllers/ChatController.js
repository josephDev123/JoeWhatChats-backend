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
exports.ChatController = void 0;
class ChatController {
    constructor(ChatService) {
        this.ChatService = ChatService;
    }
    createChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const ExtractPayload = {
                    message_text: payload.message_text,
                    from_userId: payload.from_userId,
                    message_type: payload.message_type,
                    imgUrl: payload.imgUrl,
                    conversation_id: payload.conversation_id,
                    sent_datetime: payload.sent_datetime,
                };
                const result = yield this.ChatService.CreateChat(ExtractPayload);
                // console.log(result);
                return res.status(200).json({
                    message: "Successfully created a chat",
                    data: result,
                });
            }
            catch (error) {
                const CustomError = error;
                next(CustomError);
            }
        });
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const queryPayload = query;
                const response = yield this.ChatService.find(queryPayload === null || queryPayload === void 0 ? void 0 : queryPayload.conversation_id);
                console.log(response);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                const customError = error;
                return next(customError);
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=ChatController.js.map