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
exports.GroupMemberRepo = void 0;
const globalError_1 = require("../utils/globalError");
class GroupMemberRepo {
    constructor(GroupMemberModel) {
        this.GroupMemberModel = GroupMemberModel;
    }
    create(payload, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GroupMemberDocs = new this.GroupMemberModel(payload);
                return yield GroupMemberDocs.save({ session });
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational);
            }
        });
    }
}
exports.GroupMemberRepo = GroupMemberRepo;
//# sourceMappingURL=GroupMember.js.map