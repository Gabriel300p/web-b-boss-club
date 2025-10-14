import { EmptyState, ReloadButton } from "@/shared/components/common";
import { FilterSkeleton } from "@/shared/components/skeletons/FilterSkeletons";
import { TableSkeleton } from "@/shared/components/skeletons/TableSkeleton";
import { useReloadData } from "@/shared/hooks";
import { useStableLoading } from "@/shared/hooks/useStableLoading";
import type { TableSettingsConfig } from "@shared/types/table.types";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { BarbershopStaffFilters } from "../../components/filter/BarbershopStaffFilters";
import { BarbershopStaffDataTable } from "../../components/table/BarbershopStaffDataTable";
import { createColumns } from "../../components/table/columns";
import type {
  BarbershopStaff,
  StaffFilters,
  StaffListResponse,
} from "../../schemas/barbershop-staff.schemas";

// 🎯 Import bulk selection types
import type { UseBulkSelectionReturn } from "../../hooks/useBulkSelection";

// 🎯 Props interface for better type safety
interface BarbershopStaffPageContentProps {
  staff: BarbershopStaff[];
  pagination: StaffListResponse["pagination"] | undefined;
  isLoading: boolean;
  filters: StaffFilters;
  updateFilter: <K extends keyof StaffFilters>(
    key: K,
    value: StaffFilters[K],
  ) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  onTableSettingsChange?: (settings: TableSettingsConfig) => void;
  tableSettings?: TableSettingsConfig;
  onView: (staff: BarbershopStaff) => void;
  onEdit: (staff: BarbershopStaff) => void;
  onToggleStatus: (staff: BarbershopStaff) => void;
  bulkSelection: UseBulkSelectionReturn;
}

export function BarbershopStaffPageContent({
  staff,
  pagination,
  isLoading,
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
  refetch,
  onTableSettingsChange,
  onView,
  onEdit,
  onToggleStatus,
  bulkSelection,
  // tableSettings,
}: BarbershopStaffPageContentProps) {
  // 🎯 Hook de reload componentizado
  const { isReloading, countdown, reloadButtonProps } = useReloadData({
    refetch,
    resetFilters,
    namespace: "barbershop-staff",
    cooldownMs: 10000,
  });

  // �️ Stabilize loading state to prevent skeleton duplication in StrictMode
  const { isLoading: stableLoading } = useStableLoading({
    isLoading,
    minLoadingTime: 200, // Minimum loading time for better UX
  });

  // 📋 Table columns (com bulk selection na Fase 1)
  const columns = createColumns({
    onView,
    onEdit,
    onToggleStatus,
    enableBulkSelection: true,
  });

  // 🎯 Separate loading states: filters should NEVER show skeleton during filtering
  const isFiltering = stableLoading && staff.length > 0;

  // 🎯 Empty state logic
  const shouldShowEmptyState =
    !stableLoading && staff.length === 0 && !hasActiveFilters;
  const shouldShowFilteredEmptyState =
    !stableLoading && staff.length === 0 && hasActiveFilters;

  // ⌨️ Atalho de teclado Ctrl+A para selecionar todos da página
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+A ou Cmd+A (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        // Só funciona se não estiver em input/textarea
        const target = event.target as HTMLElement;
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          event.preventDefault();
          // Selecionar todos da página atual
          const allIds = staff.map((s) => s.id);
          const newSelection: Record<string, boolean> = {};
          allIds.forEach((id) => {
            newSelection[id] = true;
          });
          bulkSelection.setRowSelection(newSelection);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [staff, bulkSelection]);

  return (
    <div className="space-y-6">
      {/* Filters Toolbar - NEVER show skeleton during filtering */}
      <div className="relative">
        <BarbershopStaffFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={resetFilters}
          onTableSettingsChange={onTableSettingsChange}
        />
        {/* 🎯 Subtle loading indicator during filtering */}
        {isFiltering && <FilterSkeleton />}
      </div>
      {stableLoading || isReloading ? (
        <TableSkeleton />
      ) : shouldShowEmptyState || shouldShowFilteredEmptyState ? (
        <div className="mb-12 flex flex-col items-center gap-4">
          <EmptyState type="noData" />
          <ReloadButton
            {...reloadButtonProps}
            isLoading={isReloading}
            countdown={countdown}
            className="mt-4"
          />
        </div>
      ) : (
        <BarbershopStaffDataTable
          columns={columns}
          data={staff}
          pagination={pagination}
          onPaginationChange={(page) => updateFilter("page", page)}
          onPageSizeChange={(limit) => {
            updateFilter("limit", limit);
            updateFilter("page", 1); // Reset to first page when changing page size
          }}
          rowSelection={bulkSelection.rowSelection}
          onRowSelectionChange={bulkSelection.setRowSelection}
          enableRowSelection={true}
        />
      )}
    </div>
  );
}
