/**
 * 👥 useSearchStaff Hook
 * Busca de funcionários (staff) via API com scoring e filtros
 */

import type { BarbershopStaff } from "@features/barbershop-staff/schemas/barbershop-staff.schemas";
import { fetchStaffList } from "@features/barbershop-staff/services/barbershop-staff.service";
import { UsersIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import type { StaffSearchResult } from "../types/search.types";
import { calculateRelevanceScore } from "../utils/search-scorer";

/**
 * 🔄 Converter BarbershopStaff para StaffSearchResult
 */
function mapStaffToSearchResult(
  staff: BarbershopStaff,
  query: string,
): StaffSearchResult {
  // Calcular score baseado em nome e email
  const searchableText = [
    staff.first_name,
    staff.last_name,
    staff.display_name,
    staff.user.email,
  ]
    .filter(Boolean)
    .join(" ");

  const score = calculateRelevanceScore(
    query,
    staff.first_name,
    searchableText,
  );

  return {
    id: staff.id,
    type: "staff",
    title:
      staff.display_name ||
      `${staff.first_name} ${staff.last_name || ""}`.trim(),
    description: `${staff.role_in_shop === "BARBER" ? "Barbeiro" : "Proprietário"} • ${staff.user.email}`,
    icon: UsersIcon,
    score,
    staff,
    status: staff.status,
    avatarUrl: staff.user.avatar_url || undefined,
  };
}

/**
 * 🎯 Hook para buscar staff
 *
 * @param query - Termo de busca
 * @param maxResults - Máximo de resultados (default: 5)
 * @param enabled - Se a busca está habilitada (default: true)
 * @returns Staff filtrado e ordenado por relevância
 */
export function useSearchStaff(
  query: string,
  maxResults: number = 5,
  enabled: boolean = true,
) {
  // 🚨 FASE 6: Parâmetros para queryKey completa
  const searchParams = {
    search: query,
    status: "ACTIVE" as const,
    limit: 50,
  };

  // Buscar staff via API (apenas ativos por padrão)
  const {
    data: staffData,
    isLoading,
    error,
  } = useQuery({
    // ✅ FASE 6: QueryKey completa com TODOS os parâmetros
    queryKey: ["search", "staff", searchParams],
    queryFn: () => fetchStaffList(searchParams),
    enabled: enabled && query.trim().length > 0, // Só buscar se tiver query
    // ⚡ FASE 6: Cache agressivo - evita requisições desnecessárias
    staleTime: 5 * 60 * 1000, // 5 minutos (antes: 30s)
    gcTime: 10 * 60 * 1000, // 10 minutos (antes: 5min)
    // ⚡ FASE 6: Desabilita refetch ao focar na janela
    refetchOnWindowFocus: false,
    // ⚡ FASE 6: Desabilita refetch ao remontar componente
    refetchOnMount: false,
    // ⚡ FASE 6: Retry apenas 1 vez em caso de erro
    retry: 1,
  });

  // Mapear e calcular scores
  const results: StaffSearchResult[] = staffData?.data
    ? staffData.data
        .map((staff) => mapStaffToSearchResult(staff, query))
        .filter((result) => result.score >= 10) // Filtro de score mínimo
        .sort((a, b) => b.score - a.score) // Ordenar por relevância
        .slice(0, maxResults) // Limitar resultados
    : [];

  // Total de matches válidos (antes do slice)
  const totalMatches = staffData?.data
    ? staffData.data
        .map((staff) => mapStaffToSearchResult(staff, query))
        .filter((result) => result.score >= 10).length
    : 0;

  return {
    results,
    isLoading,
    error,
    hasMore: totalMatches > maxResults,
    totalMatches,
  };
}
