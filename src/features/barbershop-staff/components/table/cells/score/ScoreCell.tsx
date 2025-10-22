/**
 * 🎯 ScoreCell Component
 * Célula da tabela que exibe o score do barbeiro com tooltip rico usando Radix UI
 */
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { ScoreDisplay, type ScoreDisplayVariant } from "./ScoreDisplay";

export type ScoreLevel = "critical" | "good" | "excellent";

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
 * Helper para determinar o nível baseado no score (3 níveis)
 */
function getScoreLevel(score: number): ScoreLevel {
  if (score >= 85) return "excellent";
  if (score >= 60) return "good";
  return "critical";
}

/**
 * Helper para formatar valor monetário
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ScoreCell({
  score,
  scoreLevel,
  onClick,
  variant = "gauge",
  averageRating,
  totalReviews = 0,
  totalRevenue = 0,
  totalAttendances = 0,
}: ScoreCellProps) {
  // 🎯 Se não tiver score (null/undefined), mostra placeholder com tooltip explicativo
  if (score === undefined || score === null) {
    return (
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex h-10 w-16 cursor-help items-center justify-center rounded-md border border-dashed border-neutral-700 bg-neutral-900/50"
              role="button"
              aria-label="Dados insuficientes para calcular score"
            >
              <span className="text-xs font-medium text-neutral-500">---</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px]">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-neutral-100">
                📊 Score Indisponível
              </p>
              <div>
                <p className="text-xs text-neutral-300">
                  Este barbeiro não possui atividade recente suficiente{" "}
                  <strong className="text-neutral-100">no último ano</strong>{" "}
                  para calcular o Score.
                </p>
              </div>
              <div className="border-t border-neutral-700 pt-2">
                <p className="mb-1 text-xs text-neutral-400">
                  Dados históricos encontrados:
                </p>
                <p className="text-xs text-neutral-300">
                  • {totalAttendances} atendimento
                  {totalAttendances !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-neutral-300">
                  • {totalReviews} avaliação{totalReviews !== 1 ? "ões" : ""}
                </p>
              </div>
              <div className="rounded bg-neutral-800/50 px-2 py-1.5">
                <p className="text-xs text-neutral-400">
                  <strong className="text-neutral-200">Necessário:</strong> 5+
                  atendimentos e 1+ avaliação no último ano
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  const level = scoreLevel || getScoreLevel(score);

  // Cálculo dos componentes do score
  // const ratingScore = averageRating ? (averageRating / 5) * 40 : 0;
  // const revenueScore = 35; // Simplificado - precisa do valor real do backend
  // const attendanceScore = 25; // Simplificado - precisa do valor real do backend

  return (
    <div className="flex w-full justify-center px-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="group w-full max-w-[140px] cursor-pointer rounded-md p-1 transition-transform duration-200 ease-out hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:outline-none"
            aria-label={`Score: ${score} - ${level}`}
          >
            <ScoreDisplay
              score={score}
              level={level}
              variant={variant}
              showLabel={true}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px]">
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="mr-5 text-sm font-semibold text-neutral-100">
                Performance Score
              </span>
              <span className="text-lg font-bold text-neutral-100">
                {score}
              </span>
            </div>

            {/* Breakdown */}
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">⭐ Avaliação</span>
                <span className="font-medium text-neutral-100">
                  {ratingScore.toFixed(1)} pts
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">💰 Receita</span>
                <span className="font-medium text-neutral-100">
                  {revenueScore.toFixed(1)} pts
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">📅 Atendimentos</span>
                <span className="font-medium text-neutral-100">
                  {attendanceScore.toFixed(1)} pts
                </span>
              </div>
            </div> */}

            {/* Divider */}
            <div className="border-t border-neutral-700" />

            {/* Stats */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Avaliação média</span>
                <span className="font-medium text-neutral-100">
                  {averageRating?.toFixed(1) || "0.0"} ⭐
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Total de avaliações</span>
                <span className="font-medium text-neutral-100">
                  {totalReviews}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Receita total</span>
                <span className="font-medium text-neutral-100">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Atendimentos</span>
                <span className="font-medium text-neutral-100">
                  {totalAttendances}
                </span>
              </div>
            </div>

            {/* Footer hint */}
            {/* <div className="border-t border-neutral-700 pt-2">
              <p className="text-xs text-neutral-500">
                Clique para ver detalhes completos
              </p>
            </div> */}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
