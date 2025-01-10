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
exports.ConversationService = void 0;
const globalError_1 = require("../utils/globalError");
const mongoose_1 = __importDefault(require("mongoose"));
// import { UpdateConversationDTO } from "../DTO/UpdateConversationDTO";
class ConversationService {
    constructor(ConversationRepo, GroupMember) {
        this.ConversationRepo = ConversationRepo;
        this.GroupMember = GroupMember;
    }
    create(payload, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const option = {
            //   readPreference: "primary",
            //   readConcern: { level: "local" },
            //   writeConcern: { w: "majority" },
            // };
            //start session
            const session = yield mongoose_1.default.startSession();
            try {
                const transactions = yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const ConversationDoc = yield this.ConversationRepo.create(payload, session);
                    const GroupMemberPayload = {
                        conversation_id: String(ConversationDoc._id),
                        user_id: user_id,
                    };
                    yield ((_a = this.GroupMember) === null || _a === void 0 ? void 0 : _a.create(GroupMemberPayload, session));
                }));
                console.log("The transaction was successful");
                return transactions;
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational, CustomError.stack);
            }
            finally {
                yield session.endSession();
            }
        });
    }
    create_single(user_id, user_id2) {
        return __awaiter(this, void 0, void 0, function* () {
            // const option = {
            //   readPreference: "primary",
            //   readConcern: { level: "local" },
            //   writeConcern: { w: "majority" },
            // };
            //start session
            // console.log(user_id, user_id2);
            const check = yield this.ConversationRepo.find_singleMember(user_id, user_id2);
            // console.log("check ", check);
            // return check;
            if (check.length > 0) {
                throw new globalError_1.GlobalError("Conversation already exist", "ConversationError", 400, false);
            }
            const session = yield mongoose_1.default.startSession();
            try {
                const transactions = yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const payload = {};
                    const ConversationDoc = yield this.ConversationRepo.create(payload, session);
                    const GroupMemberPayload = {
                        conversation_id: String(ConversationDoc._id),
                        user_id: user_id,
                    };
                    const GroupMemberPayload2 = {
                        conversation_id: String(ConversationDoc._id),
                        user_id: user_id2,
                    };
                    yield ((_a = this.GroupMember) === null || _a === void 0 ? void 0 : _a.create(GroupMemberPayload, session));
                    yield ((_b = this.GroupMember) === null || _b === void 0 ? void 0 : _b.create(GroupMemberPayload2, session));
                }));
                console.log("The transaction was successful");
                return transactions;
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational, CustomError.stack);
            }
            finally {
                yield session.endSession();
            }
        });
    }
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ConversationRepo.update(id, payload);
                return response;
            }
            catch (error) {
                const ErrorFormat = error;
                throw new globalError_1.GlobalError(ErrorFormat.message, ErrorFormat.name, ErrorFormat.statusCode, ErrorFormat.operational, ErrorFormat.stack);
            }
        });
    }
    find(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ConversationRepo.find(page, limit);
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
                const response = yield this.ConversationRepo.findBy(conversation_id);
                return response;
            }
            catch (error) {
                const ErrorFormat = error;
                throw new globalError_1.GlobalError(ErrorFormat.message, ErrorFormat.name, 400, false);
            }
        });
    }
}
exports.ConversationService = ConversationService;
//# sourceMappingURL=Conversation.js.map