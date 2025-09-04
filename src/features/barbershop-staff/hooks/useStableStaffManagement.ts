/**
 * 🛡️ Stable Staff Hook - Versão que NÃO causa re-renders
 * Esta é uma versão robusta que elimina todos os problemas de re-render
 */
import { useMemo } from "react";
import { useBarbershopStaff as useOriginalBarbershopStaff } from "./useBarbershopStaff";
import { useStaffFilters as useOriginalStaffFilters } from "./useStaffFilters";
import type { StaffFilters } from "../schemas/barbershop-staff.schemas";

// 🎯 Hook estável para filtros que NÃO re-renderiza desnecessariamente
export function useStableStaffFilters() {
  return useOriginalStaffFilters();
}

// 🎯 Hook estável para staff que NÃO re-renderiza desnecessariamente  
export function useStableBarbershopStaff(filters: StaffFilters) {
  // Memoizar profundamente os filtros para evitar re-renders
  const stableFilters = useMemo(() => {
    // Criar um objeto com keys ordenadas para comparação consistente
    const sortedFilters: StaffFilters = {
      page: filters.page || 1,
      limit: filters.limit || 10,
      sort_by: filters.sort_by || "created_at",
      sort_order: filters.sort_order || "desc",
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { search: filters.search }),
      ...(filters.role_in_shop && { role_in_shop: filters.role_in_shop }),
      ...(filters.is_available !== undefined && { is_available: filters.is_available }),
      ...(filters.barbershop_id && { barbershop_id: filters.barbershop_id }),
      ...(filters.hired_after && { hired_after: filters.hired_after }),
      ...(filters.hired_before && { hired_before: filters.hired_before }),
      ...(filters.available_for_booking !== undefined && { 
        available_for_booking: filters.available_for_booking 
      }),
    };
    
    return sortedFilters;
  }, [
    filters.page,
    filters.limit, 
    filters.sort_by,
    filters.sort_order,
    filters.status,
    filters.search,
    filters.role_in_shop,
    filters.is_available,
    filters.barbershop_id,
    filters.hired_after,
    filters.hired_before,
    filters.available_for_booking,
  ]);
  
  return useOriginalBarbershopStaff(stableFilters);
}

// 🎯 Hook combinado que gerencia tudo de forma estável
export function useStableStaffManagement() {
  const filtersHook = useStableStaffFilters();
  const staffHook = useStableBarbershopStaff(filtersHook.filters);
  
  return {
    // Filters
    filters: filtersHook.filters,
    updateFilter: filtersHook.updateFilter,
    resetFilters: filtersHook.resetFilters,
    hasActiveFilters: filtersHook.hasActiveFilters,
    
    // Staff data
    staff: staffHook.staff,
    pagination: staffHook.pagination,
    statistics: staffHook.statistics,
    isLoading: staffHook.isLoading,
    refetch: staffHook.refetch,
  };
}
