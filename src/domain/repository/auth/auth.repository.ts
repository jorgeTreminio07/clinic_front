import { IAuthLoginReqDto } from "../../dto/request/auth/auth.req.dto";
import { IUserDataEntity } from "../../entity/user/IUserDataEntity";
import { IUserRolEntity } from "../../entity/user/IUserRolEntity";

export interface AuthRepository {
  login(params: IAuthLoginReqDto): Promise<IUserDataEntity>;
  me(): Promise<IUserRolEntity>;
  refreshToken(param: string): Promise<IUserDataEntity>;
}
