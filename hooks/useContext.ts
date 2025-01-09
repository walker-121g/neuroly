import { Context } from "@/lib/types/auth";
import { create } from "zustand";

export type ContextState = {
  user: Context | null;
  setUser: (user: Context | null) => void;
};

export const useContext = create<ContextState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
