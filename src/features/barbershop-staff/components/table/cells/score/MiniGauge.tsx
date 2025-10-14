/**
 * 🎚️ MiniGauge Component
 * Gauge semicircular minimalista para visualização de score (0-100)
 * Design clean com gradiente sutil e número centralizado
 */
import { cn } from "@shared/lib/utils";
import { memo } from "react";

export type ScoreLevel =
  | "critical"
  | "needs_improvement"
  | "regular"
  | "good"
  | "excellent";

interface MiniGaugeProps {
  score: number; // 0-100
  level: ScoreLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Configuração de cores por nível (simplificado - menos futurista)
 */
const SCORE_COLORS: Record<
  ScoreLevel,
  {
    primary: string;
    text: string;
  }
> = {
  critical: {
    primary: "oklch(63.7% 0.237 25.331)", // red-500
    text: "text-red-500",
  },
  needs_improvement: {
    primary: "oklch(70.5% 0.213 47.604)", // orange-500
    text: "text-orange-500",
  },
  regular: {
    primary: "oklch(79.5% 0.184 86.047)", // yellow-500
    text: "text-yellow-500",
  },
  good: {
    primary: "oklch(84.1% 0.238 128.85)", // green-500
    text: "text-lime-500",
  },
  excellent: {
    primary: "oklch(72.3% 0.219 149.579)", // blue-500
    text: "text-green-500",
  },
};

/**
 * Tamanhos do gauge
 */
const SIZES = {
  sm: {
    width: 60,
    height: 35,
    strokeWidth: 4,
    fontSize: "text-sm",
    labelSize: "text-xs",
  },
  md: {
    width: 80,
    height: 45,
    strokeWidth: 5,
    fontSize: "text-base",
    labelSize: "text-xs",
  },
  lg: {
    width: 100,
    height: 55,
    strokeWidth: 6,
    fontSize: "text-lg",
    labelSize: "text-sm",
  },
};

export const MiniGauge = memo(function MiniGauge({
  score,
  level,
  size = "sm",
  className,
}: MiniGaugeProps) {
  const colors = SCORE_COLORS[level];
  const dimensions = SIZES[size];

  // Calcular ângulo do arco (180° = semicírculo)
  const percentage = Math.min(Math.max(score, 0), 100);
  const angle = (percentage / 100) * 180;

  // Dimensões do SVG
  const { width, height, strokeWidth } = dimensions;
  const radius = (width - strokeWidth) / 2;
  const centerX = width / 2;
  const centerY = height - 5; // Ajuste para alinhar na base

  // Calcular o path do arco
  const startAngle = 180; // Começa na esquerda (180°)
  const endAngle = 180 + angle; // Termina baseado no score

  const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
  const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
  const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
  const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

  const largeArcFlag = angle > 180 ? 1 : 0;

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  const backgroundPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}`;

  return (
    <div
      className={cn("flex flex-col items-center gap-1 opacity-90", className)}
    >
      {/* SVG Gauge */}
      <div className="relative" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background arc (cinza neutro) */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="oklch(37.1% 0 0)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Foreground arc (preenchido) - simplificado */}
          <path
            d={arcPath}
            fill="none"
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Número do score centralizado */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ top: height * 0.3 }}
        >
          <span
            className={cn(
              "font-bold tabular-nums transition-colors duration-300",
              dimensions.fontSize,
              colors.text,
            )}
          >
            {score}
          </span>
        </div>
      </div>
    </div>
  );
});
