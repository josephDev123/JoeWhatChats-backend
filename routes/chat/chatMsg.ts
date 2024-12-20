import { Request, Response, Router } from "express";
import { chatMsgType } from "../../models/chatMsg";
import { chatMsgModel } from "../../models/chatMsg";
import { GlobalError } from "../../utils/globalError";

export const chatMsgRoute = Router();

chatMsgRoute.get(
  "/message/:channel",
  async (req: Request, res: Response, next) => {
    const { channel } = req.params;
    try {
      const chatMsg = await chatMsgModel
        .find({ room: channel })
        .populate("poll_id");
      // console.log(chatMsg);
      return res.status(200).json({ data: chatMsg });
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
