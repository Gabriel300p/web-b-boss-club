import { EmptyState } from "@/shared/components/common/EmptyState";
import { FilterToolbarSkeleton } from "@/shared/components/skeletons/FilterSkeletons";
import { TableSkeleton } from "@/shared/components/skeletons/TableSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BarbershopStaffFilters } from "../../components/filter/BarbershopStaffFilters";
import { BarbershopStaffDataTable } from "../../components/table/BarbershopStaffDataTable";
import { createColumns } from "../../components/table/columns";
import { useBarbershopStaff } from "../../hooks/useBarbershopStaff";
import { useStaffFilters } from "../../hooks/useStaffFilters";

export function BarbershopStaffPageContent() {
  const { t } = useTranslation("barbershop-staff");

  // 🔍 Filters management
  const { filters, updateFilter, clearAllFilters, hasActiveFilters } =
    useStaffFilters();

  // 📊 Data fetching
  const { staff, pagination, isLoading } = useBarbershopStaff(filters);

  // 📋 Table columns
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
    !isLoading && staff.length === 0 && !hasActiveFilters;
  const shouldShowFilteredEmptyState =
    !isLoading && staff.length === 0 && hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <AnimatePresence mode="wait">
        {isLoading ? (
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
        {isLoading ? (
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
