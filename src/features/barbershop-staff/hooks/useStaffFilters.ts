import { useCallback, useMemo, useState } from "react";
import type { StaffFilters } from "../schemas/barbershop-staff.schemas";

// 🎯 Default filters configuration
const DEFAULT_FILTERS: StaffFilters = {
  page: 1,
  limit: 30,
  sort_by: "created_at",
  sort_order: "desc",
};

// 🎯 Staff filters management hook
export function useStaffFilters() {
  // 🎯 Memoize initial state to prevent object recreation
  const initialState = useMemo(() => ({ ...DEFAULT_FILTERS }), []);

  // 🎯 Filter state
  const [filters, setFilters] = useState<StaffFilters>(initialState);

  // 🔄 Update filters
  const updateFilters = useCallback((newFilters: Partial<StaffFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // 🔄 Reset filters
  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  // 🔄 Update single filter field
  const updateFilter = useCallback(
    <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => {
      updateFilters({ [key]: value });
    },
    [updateFilters],
  );

  // 🔄 Reset pagination (useful after applying filters)
  const resetPagination = useCallback(() => {
    updateFilters({ page: 1 });
  }, [updateFilters]);

  // 📊 Check if any filters are active (excluding pagination and sorting)
  const hasActiveFilters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, limit, sort_by, sort_order, ...activeFilters } = filters;
    return Object.values(activeFilters).some(
      (value) => value !== undefined && value !== null && value !== "",
    );
  }, [filters]);

  // 📊 Get active filter count (excluding pagination and sorting)
  const activeFilterCount = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, limit, sort_by, sort_order, ...activeFilters } = filters;
    return Object.values(activeFilters).filter(
      (value) => value !== undefined && value !== null && value !== "",
    ).length;
  }, [filters]);

  // 🎯 Return hook interface
  return {
    filters,
    updateFilters,
    updateFilter,
    resetFilters,
    resetPagination,
    hasActiveFilters,
    activeFilterCount,
  };
}
