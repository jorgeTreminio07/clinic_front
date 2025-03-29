import "reflect-metadata"; // this should be the first import
import { Container } from "inversify";
import { TYPES } from "./types";
import { AuthRepository } from "./domain/repository/auth/auth.repository";
import { AuthRepositoryImpl } from "./infrastructure/repository/auth/auth.repository.impl";
import { AuthDataSourceImpl } from "./infrastructure/datasource/auth/auth.datasource.impl";
import { BackupRespository } from "./domain/repository/backup/backup.repository";
import { BackupRepositoryImpl } from "./infrastructure/repository/backup/backup.repository.impl";
import { BackupDataSourceImpl } from "./infrastructure/datasource/backup/backup.datasource.impl";
import { UserRepository } from "./domain/repository/user/user.repository";
import { UserRepositoryImpl } from "./infrastructure/repository/user/user.repository.impl";
import { UserDataSourceImpl } from "./infrastructure/datasource/user/user.datasource.impl";
import { RolRepository } from "./domain/repository/rol/rol.repository";
import { RolRepositoryImpl } from "./infrastructure/repository/rol/rol.repository.impl";
import { RolDataSourceImpl } from "./infrastructure/datasource/rol/rol.datasource.impl";
const container = new Container();

container
  .bind<AuthRepository>(TYPES.AuthRepository)
  .toDynamicValue(() => new AuthRepositoryImpl(new AuthDataSourceImpl()))
  .inSingletonScope();
container
  .bind<BackupRespository>(TYPES.BackupRepository)
  .toDynamicValue(() => new BackupRepositoryImpl(new BackupDataSourceImpl()))
  .inSingletonScope();
container
  .bind<UserRepository>(TYPES.UserRepository)
  .toDynamicValue(() => new UserRepositoryImpl(new UserDataSourceImpl()))
  .inSingletonScope();
container
  .bind<RolRepository>(TYPES.RolRepository)
  .toDynamicValue(() => new RolRepositoryImpl(new RolDataSourceImpl()))
  .inSingletonScope();
  export { container };
