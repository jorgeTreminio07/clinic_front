import { BackupEntity } from "../../entity/backup/backup.entity";

export interface BackupRespository {
  getAll(): Promise<BackupEntity[]>;
  generate(): Promise<BackupEntity>;
  delete(id: string): Promise<BackupEntity>;
  restore(id: string): Promise<BackupEntity>;
}
