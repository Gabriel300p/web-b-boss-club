import { useRecords } from "@/features/records";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { FilterToolbarSkeleton } from "@/shared/components/skeletons/FilterSkeletons";
import { TableSkeleton } from "@/shared/components/skeletons/TableSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BarbershopStaffFilters } from "../../components/filter/BarbershopStaffFilters";
import { BarbershopStaffDataTable } from "../../components/table/BarbershopStaffDataTable";

export function BarbershopStaffPageContent() {
  const { t } = useTranslation("records");
  const { isLoading } = useRecords();

  const shouldShowEmptyState = false;
  const shouldShowFilteredEmptyState = false;

  return (
    <div>
      <div className="space-y-4">
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
              <BarbershopStaffFilters autores={[]} totalCount={0} />
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
                onClick: () => {},
              }}
            />
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <BarbershopStaffDataTable columns={[]} data={[]} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
