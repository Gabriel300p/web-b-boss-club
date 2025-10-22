/**
 * ⚖️ ScoreComparisonModal Component
 * Modal para comparar Score V2 (antigo) vs V3 (novo)
 * Mostra ao usuário o impacto das mudanças
 */
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { cn } from "@shared/lib/utils";
import { TrendingUp } from "lucide-react";
import type { BarbershopSize } from "../common/SizeBadge";

interface ScoreComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffName: string;
  scoreV2: number;
  scoreV3: number;
  attendances: number;
  targetV2: number;
  targetV3: number;
  size: BarbershopSize;
}

const SIZE_LABELS: Record<BarbershopSize, string> = {
  SMALL: "PEQUENO",
  MEDIUM: "MÉDIO",
  LARGE: "GRANDE",
};

export function ScoreComparisonModal({
  open,
  onOpenChange,
  staffName,
  scoreV2,
  scoreV3,
  attendances,
  targetV2,
  targetV3,
  size,
}: ScoreComparisonModalProps) {
  const improvement = scoreV3 - scoreV2;
  const improvementPercent = Math.round((improvement / scoreV2) * 100);

  const getLevelV2 = (score: number) => {
    if (score >= 80)
      return { label: "BOM", color: "text-yellow-500", emoji: "🟡" };
    if (score >= 50)
      return { label: "BOM", color: "text-yellow-500", emoji: "🟡" };
    return { label: "CRÍTICO", color: "text-red-500", emoji: "🔴" };
  };

  const getLevelV3 = (score: number) => {
    if (score >= 75)
      return { label: "EXCELENTE", color: "text-green-400", emoji: "🟢" };
    if (score >= 50)
      return { label: "BOM", color: "text-yellow-500", emoji: "🟡" };
    return { label: "CRÍTICO", color: "text-red-500", emoji: "🔴" };
  };

  const levelV2 = getLevelV2(scoreV2);
  const levelV3 = getLevelV3(scoreV3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-neutral-800 bg-neutral-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-100">
            Score V2 vs V3 - Comparação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com nome */}
          <div className="text-center">
            <p className="text-neutral-400">👤 {staffName}</p>
          </div>

          {/* Comparação lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            {/* V2 (OLD) */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-3 text-center text-sm font-medium text-neutral-400">
                SCORE V2 (OLD)
              </div>

              <div className="mb-4 text-center">
                <div className={cn("text-2xl font-bold", levelV2.color)}>
                  {levelV2.emoji} {scoreV2}/100
                </div>
                <div className="text-sm text-neutral-500">{levelV2.label}</div>

                {/* Barra de progresso */}
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-800">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      scoreV2 >= 80 ? "bg-yellow-500" : "bg-yellow-500",
                    )}
                    style={{ width: `${scoreV2}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="font-medium text-neutral-300">📊 Cálculo:</div>

                <div className="text-neutral-400">Rating: 67.2/70</div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span>Volume:</span>
                  <span className="text-red-400">4.8/30 ❌</span>
                </div>
                <div className="text-xs text-neutral-500">
                  ({attendances}/{targetV2} atend.)
                </div>

                <div className="text-neutral-400">Bônus: +0.0</div>

                <div className="mt-2 border-t border-neutral-800 pt-2">
                  <div className="font-medium text-neutral-300">
                    Total: {scoreV2} pts
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-neutral-500">
                  <div className="text-red-400">⚠️ Problema:</div>
                  <div>• Meta muito baixa</div>
                  <div>&nbsp;&nbsp;({targetV2} atend./mês)</div>
                  <div>• Score sempre</div>
                  <div>&nbsp;&nbsp;amarelo/vermelho</div>
                </div>
              </div>
            </div>

            {/* V3 (NEW) */}
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="mb-3 text-center text-sm font-medium text-green-400">
                SCORE V3 (NOVO) ✨
              </div>

              <div className="mb-4 text-center">
                <div className={cn("text-2xl font-bold", levelV3.color)}>
                  {levelV3.emoji} {scoreV3}/100
                </div>
                <div className="text-sm text-neutral-500">{levelV3.label}</div>

                {/* Barra de progresso */}
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-800">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      scoreV3 >= 75
                        ? "bg-green-400"
                        : scoreV3 >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                    style={{ width: `${Math.min(scoreV3, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="font-medium text-neutral-300">📊 Cálculo:</div>

                <div className="text-neutral-400">Rating: 67.2/70</div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span>Volume:</span>
                  <span className="text-green-400">27.0/30 ✅</span>
                </div>
                <div className="text-xs text-neutral-500">
                  ({attendances}/{targetV3} atend.)
                </div>

                <div className="text-neutral-400">Bônus: +16.0</div>

                <div className="mt-2 border-t border-neutral-800 pt-2">
                  <div className="font-medium text-neutral-300">
                    Total: {scoreV3} → {Math.min(scoreV3, 100)} (cap)
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-neutral-400">
                  <div className="text-green-400">✅ Ajustes:</div>
                  <div>• Meta realista (6/dia)</div>
                  <div>• Porte: {SIZE_LABELS[size]}</div>
                  <div>• Threshold: 75 (não 80)</div>
                  <div>• Bônus contextualizados</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ganho/Melhoria */}
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center justify-center gap-3 text-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-lg font-bold text-green-400">
                Ganho: +{improvement} pontos (
                {improvementPercent >= 0 ? "+" : ""}
                {improvementPercent}% de melhora)
              </span>
            </div>
            <p className="mt-2 text-center text-sm text-neutral-400">
              com sistema justo baseado em pesquisas de mercado!
            </p>
          </div>

          {/* Botão */}
          <div className="flex justify-center">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-neutral-800 hover:bg-neutral-700"
            >
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
