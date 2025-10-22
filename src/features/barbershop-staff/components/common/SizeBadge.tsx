/**
 * 🏪 SizeBadge Component
 * Badge visual para indicar o porte da barbearia (Score V3)
 */
import { cn } from "@shared/lib/utils";

export type BarbershopSize = "SMALL" | "MEDIUM" | "LARGE";

interface SizeBadgeProps {
  size: BarbershopSize;
  className?: string;
}

const SIZE_CONFIG: Record<
  BarbershopSize,
  {
    label: string;
    emoji: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  SMALL: {
    label: "Pequeno",
    emoji: "🏪",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  MEDIUM: {
    label: "Médio",
    emoji: "🏬",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  LARGE: {
    label: "Grande",
    emoji: "🏢",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
};

export function SizeBadge({ size, className }: SizeBadgeProps) {
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        config.color,
        config.bg,
        config.border,
        className,
      )}
    >
      <span className="text-sm">{config.emoji}</span>
      <span className="tracking-wide uppercase">{config.label}</span>
    </div>
  );
}
