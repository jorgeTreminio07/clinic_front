import { create } from "zustand";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { UserEntity } from "../../../../domain/entity/user/user.entity";

interface IUserStore {
  user?: UserEntity;
  modeForm: MODEFORMENUM;
  titleForm?: string;
  showForm: boolean;
  toggleForm: () => void;
  setModeForm: (mode: MODEFORMENUM) => void;
  setUser: (user: UserEntity) => void;
}

export const useUserStore = create<IUserStore>()((set, get) => ({
  modeForm: MODEFORMENUM.CREATE,
  showForm: false,
  toggleForm: () => set({ showForm: !get().showForm }),
  setModeForm: (mode: MODEFORMENUM) => {
    set({
      modeForm: mode,
      titleForm:
        mode === MODEFORMENUM.CREATE ? "Nuevo usuario" : "Editar usuario",
    });
  },
  setUser: (user: UserEntity) => set({ user }),
}));
