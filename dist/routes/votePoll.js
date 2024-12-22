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
exports.VoteRouter = void 0;
const express_1 = require("express");
const Polling_1 = require("../models/Polling");
const globalError_1 = require("../utils/globalError");
exports.VoteRouter = (0, express_1.Router)();
exports.VoteRouter.post("poll", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodyObj = req.body;
        const pollingReq = yield Polling_1.PollModel.updateOne({ _id: bodyObj.id, "options.option": bodyObj.option }, { $inc: { "option.count": 1 } });
    }
    catch (error) {
        const errorObj = new globalError_1.GlobalError("Something went wrong", "PollRelatedError", 500, false);
        return next(errorObj);
    }
}));
//# sourceMappingURL=votePoll.js.map