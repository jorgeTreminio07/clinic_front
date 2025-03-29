import { create } from "zustand";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { IPatient } from "../../../../interfaces/patient.interface";

interface IPatientStore {
  showForm: boolean;
  toggleForm: () => void;
  setPatient: (patient: IPatient) => void;
  patient?: IPatient;
  modeForm: MODEFORMENUM;
  setModeForm: (mode: MODEFORMENUM) => void;
  titleForm?: string;
  // showDeleteModal: boolean;
}

export const usePatientStore = create<IPatientStore>()((set, get) => ({
  showForm: false,
  modeForm: MODEFORMENUM.CREATE,
  setPatient: (patient: IPatient) => set({ patient }),
  setModeForm: (mode: MODEFORMENUM) => set({ modeForm: mode, titleForm: mode === MODEFORMENUM.CREATE ? "Nuevo paciente" : "Editar paciente" }),
  toggleForm: () => set({ showForm: !get().showForm }),
  // setPatient: (patient: IPatient) => set({ patient }),
  // patient: undefined,
  // modeForm: MODEFORMENUM.CREATE,
  // setModeForm: (mode: MODEFORMENUM) => set({ modeForm: mode }),
  // titleForm: "",
  // showDeleteModal: false,
}));
