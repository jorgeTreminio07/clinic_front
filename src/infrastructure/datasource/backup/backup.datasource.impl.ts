import axiosInstance from "../../../config/axios.config";
import { BackupDataSource } from "../../../domain/datasource/backup/backup.datasource";
import { IBackupModel } from "../../../domain/model/backup/backup.model";

export class BackupDataSourceImpl implements BackupDataSource {
  private BASE_URL: string = "/backup";

  async getAll(): Promise<IBackupModel[]> {
    const { data } = await axiosInstance.get<IBackupModel[]>(
      `${this.BASE_URL}`
    );
    return data;
  }
  async generate(): Promise<IBackupModel> {
    const { data } = await axiosInstance.post<IBackupModel>(
      `${this.BASE_URL}/create`
    );
    return data;
  }
  async delete(id: string): Promise<IBackupModel> {
    const { data } = await axiosInstance.delete<IBackupModel>(
      `${this.BASE_URL}/${id}`
    );
    return data;
  }
  async restore(id: string): Promise<IBackupModel> {
    const { data } = await axiosInstance.post<IBackupModel>(
      `${this.BASE_URL}/restore/${id}`
    );
    return data;
  }
}
