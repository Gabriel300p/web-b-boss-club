import type { ToastData } from "@shared/components/ui/toast/toast";
import {
  generateToastId,
  TOAST_CONFIG,
} from "@shared/components/ui/toast/toast";
import { ToastContainer } from "@shared/components/ui/toast/ToastContainer";
import type { ReactNode } from "react";
import { createContext, useCallback, useState } from "react";

// 🍞 Toast Context Types
export interface ToastContextValue {
  toasts: ToastData[];
  showToast: (options: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, title?: string, description?: string) => string;
  error: (message: string, title?: string, description?: string) => string;
  warning: (message: string, title?: string, description?: string) => string;
  info: (message: string, title?: string, description?: string) => string;
}

interface ToastProviderProps {
  children: ReactNode;
}

// 🎯 Context Creation
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// 📤 Export Context for hook
export { ToastContext };

// 🍞 Toast Provider Component
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // ➕ Add Toast
  const showToast = useCallback((options: Omit<ToastData, "id">): string => {
    const id = generateToastId();
    const newToast: ToastData = {
      id,
      ...options,
    };

    setToasts((prev) => {
      // 🚫 Limit max toasts
      const updatedToasts = [...prev, newToast];
      if (updatedToasts.length > TOAST_CONFIG.maxToasts) {
        return updatedToasts.slice(-TOAST_CONFIG.maxToasts);
      }
      return updatedToasts;
    });

    return id;
  }, []);

  // ❌ Remove Toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 🧹 Clear All Toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 🎯 Convenience Methods
  const success = useCallback(
    (
      title: string,
      message?: string,
      description?: string,
      showDescriptionPreview?: boolean,
      expandable?: boolean,
    ): string => {
      return showToast({
        type: "success",
        title,
        message,
        description,
        showDescriptionPreview,
        expandable,
      });
    },
    [showToast],
  );

  const error = useCallback(
    (
      title: string,
      message?: string,
      description?: string,
      showDescriptionPreview?: boolean,
      expandable?: boolean,
    ): string => {
      return showToast({
        type: "error",
        title,
        message,
        description,
        showDescriptionPreview,
        expandable,
      });
    },
    [showToast],
  );

  const warning = useCallback(
    (
      title: string,
      message?: string,
      description?: string,
      showDescriptionPreview?: boolean,
      expandable?: boolean,
    ): string => {
      return showToast({
        type: "warning",
        title,
        message,
        description,
        showDescriptionPreview,
        expandable,
      });
    },
    [showToast],
  );

  const info = useCallback(
    (
      title: string,
      message?: string,
      description?: string,
      showDescriptionPreview?: boolean,
      expandable?: boolean,
    ): string => {
      return showToast({
        type: "info",
        title,
        message,
        description,
        showDescriptionPreview,
        expandable,
      });
    },
    [showToast],
  );

  // 🎨 Context Value
  const contextValue: ToastContextValue = {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
