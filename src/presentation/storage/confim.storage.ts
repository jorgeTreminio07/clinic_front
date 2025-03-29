import { create } from "zustand";

interface IConfirmStore {
  showConfirm: (
    title: string,
    description: string,
    onConfirm?: () => void
  ) => void;
  hideConfirm: () => void;
  confirm: () => void; // Método para ejecutar el callback y cerrar el modal
  title: string;
  description: string;
  isOpen: boolean;
  onConfirm?: () => void; // Callback opcional
}

export const useConfirmStore = create<IConfirmStore>()((set) => ({
  showConfirm: (title, description, onConfirm) => {
    set({ title, description, isOpen: true, onConfirm });
  },
  hideConfirm: () => {
    set({ title: "", description: "", isOpen: false, onConfirm: undefined });
  },
  confirm: () => {
    set((state) => {
      // Ejecutar el callback si está definido
      state.onConfirm?.();
      // Cerrar el modal
      return { title: "", description: "", isOpen: false, onConfirm: undefined };
    });
  },
  title: "",
  description: "",
  isOpen: false,
}));
