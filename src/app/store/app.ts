import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppState {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  createdAt: Date;
}

interface AppActions {
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // Estado inicial
      theme: "system",
      sidebarCollapsed: false,
      notifications: [],

      // Actions
      setTheme: (theme) => set({ theme }, false, "app/setTheme"),

      toggleSidebar: () =>
        set(
          (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
          false,
          "app/toggleSidebar",
        ),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }, false, "app/setSidebarCollapsed"),

      addNotification: (notification) =>
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          }),
          false,
          "app/addNotification",
        ),

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          "app/removeNotification",
        ),

      clearNotifications: () =>
        set({ notifications: [] }, false, "app/clearNotifications"),
    }),
    {
      name: "app-store",
    },
  ),
);
