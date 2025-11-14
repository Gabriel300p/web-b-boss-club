/**
 * 📊 ScoreReportModal Component
 * Modal detalhado com análise completa do score do barbeiro
 *
 * ✨ V3: Busca breakdown completo do backend e exibe:
 * - Rating & Volume breakdown com progress bars
 * - Bônus individuais (Recência, Consistência, Validação, Momentum)
 * - Penalidades (se aplicadas)
 * - Seção V3 com porte e meta ajustada
 * - Fórmula matemática do cálculo
 */
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Separator } from "@shared/components/ui/separator";
import { cn } from "@shared/lib/utils";
import {
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  DollarSign,
  Scissors,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useStaffScoreBreakdown } from "../../hooks/useStaffScoreBreakdown";
import { NewBarberBadge } from "../common/NewBarberBadge";
import type { BarbershopSize } from "../common/SizeBadge";
import { SizeBadge } from "../common/SizeBadge";
import { ScoreComparisonModal } from "./ScoreComparisonModal";

export type ScoreLevel = "critical" | "good" | "excellent";

interface ScoreReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Dados do staff
  staffId: string;
  staffName: string;
  staffPhoto?: string | null;
  staffEmail: string;
  // Score data
  score: number;
  level: ScoreLevel;
  // Breakdown data
  averageRating: number | null;
  totalReviews: number;
  totalRevenue: number;
  totalAttendances: number;
  // Ranking (opcional)
  rank?: number;
  totalStaff?: number;
  // Period (opcional)
  period?: string;
  // ✨ V3: Novos campos
  size?: BarbershopSize;
  targetAttendances?: number;
  daysWorking?: number;
  isV3?: boolean; // Flag para indicar se é Score V3
}

/**
 * Configuração de níveis (3 níveis com verde vibrante)
 */
const LEVEL_CONFIG: Record<
  ScoreLevel,
  {
    label: string;
    emoji: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  critical: {
    label: "Precisa Melhorar",
    emoji: "�",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  good: {
    label: "Bom",
    emoji: "🟡",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  excellent: {
    label: "Excelente",
    emoji: "�",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
};

/**
 * Componente de métrica individual
 */
interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  iconColor?: string;
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  iconColor = "text-neutral-400",
}: MetricCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2", iconColor)}>
          {icon}
          <span className="text-sm text-neutral-400">{label}</span>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              trend === "up" && "text-green-500",
              trend === "down" && "text-red-500",
              trend === "neutral" && "text-neutral-500",
            )}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-neutral-100">{value}</span>
        {subtitle && (
          <span className="text-xs text-neutral-500">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Componente de barra de breakdown
 */
interface BreakdownBarProps {
  label: string;
  percentage: number;
  value: string;
  color: string;
}

function BreakdownBar({ label, percentage, value, color }: BreakdownBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-300">{label}</span>
        <span className="font-semibold text-neutral-100">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-neutral-500">{percentage}% do total</span>
    </div>
  );
}

export function ScoreReportModal({
  open,
  onOpenChange,
  staffId,
  staffName,
  staffPhoto,
  staffEmail,
  score,
  level,
  averageRating,
  totalReviews,
  totalRevenue,
  totalAttendances,
  rank,
  totalStaff,
  period = "Últimos 30 dias",
  // ✨ V3: Novos props
  size,
  targetAttendances,
  daysWorking,
  isV3 = false,
}: ScoreReportModalProps) {
  // Estado para modal de comparação
  const [showComparison, setShowComparison] = useState(false);

  // 🎯 Buscar breakdown detalhado do backend (V3)
  const {
    data: breakdown,
    isLoading,
    error,
  } = useStaffScoreBreakdown(open ? staffId : null);

  // 🛡️ Proteção contra níveis inválidos (fallback para critical)
  const safeLevel: ScoreLevel = LEVEL_CONFIG[level] ? level : "critical";
  const config = LEVEL_CONFIG[safeLevel];

  // 🐛 DEBUG: Log para ver níveis inválidos
  if (!LEVEL_CONFIG[level]) {
    console.error(
      "[ScoreReportModal] Nível inválido recebido:",
      level,
      "| Score:",
      score,
    );
  }

  // Formatadores
  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(totalRevenue);

  const formattedRating = averageRating ? averageRating.toFixed(1) : "0.0";

  // Iniciais do nome
  const initials = staffName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Cálculo do Score V2 (para comparação)
  const scoreV2 = isV3 ? Math.max(50, score - 15) : score; // Estimativa conservadora
  const targetV2 = 40;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-neutral-950 text-neutral-100">
          {/* Header */}
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-bold">
                Análise de Performance
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 text-neutral-400 hover:text-neutral-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            {/* Staff Info + Score Badge + V3 Badges */}
            <div className="flex items-center gap-4">
              {/* Avatar Circle */}
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-800 bg-neutral-900">
                {staffPhoto ? (
                  <img
                    src={staffPhoto}
                    alt={staffName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-neutral-300">
                    {initials}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{staffName}</h2>
                  {rank && totalStaff && (
                    <Badge label="neutral" className="border-neutral-700">
                      #{rank} de {totalStaff}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-neutral-400">{staffEmail}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500">{period}</span>
                </div>
                {/* ✨ V3: Badges de porte e novo barbeiro */}
                {isV3 && (
                  <div className="mt-1 flex items-center gap-2">
                    {size && <SizeBadge size={size} />}
                    {daysWorking !== undefined && (
                      <NewBarberBadge daysWorking={daysWorking} />
                    )}
                    {isV3 && (
                      <div className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        SCORE V3
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Score Badge */}
              <div
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-6",
                  config.bg,
                  config.border,
                )}
              >
                <span className="text-4xl">{config.emoji}</span>
                <span className={cn("text-5xl font-bold", config.color)}>
                  {score}
                </span>
                <Badge
                  label="neutral"
                  className={cn("text-xs", config.bg, config.color)}
                >
                  {config.label}
                </Badge>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* 🔄 Loading State */}
            {isLoading && (
              <div className="flex flex-col gap-4 py-8">
                <div className="flex items-center justify-center gap-2 text-neutral-400">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
                  <span>Carregando detalhes...</span>
                </div>
              </div>
            )}

            {/* ⚠️ Error State */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Erro ao carregar detalhes</span>
                </div>
                <p className="mt-2 text-sm text-red-300">
                  {error instanceof Error ? error.message : "Erro desconhecido"}
                </p>
              </div>
            )}

            {/* ✅ Success State - Mostrar breakdown completo */}
            {!isLoading && !error && breakdown?.detailedBreakdown && (
              <>
                {/* Metrics Grid - Usando dados do breakdown */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold">
                      Métricas Principais
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <MetricCard
                      icon={<Star className="h-4 w-4" />}
                      label="Avaliação Média"
                      value={(
                        breakdown.detailedBreakdown.rating.averageRating || 0
                      ).toFixed(1)}
                      subtitle={`${breakdown.detailedBreakdown.rating.totalReviews} ${breakdown.detailedBreakdown.rating.totalReviews === 1 ? "avaliação" : "avaliações"}`}
                      iconColor="text-yellow-500"
                    />
                    <MetricCard
                      icon={<Scissors className="h-4 w-4" />}
                      label="Atendimentos"
                      value={breakdown.detailedBreakdown.volume.totalAttendances.toString()}
                      subtitle={`Meta: ${breakdown.detailedBreakdown.volume.targetAttendances} (${breakdown.detailedBreakdown.volume.achievementPercentage.toFixed(0)}%)`}
                      iconColor="text-blue-500"
                      trend={
                        breakdown.detailedBreakdown.volume
                          .achievementPercentage >= 100
                          ? "up"
                          : "neutral"
                      }
                    />
                    <MetricCard
                      icon={<Target className="h-4 w-4" />}
                      label="Média Diária"
                      value={breakdown.detailedBreakdown.volume.dailyAverage.toFixed(
                        1,
                      )}
                      subtitle="Atendimentos por dia"
                      iconColor="text-purple-500"
                    />
                  </div>
                </div>

                <Separator className="bg-neutral-800" />

                {/* Breakdown V3 - Rating & Volume */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold">
                      Composição do Score V3
                    </h3>
                  </div>
                  <div className="flex flex-col gap-6 rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
                    {/* Rating Component - 70% */}
                    <BreakdownBar
                      label={`${breakdown.quickBreakdown.rating.icon || "⭐"} ${breakdown.quickBreakdown.rating.description}`}
                      percentage={breakdown.quickBreakdown.rating.percentage}
                      value={`${breakdown.quickBreakdown.rating.value.toFixed(1)} pontos`}
                      color="bg-yellow-500"
                    />

                    {/* Volume Component - 30% */}
                    <BreakdownBar
                      label={`${breakdown.quickBreakdown.volume.icon || "📊"} ${breakdown.quickBreakdown.volume.description}`}
                      percentage={breakdown.quickBreakdown.volume.percentage}
                      value={`${breakdown.quickBreakdown.volume.value.toFixed(1)} pontos`}
                      color="bg-blue-500"
                    />
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">
                    * Fórmula V3:{" "}
                    {breakdown.detailedBreakdown.calculation.formula}
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                {/* Bônus Section */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold">
                      Bônus de Performance
                    </h3>
                    <Badge
                      label="neutral"
                      className="ml-auto border-green-500/30 bg-green-500/10 text-green-400"
                    >
                      +{breakdown.quickBreakdown.totalBonuses} pontos
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {(
                      Object.entries(breakdown.detailedBreakdown.bonuses) as [
                        string,
                        typeof breakdown.detailedBreakdown.bonuses.recency,
                      ][]
                    ).map(([key, bonus]) => (
                      <div
                        key={key}
                        className={cn(
                          "rounded-lg border p-4",
                          bonus.achieved
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-neutral-800 bg-neutral-900/30",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {bonus.achieved ? (
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-neutral-700" />
                            )}
                            <span className="font-medium text-neutral-100">
                              {bonus.name}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-sm font-bold",
                              bonus.achieved
                                ? "text-green-400"
                                : "text-neutral-500",
                            )}
                          >
                            +{bonus.value}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-neutral-400">
                          {bonus.reason}
                        </p>
                        {!bonus.achieved && bonus.tip && (
                          <p className="mt-2 text-xs text-blue-400">
                            💡 {bonus.tip}
                          </p>
                        )}
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                bonus.achieved
                                  ? "bg-green-500"
                                  : "bg-neutral-600",
                              )}
                              style={{ width: `${bonus.progress}%` }}
                            />
                          </div>
                          <span className="mt-1 text-[10px] text-neutral-500">
                            {bonus.progress.toFixed(0)}% conquistado
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Penalidades Section - Só mostrar se houver alguma aplicada */}
                {(breakdown.detailedBreakdown.penalties.lowRating.applied ||
                  breakdown.detailedBreakdown.penalties.inactivity.applied) && (
                  <>
                    <Separator className="bg-neutral-800" />
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <h3 className="text-lg font-semibold">
                          Penalidades Aplicadas
                        </h3>
                        <Badge
                          label="neutral"
                          className="ml-auto border-red-500/30 bg-red-500/10 text-red-400"
                        >
                          -{breakdown.quickBreakdown.totalPenalties} pontos
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-3">
                        {(
                          Object.entries(
                            breakdown.detailedBreakdown.penalties,
                          ) as [
                            string,
                            typeof breakdown.detailedBreakdown.penalties.lowRating,
                          ][]
                        ).map(
                          ([key, penalty]) =>
                            penalty.applied && (
                              <div
                                key={key}
                                className="rounded-lg border border-red-500/30 bg-red-500/5 p-4"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <span className="font-medium text-neutral-100">
                                      {penalty.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-bold text-red-400">
                                    {penalty.value}
                                  </span>
                                </div>
                                <p className="mt-2 text-xs text-neutral-400">
                                  {penalty.reason}
                                </p>
                                {penalty.tip && (
                                  <p className="mt-2 text-xs text-yellow-400">
                                    💡 {penalty.tip}
                                  </p>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* V3 Info Section */}
                {breakdown.barbershopSize && breakdown.targetAttendances && (
                  <>
                    <Separator className="bg-neutral-800" />
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-neutral-400" />
                        <h3 className="text-lg font-semibold">
                          Score V3 - Meta Inteligente
                        </h3>
                      </div>
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <div className="text-xs text-neutral-400">
                              Porte Detectado
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <SizeBadge
                                size={
                                  breakdown.barbershopSize as BarbershopSize
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-400">
                              Meta Ajustada
                            </div>
                            <div className="mt-1 text-2xl font-bold text-blue-400">
                              {breakdown.targetAttendances}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              atendimentos/mês
                            </div>
                          </div>
                          {breakdown.isInRampPeriod &&
                            breakdown.daysWorking !== undefined && (
                              <div>
                                <div className="text-xs text-neutral-400">
                                  Período de Rampa
                                </div>
                                <div className="mt-1">
                                  <NewBarberBadge
                                    daysWorking={breakdown.daysWorking}
                                  />
                                </div>
                                <div className="mt-1 text-[10px] text-neutral-500">
                                  Meta reduzida nos primeiros 90 dias
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Fallback - Se não tiver breakdown, mostrar métricas básicas */}
            {!isLoading && !error && !breakdown && (
              <>
                {/* Metrics Grid */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold">
                      Métricas Principais
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <MetricCard
                      icon={<Star className="h-4 w-4" />}
                      label="Avaliação Média"
                      value={formattedRating}
                      subtitle={`${totalReviews} ${totalReviews === 1 ? "avaliação" : "avaliações"}`}
                      iconColor="text-yellow-500"
                    />
                    <MetricCard
                      icon={<DollarSign className="h-4 w-4" />}
                      label="Receita Total"
                      value={formattedRevenue}
                      iconColor="text-green-500"
                    />
                    <MetricCard
                      icon={<Scissors className="h-4 w-4" />}
                      label="Atendimentos"
                      value={totalAttendances.toString()}
                      subtitle="Serviços realizados"
                      iconColor="text-blue-500"
                    />
                  </div>
                </div>

                <Separator className="bg-neutral-800" />

                {/* Breakdown Chart */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold">
                      Composição do Score
                    </h3>
                  </div>
                  <div className="flex flex-col gap-6 rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
                    <BreakdownBar
                      label="⭐ Avaliações dos Clientes"
                      percentage={50}
                      value={`${formattedRating}/5.0`}
                      color="bg-yellow-500"
                    />
                    <BreakdownBar
                      label="💰 Receita Gerada"
                      percentage={30}
                      value={formattedRevenue}
                      color="bg-green-500"
                    />
                    <BreakdownBar
                      label="✂️ Volume de Atendimentos"
                      percentage={20}
                      value={`${totalAttendances} serviços`}
                      color="bg-blue-500"
                    />
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">
                    * O score é calculado considerando a performance relativa
                    entre todos os colaboradores
                  </p>
                </div>
              </>
            )}

            {/* Recent Reviews Section (placeholder) */}
            {totalReviews > 0 && (
              <>
                <Separator className="bg-neutral-800" />
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold">
                      Avaliações Recentes
                    </h3>
                  </div>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
                    <p className="text-center text-sm text-neutral-500">
                      Em desenvolvimento - visualização de reviews recentes
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                Fechar
              </Button>
              <div className="flex gap-2">
                {/* ✨ V3: Botão de comparação V2 vs V3 */}
                {isV3 && size && targetAttendances && (
                  <Button
                    variant="outline"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => setShowComparison(true)}
                  >
                    Ver Comparação V2 vs V3
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  onClick={() => console.log("Ver histórico:", staffId)}
                >
                  Ver Histórico
                </Button>
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => console.log("Comparar:", staffId)}
                >
                  Comparar com Equipe
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✨ V3: Modal de Comparação */}
      {isV3 && size && targetAttendances && (
        <ScoreComparisonModal
          open={showComparison}
          onOpenChange={setShowComparison}
          staffName={staffName}
          scoreV2={scoreV2}
          scoreV3={score}
          attendances={totalAttendances}
          targetV2={targetV2}
          targetV3={targetAttendances}
          size={size}
        />
      )}
    </>
  );
}
