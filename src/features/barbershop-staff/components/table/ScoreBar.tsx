/**
 * 📊 ScoreBar Component
 * Barra horizontal segmentada para visualização de score (0-100)
 * Design inspirado em credit score com gradientes suaves
 */
import { cn } from "@shared/lib/utils";
import { memo } from "react";

export type ScoreLevel =
  | "critical"
  | "needs_improvement"
  | "regular"
  | "good"
  | "excellent";

interface ScoreBarProps {
  score: number; // 0-100
  level: ScoreLevel;
  showLabel?: boolean;
  className?: string;
}

/**
 * Configuração de cores por nível
 */
const SCORE_COLORS: Record<
  ScoreLevel,
  {
    primary: string;
    secondary: string;
    text: string;
  }
> = {
  critical: {
    primary: "#ef4444", // red-500
    secondary: "#dc2626", // red-600
    text: "text-red-500",
  },
  needs_improvement: {
    primary: "#f97316", // orange-500
    secondary: "#ea580c", // orange-600
    text: "text-orange-500",
  },
  regular: {
    primary: "#eab308", // yellow-500
    secondary: "#ca8a04", // yellow-600
    text: "text-yellow-500",
  },
  good: {
    primary: "#22c55e", // green-500
    secondary: "#16a34a", // green-600
    text: "text-green-500",
  },
  excellent: {
    primary: "#3b82f6", // blue-500
    secondary: "#2563eb", // blue-600
    text: "text-blue-500",
  },
};

/**
 * Configuração dos segmentos da barra
 */
const SEGMENTS = [
  { min: 0, max: 49, level: "critical" as ScoreLevel, width: 24.5 }, // 49% do range
  { min: 50, max: 69, level: "needs_improvement" as ScoreLevel, width: 20 }, // 20% do range
  { min: 70, max: 84, level: "regular" as ScoreLevel, width: 15 }, // 15% do range
  { min: 85, max: 94, level: "good" as ScoreLevel, width: 10 }, // 10% do range
  { min: 95, max: 100, level: "excellent" as ScoreLevel, width: 6 }, // 6% do range
];

/**
 * Calcula o preenchimento percentual dentro do segmento ativo
 */
function calculateFillPercentage(score: number): {
  activeSegmentIndex: number;
  fillPercentage: number;
} {
  const activeSegment = SEGMENTS.findIndex(
    (seg) => score >= seg.min && score <= seg.max,
  );

  if (activeSegment === -1) {
    return { activeSegmentIndex: 0, fillPercentage: 0 };
  }

  const segment = SEGMENTS[activeSegment];
  const rangeSize = segment.max - segment.min + 1;
  const positionInRange = score - segment.min;
  const fillPercentage = (positionInRange / rangeSize) * 100;

  return { activeSegmentIndex: activeSegment, fillPercentage };
}

export const ScoreBar = memo(function ScoreBar({
  score,
  level,
  showLabel = true,
  className,
}: ScoreBarProps) {
  const colors = SCORE_COLORS[level];
  const { activeSegmentIndex, fillPercentage } = calculateFillPercentage(score);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {/* Barra de segmentos */}
      <div className="flex h-2 w-full gap-0.5">
        {SEGMENTS.map((segment, index) => {
          const segmentColors = SCORE_COLORS[segment.level];
          const isActive = index === activeSegmentIndex;
          const isPassed = index < activeSegmentIndex;

          return (
            <div
              key={segment.level}
              className="relative h-full overflow-hidden rounded-sm transition-all duration-300"
              style={{
                width: `${segment.width}%`,
              }}
            >
              {/* Background do segmento (sempre visível, opaco) */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(90deg, ${segmentColors.primary} 0%, ${segmentColors.secondary} 100%)`,
                }}
              />

              {/* Preenchimento do segmento (passados completamente ou ativo parcialmente) */}
              {(isPassed || isActive) && (
                <div
                  className="absolute inset-0 transition-all duration-500 ease-out"
                  style={{
                    background: `linear-gradient(90deg, ${segmentColors.primary} 0%, ${segmentColors.secondary} 100%)`,
                    width: isPassed ? "100%" : `${fillPercentage}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Label do score */}
      {showLabel && (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              "text-xs font-semibold tabular-nums transition-colors duration-300",
              colors.text,
            )}
          >
            {score}
          </span>
        </div>
      )}
    </div>
  );
});
