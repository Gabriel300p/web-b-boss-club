import { useContext } from "react";
import type { ToastContextValue } from "@app/providers/ToastProvider";
import { ToastContext } from "@app/providers/ToastProvider";

// 🪝 useToast Hook
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }

  return context;
}
