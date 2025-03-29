import axiosInstance from "../../../config/axios.config";
import { UserDataSource } from "../../../domain/datasource/user/user.datasource";
import { IAddUserReqDto } from "../../../domain/dto/request/user/addUser.req.dto";
import { IUpdateUserReqDto } from "../../../domain/dto/request/user/updateUser.req.dto";
import { IUserModel } from "../../../domain/model/user/user.model";

export class UserDataSourceImpl implements UserDataSource {
  private BASE_URL: string = "/user";
  async delete(id: string): Promise<IUserModel> {
    const { data } = await axiosInstance.delete<IUserModel>(
      `${this.BASE_URL}/${id}`
    );
    return data;
  }
  async add(user: IAddUserReqDto): Promise<IUserModel> {
    const { data } = await axiosInstance.post<IUserModel>(
      `${this.BASE_URL}/add`,
      user
    );
    return data;
  }
  async update(user: IUpdateUserReqDto): Promise<IUserModel> {
    const { data } = await axiosInstance.put<IUserModel>(
      `${this.BASE_URL}`,
      user
    );
    return data;
  }

  async getAll(): Promise<IUserModel[]> {
    const { data } = await axiosInstance.get<IUserModel[]>(`${this.BASE_URL}`);
    return data;
  }
}
