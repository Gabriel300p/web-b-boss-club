/**
 * 🎯 ScoreCell Component
 * Célula da tabela que exibe o score do barbeiro com tooltip rico
 * Suporta dois designs: barra segmentada (bar) ou gauge semicircular (gauge)
 */
import { ScoreDisplay, type ScoreDisplayVariant } from "./ScoreDisplay";
import { ScoreTooltip } from "./ScoreTooltip";

export type ScoreLevel =
  | "critical"
  | "needs_improvement"
  | "regular"
  | "good"
  | "excellent";

interface ScoreCellProps {
  // Score pode vir da lista principal se disponível
  score?: number;
  scoreLevel?: ScoreLevel;
  onClick?: () => void;
  variant?: ScoreDisplayVariant; // 'bar' ou 'gauge'
  // 🆕 Dados reais para o tooltip
  averageRating?: number | null;
  totalReviews?: number;
  totalRevenue?: number;
  totalAttendances?: number;
}

/**
 * Helper para determinar o nível baseado no score
 */
function getScoreLevel(score: number) {
  if (score >= 95) return "excellent";
  if (score >= 85) return "good";
  if (score >= 70) return "regular";
  if (score >= 50) return "needs_improvement";
  return "critical";
}

export function ScoreCell({
  score,
  scoreLevel,
  onClick,
  variant = "gauge", // 'bar' como padrão, pode trocar para 'gauge' para testar
  averageRating,
  totalReviews = 0,
  totalRevenue = 0,
  totalAttendances = 0,
}: ScoreCellProps) {
  // 🎯 Se não tiver score (null/undefined), mostra placeholder com tooltip explicativo
  if (score === undefined || score === null) {
    return (
      <div className="flex justify-center">
        <div
          className="group relative flex items-center justify-center"
          role="button"
          aria-label="Dados insuficientes para calcular score"
        >
          {/* Placeholder visual */}
          <div className="flex h-10 w-16 items-center justify-center rounded-md border border-dashed border-neutral-700 bg-neutral-900/50">
            <span className="text-xs font-medium text-neutral-500">---</span>
          </div>

          {/* Tooltip explicativo (hover) - Absolute position com bottom-full */}
          <div className="pointer-events-none absolute bottom-full left-1/2 z-[99999] mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="min-w-[220px] rounded-lg border border-neutral-800 bg-neutral-900 p-3 shadow-2xl backdrop-blur-sm">
              <p className="text-xs font-semibold text-neutral-300">
                📊 Dados Insuficientes
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Mínimo necessário:
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-neutral-500">
                <li>• 5 atendimentos concluídos</li>
                <li>• 1 avaliação de cliente</li>
              </ul>
              <div className="mt-2 border-t border-neutral-800 pt-2">
                <p className="text-xs text-neutral-500">
                  Atendimentos:{" "}
                  <span className="font-medium text-neutral-400">
                    {totalAttendances}
                  </span>
                </p>
                <p className="text-xs text-neutral-500">
                  Avaliações:{" "}
                  <span className="font-medium text-neutral-400">
                    {totalReviews}
                  </span>
                </p>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -mt-px -translate-x-1/2">
              <div className="border-4 border-transparent border-t-neutral-900" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const level = scoreLevel || getScoreLevel(score);

  return (
    <div className="flex w-full justify-center px-2">
      <ScoreTooltip
        score={score}
        level={level}
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalRevenue={totalRevenue}
        totalAttendances={totalAttendances}
      >
        <button
          onClick={onClick}
          className="group w-full max-w-[100px] cursor-pointer rounded-md p-1 transition-transform duration-200 ease-out hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:outline-none"
          aria-label={`Score: ${score} - ${level}`}
        >
          <ScoreDisplay
            score={score}
            level={level}
            variant={variant}
            showLabel={true}
          />
        </button>
      </ScoreTooltip>
    </div>
  );
}
