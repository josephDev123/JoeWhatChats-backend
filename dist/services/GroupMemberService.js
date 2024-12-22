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
exports.GroupMemberService = void 0;
const globalError_1 = require("../utils/globalError");
class GroupMemberService {
    constructor(GroupMemberRepo) {
        this.GroupMemberRepo = GroupMemberRepo;
    }
    Join(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.GroupMemberRepo.create(payload);
                return response;
            }
            catch (error) {
                const CustomError = error;
                throw new globalError_1.GlobalError(CustomError.name, CustomError.message, CustomError.statusCode, CustomError.operational);
            }
        });
    }
}
exports.GroupMemberService = GroupMemberService;
//# sourceMappingURL=GroupMemberService.js.map