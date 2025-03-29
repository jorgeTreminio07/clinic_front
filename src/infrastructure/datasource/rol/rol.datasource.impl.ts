import axiosInstance from "../../../config/axios.config";
import { RolDataSource } from "../../../domain/datasource/rol/rol.datasource";
import { IRolModel } from "../../../domain/model/rol/rol.model";

export class RolDataSourceImpl implements RolDataSource {
  private readonly BASE_URL: string = "/rol";
  async getAll(): Promise<IRolModel[]> {
    const { data } = await axiosInstance.get<IRolModel[]>(`${this.BASE_URL}`);
    return data;
  }
}
