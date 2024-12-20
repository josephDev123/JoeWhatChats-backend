import { NextFunction, Request, Response, Router } from "express";
import { PollModel } from "../models/Polling";
import { GlobalError } from "../utils/globalError";

export const VoteRouter = Router();

VoteRouter.post(
  "poll",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyObj = req.body;
      const pollingReq = await PollModel.updateOne(
        { _id: bodyObj.id, "options.option": bodyObj.option },
        { $inc: { "option.count": 1 } }
      );
    } catch (error) {
      const errorObj = new GlobalError(
        "Something went wrong",
        "PollRelatedError",
        500,
        false
      );
      return next(errorObj);
    }
  }
);
