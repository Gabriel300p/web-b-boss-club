import type { UserRole } from "@features/auth/types/auth";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; // Agora usa os roles corretos do Prisma
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
            },
            false,
            "auth/setUser",
          ),

        setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),

        setError: (error) => set({ error }, false, "auth/setError"),

        login: (user) =>
          set(
            {
              user,
              isAuthenticated: true,
              error: null,
            },
            false,
            "auth/login",
          ),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              error: null,
            },
            false,
            "auth/logout",
          ),

        clearError: () => set({ error: null }, false, "auth/clearError"),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
