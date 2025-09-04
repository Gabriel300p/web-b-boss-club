import { EmptyState } from "@/shared/components/common/EmptyState";
import { FilterToolbarSkeleton } from "@/shared/components/skeletons/FilterSkeletons";
import { TableSkeleton } from "@/shared/components/skeletons/TableSkeleton";
import { useStableLoading } from "@/shared/hooks/useStableLoading";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { BarbershopStaffFilters } from "../../components/filter/BarbershopStaffFilters";
import { BarbershopStaffDataTable } from "../../components/table/BarbershopStaffDataTable";
import { createColumns } from "../../components/table/columns";
import type { 
  BarbershopStaff, 
  StaffFilters, 
  StaffListResponse 
} from "../../schemas/barbershop-staff.schemas";

// 🎯 Props interface for better type safety
interface BarbershopStaffPageContentProps {
  staff: BarbershopStaff[];
  pagination: StaffListResponse['pagination'] | undefined;
  isLoading: boolean;
  filters: StaffFilters;
  updateFilter: <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
}

export function BarbershopStaffPageContent({
  staff,
  pagination,
  isLoading,
  filters,
  updateFilter,
  clearAllFilters,
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

  // 🎯 Empty state logic
  const shouldShowEmptyState =
    !stableLoading && staff.length === 0 && !hasActiveFilters;
  const shouldShowFilteredEmptyState =
    !stableLoading && staff.length === 0 && hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <AnimatePresence mode="wait">
        {stableLoading ? (
          <FilterToolbarSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <BarbershopStaffFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearAllFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - Table or Empty States */}
      <AnimatePresence mode="wait">
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
              onClick: clearAllFilters,
            }}
          />
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <BarbershopStaffDataTable
              columns={columns}
              data={staff}
              pagination={pagination}
              onPaginationChange={(page) => updateFilter("page", page)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
