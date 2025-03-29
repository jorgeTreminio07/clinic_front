import { create } from "zustand";
import { MODEFORMENUM } from "../../enum/mode/mode.enum";
import { IConsultReqDto } from "../../Dto/Request/consult.req.dto";
import { IConsult } from "../../interfaces/consult.interface";

interface IFormStore<T> {
  modeForm: MODEFORMENUM;
  showForm: boolean;
  toggleForm: () => void;
  setModeForm: (mode: MODEFORMENUM) => void;
  setItem: (item: T) => void;
  item?: T;
}


export const createFormStore = <T>() => {
  return create<IFormStore<T>>((set, get) => ({
    modeForm: MODEFORMENUM.CREATE,
    showForm: false,
    toggleForm: () => set({ showForm: !get().showForm }),
    setModeForm: (mode: MODEFORMENUM) => set({ modeForm: mode }),
    setItem: (item: T) => set({ item }),
    item: undefined,
  }));
};

// export const useCategoryFormStore = createFormStore<CategoryEntity>();
// export const useAttributeFormStore = createFormStore<AttributesEntity>();

export const useConsutlFormStore = createFormStore<IConsult>();
export const useReportFormStore =  createFormStore<number>();