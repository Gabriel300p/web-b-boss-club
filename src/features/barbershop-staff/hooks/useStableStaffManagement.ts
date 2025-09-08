/**
 * 🛡️ Stable Staff Hook - Versão que NÃO causa re-renders
 * Esta é uma versão robusta que elimina todos os problemas de re-render
 */
import type { TableColumn } from "@shared/types/table.types";
import { useMemo } from "react";
import { createColumns } from "../components/table/columns";
import type { StaffFilters } from "../schemas/barbershop-staff.schemas";
import { useBarbershopStaff as useOriginalBarbershopStaff } from "./useBarbershopStaff";
import { useStaffFilters as useOriginalStaffFilters } from "./useStaffFilters";
import { useTableSettings } from "./useTableSettings";

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
      ...(filters.is_available !== undefined && {
        is_available: filters.is_available,
      }),
      ...(filters.barbershop_id && { barbershop_id: filters.barbershop_id }),
      ...(filters.hired_after && { hired_after: filters.hired_after }),
      ...(filters.hired_before && { hired_before: filters.hired_before }),
      ...(filters.available_for_booking !== undefined && {
        available_for_booking: filters.available_for_booking,
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

  // 🎯 Create table columns for settings
  const tableColumns: TableColumn[] = useMemo(() => {
    // Create columns with dummy handlers for conversion
    const columns = createColumns({
      onEdit: () => {},
      onDelete: () => {},
    });

    return columns
      .filter((column) => column.id !== "actions") // Exclude actions column from settings
      .map((column) => {
        // Get column ID - prefer 'id' over 'accessorKey'
        const columnId =
          column.id ||
          ((column as { accessorKey?: string }).accessorKey as string);

        // Get column label - handle both string and function headers
        let columnLabel = "Coluna"; // Default fallback
        if (typeof column.header === "string") {
          columnLabel = column.header;
        } else if (typeof column.header === "function") {
          // For function headers, we'll use a mapping based on column ID
          const labelMap: Record<string, string> = {
            first_name: "Nome",
            "user.email": "Email",
            role_in_shop: "Função",
            status: "Status",
            is_available: "Disponibilidade",
            hire_date: "Data de Contratação",
          };
          columnLabel = labelMap[columnId] || "Coluna";
        }

        return {
          id: columnId,
          label: columnLabel,
          defaultVisible: true,
          fixed: columnId === "first_name", // Fix name column
        };
      });
  }, []);

  const tableSettingsHook = useTableSettings(tableColumns);

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

    // Table settings
    tableSettings: tableSettingsHook.settings,
    onTableSettingsChange: tableSettingsHook.onTableSettingsChange,
    resetTableSettings: tableSettingsHook.resetSettings,
  };
}
