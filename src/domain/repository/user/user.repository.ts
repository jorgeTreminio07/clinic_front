import { IAddUserReqDto } from "../../dto/request/user/addUser.req.dto";
import { IUpdateUserReqDto } from "../../dto/request/user/updateUser.req.dto";
import { UserEntity } from "../../entity/user/user.entity";
import { IUserModel } from "../../model/user/user.model";

export interface UserRepository {
  getAll(): Promise<UserEntity[]>;
  add(user: IAddUserReqDto): Promise<IUserModel>;
  update(user: IUpdateUserReqDto): Promise<IUserModel>;
  delete(id: string): Promise<IUserModel>;
}
