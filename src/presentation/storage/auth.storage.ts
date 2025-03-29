/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUserDataEntity } from "../../domain/entity/user/IUserDataEntity";
import { queryClient } from "../../config/query.config";

export interface IAuthStore {
  setUserData: (data: IUserDataEntity) => void;
  logOut: () => void;
  isAuth: () => boolean;
  userData?: IUserDataEntity;
}


export const useAuthStore = create(
  persist<IAuthStore>(
    (set, get) => ({
      setUserData: (data: IUserDataEntity) =>
        set({
          userData: data,
        }),
      logOut: () => {
        set({ userData: undefined });
        queryClient.clear();
      },
      isAuth: () => {
        return !!get().userData?.token;
      },
    }),
    {
      name: "auth",
    }
  )
);
