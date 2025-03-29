import { RolDataSource } from "../../../domain/datasource/rol/rol.datasource";
import { RolEntity } from "../../../domain/entity/rol/rol.entity";
import { RolRepository } from "../../../domain/repository/rol/rol.repository";

export class RolRepositoryImpl implements RolRepository {
  private readonly datasource: RolDataSource;

  constructor(datasource: RolDataSource) {
    this.datasource = datasource;
  }

  async getAll(): Promise<RolEntity[]> {
    const response = await this.datasource.getAll();
    return response.map((item) => new RolEntity(item.id, item.name));
  }
}
