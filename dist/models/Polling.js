"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModel = void 0;
const mongoose_1 = require("mongoose");
const pollingSchema = new mongoose_1.Schema({
    question: String,
    options: [
        { _id: String, option: String, count: { type: Number, default: 0 } },
    ],
    multiple_answer: Boolean,
    peopleWhovoted: [String],
}, { timestamps: true });
exports.PollModel = (0, mongoose_1.model)("Poll", pollingSchema);
//# sourceMappingURL=Polling.js.map