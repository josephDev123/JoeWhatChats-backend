"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMsgModel = void 0;
const mongoose_1 = require("mongoose");
const chatRoomSchema = new mongoose_1.Schema({
    name: { type: String },
    room: { type: String },
    chat: { type: String },
    time: { type: String },
    img: { type: String },
    type: String,
    poll_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Poll" },
});
exports.chatMsgModel = (0, mongoose_1.model)("chatMsg", chatRoomSchema);
//# sourceMappingURL=chatMsg.js.map