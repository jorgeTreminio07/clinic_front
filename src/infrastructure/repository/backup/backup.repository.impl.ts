import { BackupDataSource } from "../../../domain/datasource/backup/backup.datasource";
import { BackupEntity } from "../../../domain/entity/backup/backup.entity";
import { BackupRespository } from "../../../domain/repository/backup/backup.repository";

export class BackupRepositoryImpl implements BackupRespository {
  private _datasource: BackupDataSource;

  constructor(datasource: BackupDataSource) {
    this._datasource = datasource;
  }

  async getAll(): Promise<BackupEntity[]> {
    return (await this._datasource.getAll()).map(
      (item) => new BackupEntity(item.id, item.name, item.createdAt)
    );
  }
  async generate(): Promise<BackupEntity> {
    const backup = await this._datasource.generate();
    return new BackupEntity(backup.id, backup.name, backup.createdAt);
  }
  async delete(id: string): Promise<BackupEntity> {
    const reponse = await this._datasource.delete(id);
    return new BackupEntity(reponse.id, reponse.name, reponse.createdAt);
  }
  async restore(id: string): Promise<BackupEntity> {
    const reponse = await this._datasource.restore(id);
    return new BackupEntity(reponse.id, reponse.name, reponse.createdAt);
  }
}
