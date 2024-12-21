import { GroupMemberTypeDTO } from "../DTO/GroupMemberDTO";
import { GroupMemberRepo } from "../Repository/GroupMember";
import { GlobalError } from "../utils/globalError";

export class GroupMemberService {
  constructor(private readonly GroupMemberRepo: GroupMemberRepo) {}

  async Join(payload: GroupMemberTypeDTO) {
    try {
      const response = await this.GroupMemberRepo.create(payload);
      return response;
    } catch (error) {
      const CustomError = error as GlobalError;
      throw new GlobalError(
        CustomError.name,
        CustomError.message,
        CustomError.statusCode,
        CustomError.operational
      );
    }
  }
}
