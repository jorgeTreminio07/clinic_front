import { create } from "zustand";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { IGroup } from "../../../../interfaces/group.interface";
import { IExam } from "../../../../interfaces/exam.interface";

interface IGroupStore {
  showForm: boolean;
  toggleForm: () => void;
  setExam: (patient: IExam) => void;
  exam?: IExam; 
  modeForm: MODEFORMENUM;
  setModeForm: (mode: MODEFORMENUM) => void;
  titleForm?: string;
  showDeleteModal: boolean;
}

export const useGroupsStore = create<IGroupStore>()((set, get) => ({
  showForm: false,
  modeForm: MODEFORMENUM.CREATE,
  setExam: (exam: IExam) => set({ exam }),
  setModeForm: (mode: MODEFORMENUM) => set({ modeForm: mode, titleForm: mode === MODEFORMENUM.CREATE ? "Nuevo Examen" : "Editar Examen" }),
  toggleForm: () => set({ showForm: !get().showForm }),
  setPatient: (exam: IExam) => set({ exam }),
  patient: undefined,
  titleForm: "",
  showDeleteModal: false,
}));
