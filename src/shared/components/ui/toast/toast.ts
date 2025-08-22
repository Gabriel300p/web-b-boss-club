// 🍞 Toast System Types and Utilities

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  expandable?: boolean;
  description?: string;
  showDescriptionPreview?: boolean;
  showStopMessage?: boolean;
  duration?: number;
  persistent?: boolean;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastPosition {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

// 🎨 Toast Configuration
export const TOAST_CONFIG = {
  position: {
    vertical: "top" as const,
    horizontal: "right" as const,
  },
  duration: {
    success: 5000, // 5 segundos
    error: 7000, // 7 segundos
    warning: 6000, // 6 segundos
    info: 5000, // 5 segundos
  },
  maxToasts: 5,
  maxWidth: 420,
  spacing: 16,
  animationDuration: 400,
} as const;

// 🎯 Toast ID Generator
export const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 🎨 Toast Styling Classes
export const getToastClasses = (): string => {
  const baseClasses = [
    "relative",
    "flex",
    "w-full",
    "max-w-md",
    "items-start",
    "gap-3",
    "rounded-xl",
    "rounded-bl-sm",
    "border",
    "p-4",
    "shadow-xl",
    "backdrop-blur-md",
    "transition-all",
    "duration-300",
    "ease-out",
    "hover:shadow-2xl",
    "hover:scale-[1.02]",
    "group",
    "border-neutral-200",
    "dark:border-neutral-700",
    "dark:bg-neutral-800",
    "bg-white",
    "dark:text-gray-200",
    "text-gray-700",
    "shadow-gray-800/50",
  ].join(" ");

  return `${baseClasses} `;
};

// 🎨 Icon Classes
export const getIconClasses = (type: ToastType): string => {
  const baseClasses = "h-5 w-5 flex-shrink-0";

  const typeClasses = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
  };

  return `${baseClasses} ${typeClasses[type]}`;
};

// 🎯 Progress Bar Classes
export const getProgressBarClasses = (type: ToastType): string => {
  const baseClasses = [
    "absolute",
    "bottom-0",
    "left-1",
    "h-1",
    "rounded-b-lg",
    "transition-all",
    "duration-100",
    "ease-linear",
  ].join(" ");

  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return `${baseClasses} ${typeClasses[type]}`;
};
