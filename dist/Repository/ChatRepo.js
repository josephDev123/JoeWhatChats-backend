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
exports.ChatRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const globalError_1 = require("../utils/globalError");
class ChatRepo {
    constructor(ChatModel, ConversationModel) {
        this.ChatModel = ChatModel;
        this.ConversationModel = ConversationModel;
    }
    createChat(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatDoc = new this.ChatModel(payload);
                return yield chatDoc.save();
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational);
            }
        });
    }
    find(messageConversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch messages
                const messagePipeline = [
                    {
                        $match: {
                            conversation_id: new mongoose_1.default.Types.ObjectId(messageConversation_id),
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "from_userId",
                            foreignField: "_id",
                            as: "from_UserDetails",
                        },
                    },
                    {
                        $unwind: "$from_UserDetails",
                    },
                ];
                const messages = yield this.ChatModel.aggregate(messagePipeline);
                // Step 2: Fetch group members and user details
                const groupMemberPipeline = [
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(messageConversation_id),
                        },
                    },
                    {
                        $lookup: {
                            from: "groupmembers",
                            localField: "_id",
                            foreignField: "conversation_id",
                            as: "GroupMembers",
                        },
                    },
                    {
                        $unwind: "$GroupMembers",
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "GroupMembers.user_id",
                            foreignField: "_id",
                            as: "UserDetails",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            GroupMembers: { $addToSet: "$GroupMembers" },
                            UserDetails: { $addToSet: { $arrayElemAt: ["$UserDetails", 0] } },
                        },
                    },
                ];
                const groupDetails = yield this.ConversationModel.aggregate(groupMemberPipeline);
                // Combine the responses
                return {
                    messages,
                    groupDetails: groupDetails[0] || { GroupMembers: [], UserDetails: [] },
                };
            }
            catch (error) {
                const customError = error;
                throw new globalError_1.GlobalError(customError.message, customError.name, 500, false);
            }
        });
    }
}
exports.ChatRepo = ChatRepo;
//# sourceMappingURL=ChatRepo.js.map