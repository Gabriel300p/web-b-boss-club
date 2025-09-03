/**
 * 🔍 Staff Filters Hook
 * Simple and maintainable filter management
 */
import { useCallback, useMemo, useState } from "react";
import type { StaffFilters } from "../schemas/barbershop-staff.schemas";

// 🎯 Default filter values
const DEFAULT_FILTERS: StaffFilters = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
};

// 🚀 Main filters hook
export function useStaffFilters(initialFilters: Partial<StaffFilters> = {}) {
  const [filters, setFilters] = useState<StaffFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // 🔄 Update single filter
  const updateFilter = useCallback(
    <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Reset page when filters change (except for page itself)
        ...(key !== "page" && { page: 1 }),
      }));
    },
    [],
  );

  // 🔄 Update multiple filters at once
  const updateFilters = useCallback((newFilters: Partial<StaffFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset page when filters change (except for page itself)
      ...(newFilters.page === undefined && { page: 1 }),
    }));
  }, []);

  // 🔄 Reset all filters to default
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // 🔄 Clear specific filters
  const clearFilter = useCallback((key: keyof StaffFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return {
        ...newFilters,
        page: 1, // Reset page when clearing filters
      };
    });
  }, []);

  // 🔄 Clear all filters except pagination
  const clearAllFilters = useCallback(() => {
    setFilters((prev) => ({
      page: prev.page,
      limit: prev.limit,
      sort_by: prev.sort_by,
      sort_order: prev.sort_order,
    }));
  }, []);

  // 📊 Check if any filters are active (excluding pagination)
  const hasActiveFilters = useMemo(() => {
    const { page, limit, sort_by, sort_order, ...activeFilters } = filters;
    return Object.values(activeFilters).some(
      (value) => value !== undefined && value !== null && value !== "",
    );
  }, [filters]);

  // 📊 Get active filter count
  const activeFilterCount = useMemo(() => {
    const { page, limit, sort_by, sort_order, ...activeFilters } = filters;
    return Object.values(activeFilters).filter(
      (value) => value !== undefined && value !== null && value !== "",
    ).length;
  }, [filters]);

  // 📊 Get filter summary for display
  const filterSummary = useMemo(() => {
    const summary: string[] = [];

    if (filters.status) summary.push(`Status: ${filters.status}`);
    if (filters.role_in_shop) summary.push(`Função: ${filters.role_in_shop}`);
    if (filters.is_available !== undefined) {
      summary.push(`Disponível: ${filters.is_available ? "Sim" : "Não"}`);
    }
    if (filters.search) summary.push(`Busca: "${filters.search}"`);

    return summary;
  }, [filters]);

  return {
    // Current filters
    filters,

    // Actions
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    clearAllFilters,

    // Computed values
    hasActiveFilters,
    activeFilterCount,
    filterSummary,
  };
}
