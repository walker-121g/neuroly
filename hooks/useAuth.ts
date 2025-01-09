import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthState = {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
};

export const useAuth = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      refreshToken: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
