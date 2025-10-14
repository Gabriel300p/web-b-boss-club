/**
 * 🎨 ScoreDisplay Component
 * Wrapper que permite alternar entre ScoreBar e MiniGauge
 * Facilita A/B testing e escolha de design
 */
import { MiniGauge } from "./MiniGauge";

export type ScoreLevel =
  | "critical"
  | "needs_improvement"
  | "regular"
  | "good"
  | "excellent";

export type ScoreDisplayVariant = "gauge";

interface ScoreDisplayProps {
  score: number;
  level: ScoreLevel;
  variant?: ScoreDisplayVariant;
  showLabel?: boolean;
  className?: string;
}

/**
 * Componente unificado para exibição de score
 * Permite escolher entre barra segmentada ou gauge semicircular
 */
export function ScoreDisplay({
  score,
  level,
  variant = "gauge", // 'gauge' como padrão
  showLabel = true,
  className,
}: ScoreDisplayProps) {
  if (variant === "gauge") {
    return (
      <MiniGauge
        score={score}
        level={level}
        size="sm"
        showLabel={showLabel}
        className={className}
      />
    );
  }
}
