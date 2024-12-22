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
exports.chatMsgRoute = void 0;
const express_1 = require("express");
const chatMsg_1 = require("../../models/chatMsg");
const globalError_1 = require("../../utils/globalError");
exports.chatMsgRoute = (0, express_1.Router)();
exports.chatMsgRoute.get("/message/:channel", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { channel } = req.params;
    try {
        const chatMsg = yield chatMsg_1.chatMsgModel
            .find({ room: channel })
            .populate("poll_id");
        // console.log(chatMsg);
        return res.status(200).json({ data: chatMsg });
    }
    catch (error) {
        const errorHandler = new globalError_1.GlobalError("something went wrong", "UnknownError", 500, false);
        return next(errorHandler);
    }
}));
//# sourceMappingURL=chatMsg.js.map