/**
 * 🪝 Staff Score Hook
 * Hook para buscar e gerenciar dados de score de desempenho de barbeiros
 */
import { useToast } from "@shared/hooks";
import { createAppError, ErrorHandler, ErrorTypes } from "@shared/lib/errors";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthStore } from "../../../app/store/auth";

// 🔑 Query keys para cache otimizado
export const SCORE_QUERY_KEYS = {
  score: {
    all: (userId?: string) => ["staff-score", userId] as const,
    details: (userId?: string) =>
      [...SCORE_QUERY_KEYS.score.all(userId), "detail"] as const,
    detail: (staffId: string, filters: ScoreFilters, userId?: string) =>
      [...SCORE_QUERY_KEYS.score.details(userId), staffId, filters] as const,
  },
} as const;

// 📊 Tipos para Score (3 níveis)
export type ScoreLevel = "critical" | "good" | "excellent";

export interface ScoreFilters {
  period?: "7d" | "30d" | "90d";
  start_date?: string;
  end_date?: string;
}

export interface ScoreBreakdown {
  rating_score: number;
  revenue_score: number;
  attendance_score: number;
  total_score: number;
}

export interface ScoreMetrics {
  average_rating: number | null;
  total_reviews: number;
  total_revenue: number;
  revenue_rank: number;
  total_attendances: number;
  attendance_rank: number;
  total_barbers: number;
}

export interface ScoreRank {
  position: number;
  total: number;
  percentile: number;
}

export interface ScoreResponse {
  staff_id: string;
  staff_name: string;
  avatar_url: string | null;
  score: number;
  score_level: ScoreLevel;
  breakdown: ScoreBreakdown;
  metrics: ScoreMetrics;
  rank: ScoreRank;
  period: {
    start_date: string;
    end_date: string;
  };
  calculated_at: string;
}

// 🎯 Default filter values
const DEFAULT_SCORE_FILTERS: ScoreFilters = {
  period: "30d",
};

/**
 * 🎯 Hook principal para buscar score de um barbeiro
 */
export function useStaffScore(
  staffId: string,
  filters: ScoreFilters = DEFAULT_SCORE_FILTERS,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  },
) {
  const { error: showError } = useToast();
  const errorHandler = ErrorHandler.getInstance();
  const { user } = useAuthStore();

  // 🎯 Memoize merged filters
  const mergedFilters = useMemo(
    () => ({
      ...DEFAULT_SCORE_FILTERS,
      ...filters,
    }),
    [filters],
  );

  // 🎯 Memoize query key
  const queryKey = useMemo(
    () => SCORE_QUERY_KEYS.score.detail(staffId, mergedFilters, user?.id),
    [staffId, mergedFilters, user?.id],
  );

  // 🔍 Query para buscar score
  const query = useQuery<ScoreResponse>({
    queryKey,
    queryFn: async () => {
      try {
        // Build query params
        const params = new URLSearchParams();
        if (mergedFilters.period) params.append("period", mergedFilters.period);
        if (mergedFilters.start_date)
          params.append("start_date", mergedFilters.start_date);
        if (mergedFilters.end_date)
          params.append("end_date", mergedFilters.end_date);

        // Use apiService para requisições autenticadas
        const { apiService } = await import("@shared/services/api.service");
        const response = await apiService.get<ScoreResponse>(
          `/barbershop-staff/${staffId}/score?${params.toString()}`,
        );

        return response.data;
      } catch (error) {
        const appError = createAppError(
          ErrorTypes.API_ERROR,
          "FETCH_SCORE_FAILED",
          "Não foi possível buscar o score do barbeiro",
          {
            details: error,
            context: { action: "fetch", entity: "staff-score", staffId },
          },
        );
        errorHandler.handle(appError);
        showError(
          "Erro ao buscar score",
          error instanceof Error ? error.message : "Erro desconhecido",
        );
        throw appError;
      }
    },
    enabled: options?.enabled !== false && !!staffId,
    staleTime: 5 * 60 * 1000, // 5 minutos (score muda pouco)
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: false, // Não refetch ao voltar para a janela
    retry: 2,
  });

  return {
    score: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * 🎨 Helper: Obter cor do badge baseado no nível (3 níveis)
 */
export function getScoreBadgeColor(level: ScoreLevel): string {
  const colors: Record<ScoreLevel, string> = {
    critical: "text-red-500 bg-red-500/10 border-red-500/20",
    good: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    excellent: "text-green-400 bg-green-400/10 border-green-400/20",
  };
  return colors[level];
}

/**
 * 🎨 Helper: Obter label traduzido do nível (3 níveis)
 */
export function getScoreLevelLabel(level: ScoreLevel): string {
  const labels: Record<ScoreLevel, string> = {
    critical: "Precisa Melhorar",
    good: "Bom",
    excellent: "Excelente",
  };
  return labels[level];
}

/**
 * 🎨 Helper: Obter emoji do nível (3 níveis)
 */
export function getScoreLevelEmoji(level: ScoreLevel): string {
  const emojis: Record<ScoreLevel, string> = {
    critical: "🔴",
    good: "�",
    excellent: "�",
  };
  return emojis[level];
}
