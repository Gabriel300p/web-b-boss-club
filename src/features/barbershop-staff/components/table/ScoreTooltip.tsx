/**
 * 💬 ScoreTooltip Component
 * Tooltip rico com breakdown do score e informações detalhadas
 */
import { cn } from "@shared/lib/utils";
import { TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ScoreLevel =
  | "critical"
  | "needs_improvement"
  | "regular"
  | "good"
  | "excellent";

interface ScoreTooltipProps {
  children: ReactNode;
  score: number;
  level: ScoreLevel;
  // Dados reais e úteis do colaborador
  averageRating?: number | null;
  totalReviews?: number;
  totalRevenue?: number;
  totalAttendances?: number;
  enabled?: boolean;
}

/**
 * Labels dos níveis em português
 */
const LEVEL_LABELS: Record<ScoreLevel, string> = {
  critical: "Crítico",
  needs_improvement: "Precisa Melhorar",
  regular: "Regular",
  good: "Bom",
  excellent: "Excelente",
};

/**
 * Emojis dos níveis
 */
const LEVEL_EMOJIS: Record<ScoreLevel, string> = {
  critical: "🔴",
  needs_improvement: "🟠",
  regular: "🟡",
  good: "🟢",
  excellent: "🔵",
};

/**
 * Cores dos níveis
 */
const LEVEL_COLORS: Record<ScoreLevel, string> = {
  critical: "text-red-500",
  needs_improvement: "text-orange-500",
  regular: "text-yellow-500",
  good: "text-green-500",
  excellent: "text-blue-500",
};

export function ScoreTooltip({
  children,
  score,
  level,
  averageRating,
  totalReviews = 0,
  totalRevenue = 0,
  totalAttendances = 0,
  enabled = true,
}: ScoreTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 10, // Espaço para o tooltip acima
        left: rect.left + rect.width / 2, // Centro horizontal
      });
    }
  }, [isVisible]);

  if (!enabled) {
    return <>{children}</>;
  }

  // Formatar valores
  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const formattedRating = averageRating
    ? averageRating.toFixed(1)
    : "Sem avaliações";

  const tooltipContent = isVisible && (
    <div
      className="pointer-events-none fixed z-[99999]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translate(-50%, -100%)",
      }}
      role="tooltip"
    >
      {/* Arrow */}
      <div className="absolute top-full left-1/2 -mt-px -translate-x-1/2">
        <div className="border-4 border-transparent border-t-neutral-900" />
      </div>

      {/* Content */}
      <div className="animate-in fade-in-0 zoom-in-95 min-w-[200px] rounded-lg border border-neutral-800 bg-neutral-900 p-3 shadow-2xl duration-200">
        <div className="flex flex-col gap-2">
          {/* Header: Score + Nível */}
          <div className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label={level}>
                {LEVEL_EMOJIS[level]}
              </span>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    LEVEL_COLORS[level],
                  )}
                >
                  {score}
                </span>
                <span className="text-xs text-neutral-400">
                  {LEVEL_LABELS[level]}
                </span>
              </div>
            </div>
            <TrendingUp className="h-4 w-4 text-neutral-500" />
          </div>

          {/* Breakdown: Dados Reais e Úteis */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              Performance
            </span>

            <div className="flex flex-col gap-1.5">
              {/* Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  ⭐ Avaliação
                </span>
                <span className="font-semibold text-neutral-100">
                  {averageRating ? `${formattedRating}/5` : "Sem avaliações"}
                  {totalReviews > 0 && (
                    <span className="ml-1 font-normal text-neutral-500">
                      ({totalReviews})
                    </span>
                  )}
                </span>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  💰 Receita
                </span>
                <span className="font-semibold text-neutral-100">
                  {formattedRevenue}
                </span>
              </div>

              {/* Attendances */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  ✂️ Atendimentos
                </span>
                <span className="font-semibold text-neutral-100">
                  {totalAttendances}
                </span>
              </div>
            </div>
          </div>

          {/* Footer: Call to action */}
          <div className="border-t border-neutral-800 pt-2">
            <span className="text-xs text-neutral-500 italic">
              Clique para ver análise completa →
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
}
