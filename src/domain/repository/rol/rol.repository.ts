import { RolEntity } from "../../entity/rol/rol.entity";

export interface RolRepository {
  getAll(): Promise<RolEntity[]>;
}
