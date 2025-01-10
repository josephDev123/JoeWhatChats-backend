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
exports.Conversation = void 0;
const express_1 = require("express");
const globalError_1 = require("../../utils/globalError");
const rooms_1 = require("../../models/rooms");
const ConversationController_1 = require("../../controllers/ConversationController");
const Conversation_1 = require("../../services/Conversation");
const Conversation_2 = require("../../Repository/Conversation");
const Conversation_3 = require("../../models/Conversation");
const GroupMember_1 = require("../../Repository/GroupMember");
const GroupMember_2 = require("../../models/GroupMember");
exports.Conversation = (0, express_1.Router)();
const GroupMemberRepoImp = new GroupMember_1.GroupMemberRepo(GroupMember_2.GroupMemberModel);
const ConversationRepoImp = new Conversation_2.ConversationRepo(Conversation_3.ConversationModel);
const ConversationServiceImp = new Conversation_1.ConversationService(ConversationRepoImp, GroupMemberRepoImp);
const ConversationControllerImp = new ConversationController_1.ConversationController(ConversationServiceImp);
exports.Conversation.post("/create", ConversationControllerImp.create.bind(ConversationControllerImp));
exports.Conversation.post("/create-single", ConversationControllerImp.create_single.bind(ConversationControllerImp));
exports.Conversation.put("/update-group", ConversationControllerImp.update.bind(ConversationControllerImp));
exports.Conversation.get("/", ConversationControllerImp.find.bind(ConversationControllerImp));
exports.Conversation.get("/:id", ConversationControllerImp.findBy.bind(ConversationControllerImp));
//old route
exports.Conversation.get("/:email", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.params;
            const resp = yield rooms_1.roomModel.find({
                $or: [
                    { userEmail: email },
                    { join: { $elemMatch: { userEmail: email } } },
                ],
            });
            // console.log("hello" + resp);
            return res.status(200).json(resp);
        }
        catch (error) {
            const errorHandler = new globalError_1.GlobalError("something went wrong", "UnknownError", 500, false);
            return next(errorHandler);
        }
    });
});
exports.Conversation.get("/channel/:channel", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { channel } = req.params;
            const resp = yield rooms_1.roomModel.find({ roomUniqueName: channel });
            console.log(resp);
            return res.status(200).json(resp);
        }
        catch (error) {
            const errorHandler = new globalError_1.GlobalError("something went wrong", "UnknownError", 500, false);
            return next(errorHandler);
        }
    });
});
// chatRoomRoute.put(
//   "/:room",
//   async function (req: Request, res: Response, next: NextFunction) {
//     try {
//       const { room } = req.params;
//       const roomResp = await roomModel.find(
//         { room: room },
//         { join: { $add: [] } }
//       );
//       // if (!roomResp) {
//       //   const errorHandler = new GlobalError(
//       //     "You cannot joined un-existed room",
//       //     "RoomError",
//       //     500,
//       //     true
//       //   );
//       //   return next(errorHandler);
//       // }
//       return res
//         .status(200)
//         .json({ data: roomResp, message: "invite successful" });
//     } catch (error) {
//       const errorHandler = new GlobalError(
//         "something went wrong",
//         "UnknownError",
//         500,
//         false
//       );
//       return next(errorHandler);
//     }
//   }
// );
//# sourceMappingURL=conversation.js.map