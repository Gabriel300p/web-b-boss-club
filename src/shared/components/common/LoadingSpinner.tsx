import { cn } from "@/shared/lib/utils";
import { CircleNotchIcon } from "@phosphor-icons/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <CircleNotchIcon
        role="status"
        aria-hidden="true"
        weight="bold"
        className={cn(
          "animate-spin text-neutral-800",
          sizeClasses[size],
          className,
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" text="Carregando..." />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-neutral-800/80">
      <LoadingSpinner size="lg" text="Carregando aplicação..." />
    </div>
  );
}
