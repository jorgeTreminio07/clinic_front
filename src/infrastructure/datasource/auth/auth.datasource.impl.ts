import axiosInstance from "../../../config/axios.config";
import { AuthDataSource } from "../../../domain/datasource/auth/auth.datasource";
import { IAuthLoginReqDto } from "../../../domain/dto/request/auth/auth.req.dto";
import { IUserDataEntity } from "../../../domain/entity/user/IUserDataEntity";
import { IUserRolEntity } from "../../../domain/entity/user/IUserRolEntity";

export class AuthDataSourceImpl implements AuthDataSource {
  private BASE_URL: string = "/auth";
  async login(params: IAuthLoginReqDto): Promise<IUserDataEntity> {
    const { data } = await axiosInstance.post<IUserDataEntity>(
      `${this.BASE_URL}/login`,
      params
    );
    return data;
  }
  async me(): Promise<IUserRolEntity> {
    const { data } = await axiosInstance.get<IUserRolEntity>(
      `${this.BASE_URL}/me`
    );
    return data;
  }
  async refreshToken(param: string): Promise<IUserDataEntity> {
    const { data } = await axiosInstance.post<IUserDataEntity>(
      "/auth/refresh-token",
      {
        RefreshToken: param,
      }
    );
    return data;
  }
}
