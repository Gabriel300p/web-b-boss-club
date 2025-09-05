import { EmptyState } from "@/shared/components/common/EmptyState";
import { FilterSkeleton } from "@/shared/components/skeletons/FilterSkeletons";
import { TableSkeleton } from "@/shared/components/skeletons/TableSkeleton";
import { useStableLoading } from "@/shared/hooks/useStableLoading";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BarbershopStaffFilters } from "../../components/filter/BarbershopStaffFilters";
import { BarbershopStaffDataTable } from "../../components/table/BarbershopStaffDataTable";
import { createColumns } from "../../components/table/columns";
import type {
  BarbershopStaff,
  StaffFilters,
  StaffListResponse,
} from "../../schemas/barbershop-staff.schemas";

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
}

export function BarbershopStaffPageContent({
  staff,
  pagination,
  isLoading,
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
}: BarbershopStaffPageContentProps) {
  const { t } = useTranslation("barbershop-staff");

  // �️ Stabilize loading state to prevent skeleton duplication in StrictMode
  const { isLoading: stableLoading } = useStableLoading({
    isLoading,
    minLoadingTime: 200, // Minimum loading time for better UX
  });

  // �📋 Table columns
  const columns = createColumns({
    onEdit: (staff) => {
      // TODO: Implementar edição
      console.log("Edit staff:", staff);
    },
    onDelete: (staff) => {
      // TODO: Implementar exclusão
      console.log("Delete staff:", staff);
    },
  });

  // 🎯 Separate loading states: filters should NEVER show skeleton during filtering
  const isFiltering = stableLoading && staff.length > 0;

  // 🎯 Empty state logic
  const shouldShowEmptyState =
    !stableLoading && staff.length === 0 && !hasActiveFilters;
  const shouldShowFilteredEmptyState =
    !stableLoading && staff.length === 0 && hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Filters Toolbar - NEVER show skeleton during filtering */}
      <div className="relative">
        <BarbershopStaffFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={resetFilters}
        />
        {/* 🎯 Subtle loading indicator during filtering */}
        {isFiltering && <FilterSkeleton />}
      </div>
      {stableLoading ? (
        <TableSkeleton />
      ) : shouldShowEmptyState ? (
        <EmptyState
          type="noData"
          action={{
            label: t("empty.noData.action"),
            onClick: () => {},
          }}
        />
      ) : shouldShowFilteredEmptyState ? (
        <EmptyState
          type="filtered"
          action={{
            label: t("empty.filtered.action"),
            onClick: resetFilters,
          }}
        />
      ) : (
        <BarbershopStaffDataTable
          columns={columns}
          data={staff}
          pagination={pagination}
          onPaginationChange={(page) => updateFilter("page", page)}
        />
      )}
    </div>
  );
}
