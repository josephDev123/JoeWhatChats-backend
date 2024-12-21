import { NextFunction, Request, Response } from "express";
import { GroupMemberService } from "../services/GroupMemberService";
import { GroupMemberTypeDTO } from "../DTO/GroupMemberDTO";
import { GlobalError } from "../utils/globalError";

export class GroupMemberController {
  constructor(private readonly GroupMemberService: GroupMemberService) {}
  async Join(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: GroupMemberTypeDTO = req.body;

      const response = await this.GroupMemberService.Join(payload);
      return res.status(200).json({ data: response });
    } catch (error) {
      const CustomError = error as GlobalError;
      return next(CustomError);
    }
  }
}
