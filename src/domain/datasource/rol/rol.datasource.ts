import { IRolModel } from "../../model/rol/rol.model";

export interface RolDataSource {
  getAll(): Promise<IRolModel[]>;
}
