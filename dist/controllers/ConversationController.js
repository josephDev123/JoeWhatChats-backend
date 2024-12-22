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
exports.ConversationController = void 0;
class ConversationController {
    constructor(ConversationService) {
        this.ConversationService = ConversationService;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const ExtractPayload = {
                    conversation_name: payload.conversation_name,
                };
                console.log(ExtractPayload);
                const result = yield this.ConversationService.create(ExtractPayload, payload.user_id);
                return res.json(result).status(200);
            }
            catch (error) {
                next(error);
            }
        });
    }
    create_single(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                // const ExtractPayload: ConversationDTO = {
                //   conversation_name: payload.conversation_name,
                // };
                // console.log(ExtractPayload);
                const result = yield this.ConversationService.create_single(payload.user_id, payload.user_id2);
                return res.json(result).status(200);
            }
            catch (error) {
                next(error);
            }
        });
    }
    find(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield req.body;
                const page = (_a = payload.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = payload.limit) !== null && _b !== void 0 ? _b : 4;
                const response = yield this.ConversationService.find(page, limit);
                return res.json({ data: response }).status(200);
            }
            catch (error) {
                const ErrorFormat = error;
                next(ErrorFormat);
            }
        });
    }
}
exports.ConversationController = ConversationController;
//# sourceMappingURL=ConversationController.js.map