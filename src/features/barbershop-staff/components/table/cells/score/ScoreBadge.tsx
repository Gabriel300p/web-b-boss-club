/**
 * ✨ ScoreBadge Component - Score System
 * Badge visual para exibir score de desempenho (0-100) com níveis de cor
 */
import { cn } from "@shared/lib/utils";
import { TrendingUp } from "lucide-react";
import { memo } from "react";

export type ScoreLevel =
  | "critical"
  | "needs_improvement"
  | "regular"
  | "good"
  | "excellent";

interface ScoreBadgeProps {
  score: number; // 0-100
  level?: ScoreLevel;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Determina o nível do score baseado no valor
 */
function getScoreLevel(score: number): ScoreLevel {
  if (score >= 95) return "excellent";
  if (score >= 85) return "good";
  if (score >= 70) return "regular";
  if (score >= 50) return "needs_improvement";
  return "critical";
}

/**
 * Configuração de cores e estilos por nível
 */
const SCORE_CONFIG: Record<
  ScoreLevel,
  {
    variant: "default" | "destructive" | "success" | "warning" | "secondary";
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  critical: {
    variant: "destructive",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
    borderColor: "border-red-500/20",
  },
  needs_improvement: {
    variant: "warning",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    borderColor: "border-orange-500/20",
  },
  regular: {
    variant: "warning",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500/20",
  },
  good: {
    variant: "success",
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
    borderColor: "border-green-500/20",
  },
  excellent: {
    variant: "default",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/20",
  },
};

export const ScoreBadge = memo(function ScoreBadge({
  score,
  level,
  showIcon = true,
  onClick,
  className,
}: ScoreBadgeProps) {
  // Validar score
  const validScore = Math.max(0, Math.min(100, score));
  const scoreLevel = level || getScoreLevel(validScore);
  const config = SCORE_CONFIG[scoreLevel];

  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1",
        config.bgColor,
        config.textColor,
        config.borderColor,
        isClickable &&
          "cursor-pointer transition-all hover:scale-105 hover:shadow-md",
        className,
      )}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Ícone opcional */}
      {showIcon && <TrendingUp className="h-3.5 w-3.5" />}

      {/* Score value */}
      <span className="text-sm font-bold">{validScore.toFixed(0)}</span>
    </div>
  );
});

/**
 * ScoreBadgeWithTooltip - Badge com tooltip explicativo
 * Pode ser usado para adicionar contexto adicional ao score
 */
interface ScoreBadgeWithTooltipProps extends ScoreBadgeProps {
  tooltip?: string;
}

export const ScoreBadgeWithTooltip = memo(function ScoreBadgeWithTooltip({
  tooltip,
  ...props
}: ScoreBadgeWithTooltipProps) {
  if (!tooltip) {
    return <ScoreBadge {...props} />;
  }

  return (
    <div className="group relative inline-block">
      <ScoreBadge {...props} />

      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded-md bg-neutral-900 px-3 py-2 text-xs text-neutral-100 shadow-lg group-hover:block">
        {tooltip}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </div>
    </div>
  );
});
