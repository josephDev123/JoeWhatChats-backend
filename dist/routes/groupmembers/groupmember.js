"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMemberRoute = void 0;
const express_1 = require("express");
const GroupMemberController_1 = require("../../controllers/GroupMemberController");
const GroupMemberService_1 = require("../../services/GroupMemberService");
const GroupMember_1 = require("../../Repository/GroupMember");
const GroupMember_2 = require("../../models/GroupMember");
exports.GroupMemberRoute = (0, express_1.Router)();
const GroupMemberRepoImpl = new GroupMember_1.GroupMemberRepo(GroupMember_2.GroupMemberModel);
const GroupMemberServiceImpl = new GroupMemberService_1.GroupMemberService(GroupMemberRepoImpl);
const GroupMemberControllerImpl = new GroupMemberController_1.GroupMemberController(GroupMemberServiceImpl);
exports.GroupMemberRoute.post("/join", GroupMemberControllerImpl.Join.bind(GroupMemberControllerImpl));
//# sourceMappingURL=groupmember.js.map