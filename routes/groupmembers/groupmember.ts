import { Router } from "express";
import { GroupMemberController } from "../../controllers/GroupMemberController";
import { GroupMemberService } from "../../services/GroupMemberService";
import { GroupMemberRepo } from "../../Repository/GroupMember";
import { GroupMemberModel } from "../../models/GroupMember";

export const GroupMemberRoute = Router();
const GroupMemberRepoImpl = new GroupMemberRepo(GroupMemberModel);
const GroupMemberServiceImpl = new GroupMemberService(GroupMemberRepoImpl);
const GroupMemberControllerImpl = new GroupMemberController(
  GroupMemberServiceImpl
);

GroupMemberRoute.post(
  "/join",
  GroupMemberControllerImpl.Join.bind(GroupMemberControllerImpl)
);
