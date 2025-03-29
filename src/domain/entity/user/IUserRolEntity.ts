import { IImageEntity } from "../image/IImageEntity";
import { IRolEntity } from "../rol/IRolEntity";

export interface IUserRolEntity {
  id: string;
  name: string;
  email: string;
  rol?: any;
  avatar?: IImageEntity;
  routes?: string[];
}
