import { IBackupModel } from "../../model/backup/backup.model";

export interface BackupDataSource {
  getAll(): Promise<IBackupModel[]>;
  generate(): Promise<IBackupModel>;
  delete(id: string): Promise<IBackupModel>;
  restore(id: string): Promise<IBackupModel>;
}
