import { Router } from "express";
import { GlobalError } from "../../utils/globalError";
import { roomModel } from "../../models/rooms";
import { Request, Response, NextFunction } from "express";
import { ConversationController } from "../../controllers/ConversationController";
import { ConversationService } from "../../services/Conversation";
import { ConversationRepo } from "../../Repository/Conversation";
import { ConversationModel } from "../../models/Conversation";
import { GroupMemberRepo } from "../../Repository/GroupMember";
import { GroupMemberModel } from "../../models/GroupMember";

export const Conversation = Router();

const GroupMemberRepoImp = new GroupMemberRepo(GroupMemberModel);
const ConversationRepoImp = new ConversationRepo(ConversationModel);
const ConversationServiceImp = new ConversationService(
  ConversationRepoImp,
  GroupMemberRepoImp
);
const ConversationControllerImp = new ConversationController(
  ConversationServiceImp
);

Conversation.post(
  "/create",
  ConversationControllerImp.create.bind(ConversationControllerImp)
  // async function (req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const body = req.body;
  //     const doc = new roomModel({
  //       userEmail: body.userEmail,
  //       roomUniqueName: body.roomUniqueName,
  //       avatar: body.avatar,
  //       time: body.time,
  //     });
  //     await doc.save();
  //     return res.status(200).json({ msg: "success" });
  //   } catch (error) {
  //     const errorHandler = new GlobalError(
  //       "something went wrong",
  //       "UnknownError",
  //       500,
  //       false
  //     );
  //     return next(errorHandler);
  //   }
  // }
);

Conversation.post(
  "/create-single",
  ConversationControllerImp.create_single.bind(ConversationControllerImp)
);

Conversation.get(
  "/",
  ConversationControllerImp.find.bind(ConversationControllerImp)
);

//old route

Conversation.get(
  "/:email",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;

      const resp = await roomModel.find({
        $or: [
          { userEmail: email },
          { join: { $elemMatch: { userEmail: email } } },
        ],
      });

      // console.log("hello" + resp);
      return res.status(200).json(resp);
    } catch (error) {
      const errorHandler = new GlobalError(
        "something went wrong",
        "UnknownError",
        500,
        false
      );
      return next(errorHandler);
    }
  }
);

Conversation.get(
  "/channel/:channel",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { channel } = req.params;

      const resp = await roomModel.find({ roomUniqueName: channel });
      console.log(resp);
      return res.status(200).json(resp);
    } catch (error) {
      const errorHandler = new GlobalError(
        "something went wrong",
        "UnknownError",
        500,
        false
      );
      return next(errorHandler);
    }
  }
);

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
