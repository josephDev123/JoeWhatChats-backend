"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomModel = void 0;
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    userEmail: { type: String },
    roomUniqueName: String,
    avatar: String,
    time: String,
    join: [],
});
exports.roomModel = (0, mongoose_1.model)("Room", RoomSchema);
//# sourceMappingURL=rooms.js.map