import { injectable } from "inversify";
import type { AuthDataSource } from "../../../domain/datasource/auth/auth.datasource";
import { AuthRepository } from "../../../domain/repository/auth/auth.repository";
import { IAuthLoginReqDto } from "../../../domain/dto/request/auth/auth.req.dto";
import { IUserDataEntity } from "../../../domain/entity/user/IUserDataEntity";
import { IUserRolEntity } from "../../../domain/entity/user/IUserRolEntity";

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private datasource: AuthDataSource;

  constructor(datasource: AuthDataSource) {
    this.datasource = datasource;
  }

  async login(params: IAuthLoginReqDto): Promise<IUserDataEntity> {
    return this.datasource.login(params);
  }
  async me(): Promise<IUserRolEntity> {
    return this.datasource.me();
  }
  async refreshToken(param: string): Promise<IUserDataEntity> {
    return await this.datasource.refreshToken(param);
  }
}
