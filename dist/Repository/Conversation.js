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
exports.ConversationRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const globalError_1 = require("../utils/globalError");
// import { UpdateConversationDTO } from "../DTO/UpdateConversationDTO";
class ConversationRepo {
    constructor(ConversationModel) {
        this.ConversationModel = ConversationModel;
    }
    create(payload, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ConversationDocs = new this.ConversationModel(payload);
                return yield ConversationDocs.save({ session });
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational, CustomError.stack);
            }
        });
    }
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findIdResponse = yield this.ConversationModel.findById(id);
                const doc = {
                    conversation_name: payload.conversation_name || (findIdResponse === null || findIdResponse === void 0 ? void 0 : findIdResponse.conversation_name),
                    avatar: payload.avatar || (findIdResponse === null || findIdResponse === void 0 ? void 0 : findIdResponse.avatar),
                };
                return yield this.ConversationModel.findByIdAndUpdate(id, doc, {
                    new: true,
                });
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational, CustomError.stack);
            }
        });
    }
    find(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const ConversationAndMemberGroup = [
                    {
                        $lookup: {
                            from: "groupmembers",
                            localField: "_id",
                            foreignField: "conversation_id",
                            as: "ConversationWithMember",
                        },
                    },
                    {
                        $unwind: "$ConversationWithMember", // Flatten the array for easier lookup
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "ConversationWithMember.user_id",
                            foreignField: "_id",
                            as: "ConversationWithMember.userDetails",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            conversation_name: { $first: "$conversation_name" },
                            avatar: { $first: "$avatar" },
                            creator: { $first: "$creator" },
                            ConversationWithMember: { $push: "$ConversationWithMember" },
                        },
                    },
                    { $skip: skip },
                    { $limit: limit },
                ];
                const response = yield this.ConversationModel.aggregate(ConversationAndMemberGroup);
                return response;
            }
            catch (error) {
                const ErrorFormat = error;
                throw new globalError_1.GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
            }
        });
    }
    findBy(conversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ConversationAndMemberGroup = [
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(conversation_id) },
                    },
                    {
                        $lookup: {
                            from: "groupmembers",
                            localField: "_id",
                            foreignField: "conversation_id",
                            as: "ConversationWithMember",
                        },
                    },
                    {
                        $unwind: "$ConversationWithMember", // Flatten the array for easier lookup
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "ConversationWithMember.user_id",
                            foreignField: "_id",
                            as: "ConversationWithMember.userDetails",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            conversation_name: { $first: "$conversation_name" },
                            avatar: { $first: "$avatar" },
                            creator: { $first: "$creator" },
                            ConversationWithMember: { $push: "$ConversationWithMember" },
                        },
                    },
                ];
                const response = yield this.ConversationModel.aggregate(ConversationAndMemberGroup);
                return response;
            }
            catch (error) {
                const ErrorFormat = error;
                throw new globalError_1.GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
            }
        });
    }
    find_singleMember(user_id, user_id2) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user_id, user_id2);
            try {
                const ConversationAndMemberGroup = [
                    {
                        $lookup: {
                            from: "groupmembers",
                            localField: "_id",
                            foreignField: "conversation_id",
                            as: "ConversationWithMember",
                        },
                    },
                    {
                        $match: {
                            conversation_name: { $exists: false },
                            ConversationWithMember: {
                                $all: [
                                    {
                                        $elemMatch: { user_id: new mongoose_1.default.Types.ObjectId(user_id) },
                                    },
                                    {
                                        $elemMatch: {
                                            user_id: new mongoose_1.default.Types.ObjectId(user_id2),
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ];
                const response = yield this.ConversationModel.aggregate(ConversationAndMemberGroup);
                console.log("from check", response);
                return response;
            }
            catch (error) {
                const ErrorFormat = error;
                throw new globalError_1.GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
            }
        });
    }
}
exports.ConversationRepo = ConversationRepo;
//# sourceMappingURL=Conversation.js.map