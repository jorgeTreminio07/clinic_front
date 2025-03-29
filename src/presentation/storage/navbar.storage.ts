import { create } from "zustand";

interface NavBarState {
  showNavbar: boolean;
  toggleNavBar: (value?: boolean) => void;
}

export const useNavBarStorage = create<NavBarState>()((set) => ({
  showNavbar: false,
  toggleNavBar: (value) => set((state) => ({ showNavbar: value ?? !state.showNavbar })),
}));
