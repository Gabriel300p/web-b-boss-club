/**
 * 🔄 ReloadButton Component
 * Componente reutilizável para botão de reload com estados visuais
 */
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";

interface ReloadButtonProps {
  label: string;
  disabledLabel: string;
  onClick: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
  countdown?: number;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function ReloadButton({
  label,
  disabledLabel,
  onClick,
  isDisabled,
  isLoading = false,
  countdown = 0,
  className,
  size = "default",
  variant = "outline",
}: ReloadButtonProps) {
  const displayLabel = isDisabled ? `${disabledLabel} (${countdown}s)` : label;
  const isButtonDisabled = isDisabled || isLoading;

  return (
    <Button
      onClick={onClick}
      disabled={isButtonDisabled}
      size={size}
      variant={variant}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        isButtonDisabled && "cursor-not-allowed opacity-50",
        isLoading && "animate-pulse",
        className,
      )}
    >
      <ArrowsClockwiseIcon
        className={cn("h-6 w-6", isLoading && "animate-spin")}
      />
      <span>{displayLabel}</span>
    </Button>
  );
}
