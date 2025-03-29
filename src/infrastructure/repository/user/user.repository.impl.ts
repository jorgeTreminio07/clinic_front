import { UserDataSource } from "../../../domain/datasource/user/user.datasource";
import { IAddUserReqDto } from "../../../domain/dto/request/user/addUser.req.dto";
import { IUpdateUserReqDto } from "../../../domain/dto/request/user/updateUser.req.dto";
import { ImageEntity } from "../../../domain/entity/image/image.entity";
import { RolEntity } from "../../../domain/entity/rol/rol.entity";
import { UserEntity } from "../../../domain/entity/user/user.entity";
import { IUserModel } from "../../../domain/model/user/user.model";
import { UserRepository } from "../../../domain/repository/user/user.repository";

export class UserRepositoryImpl implements UserRepository {
  private readonly datasource: UserDataSource;

  constructor(datasource: UserDataSource) {
    this.datasource = datasource;
  }
  async delete(id: string): Promise<IUserModel> {
    const response = await this.datasource.delete(id);
    return response;
  }
  async add(user: IAddUserReqDto): Promise<IUserModel> {
    const response = await this.datasource.add(user);
    return response;
  }
  async update(user: IUpdateUserReqDto): Promise<IUserModel> {
    const response = await this.datasource.update(user);
    return response;
  }

  async getAll(): Promise<UserEntity[]> {
    const response = await this.datasource.getAll();
    return response.map((item) => {
      const rolEntity = new RolEntity(item.rol!.id, item.rol!.name);
      const avatar = new ImageEntity(
        item.avatar!.id,
        item.avatar!.originalUrl,
        item.avatar!.compactUrl
      );

      return new UserEntity(
        item.id,
        item.name,
        item.email,
        rolEntity,
        avatar,
      );
    });
  }
}
