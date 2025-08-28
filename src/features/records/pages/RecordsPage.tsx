import { RecordTableSkeleton } from "@features/records/components/skeletons/_index";
import {
  useRecordFilters,
  useRecordModals,
  useRecords,
} from "@features/records/hooks/_index";
import type {
  BaseRecord,
  RecordForm,
} from "@features/records/schemas/record.schemas";
import { EmptyState } from "@shared/components/common/EmptyState";
import { FilterToolbarSkeleton } from "@shared/components/filters/FilterSkeletons";
import { PlusCircleIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import Divider from "@shared/components/ui/divider";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  createRecordColumns,
  RecordDataTable,
  RecordDeleteModal,
  RecordModal,
  RecordsToolbar,
} from "../components/_index";

export default function RecordsPage() {
  const { t } = useTranslation("records");
  const {
    records,
    isLoading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useRecords();

  const {
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedRecord,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
  } = useRecordModals();

  const { filterRecords, hasActiveFilters, resetFilters } = useRecordFilters();

  // Apply filters to records
  const filteredRecords = useMemo(() => {
    return filterRecords(records);
  }, [records, filterRecords]);

  // Extract unique autores for filter
  const autores = useMemo(() => {
    const uniqueAutores = Array.from(
      new Set(records.map((r: BaseRecord) => r.autor)),
    );
    return uniqueAutores.sort();
  }, [records]);

  // Determine what to show
  const shouldShowEmptyState = !isLoading && records.length === 0;
  const shouldShowFilteredEmptyState =
    !isLoading &&
    records.length > 0 &&
    filteredRecords.length === 0 &&
    hasActiveFilters;

  const handleSaveNew = async (data: RecordForm) => {
    await createRecord(data);
  };

  const handleSaveEdit = async (data: RecordForm) => {
    if (selectedRecord) {
      await updateRecord(selectedRecord.id, data);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRecord) {
      await deleteRecord(selectedRecord.id);
    }
  };

  // Memoize columns to prevent unnecessary re-creation
  const columns = useMemo(
    () =>
      createRecordColumns({
        onEdit: openEditModal,
        onDelete: openDeleteModal,
      }),
    [openEditModal, openDeleteModal],
  );

  // ✅ Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600">
          {t("error.load", { message: error.message })}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
      className="mx-auto space-y-6 rounded-xl bg-white p-8 shadow-lg"
    >
      {/* Header - renderiza imediatamente com animação */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-primary text-sm font-medium underline">
            {t("breadcrumb.section")}
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">{t("title")}</h1>
        </div>
        <Button
          onClick={openAddModal}
          size="default"
          className="flex items-center gap-1.5 rounded-md px-3.5 py-3 transition-opacity duration-300 hover:opacity-80"
        >
          <PlusCircleIcon weight="fill" className="size-5" />
          <span className="hidden sm:block">{t("actions.new")}</span>
        </Button>
      </motion.div>
      <Divider />
      {/* Content */}
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
              <RecordsToolbar
                autores={autores}
                totalCount={filteredRecords.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content - Table or Empty States */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <RecordTableSkeleton />
          ) : shouldShowEmptyState ? (
            <EmptyState
              type="noData"
              action={{
                label: t("empty.noData.action"),
                onClick: openAddModal,
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
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <RecordDataTable columns={columns} data={filteredRecords} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals - No Suspense to avoid complexity */}
      <RecordModal
        isOpen={isAddModalOpen}
        onClose={closeAllModals}
        onSave={handleSaveNew}
        isEditing={false}
      />

      <RecordModal
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        onSave={handleSaveEdit}
        record={selectedRecord}
        isEditing={true}
      />

      <RecordDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        onConfirm={handleConfirmDelete}
        record={selectedRecord}
      />
    </motion.div>
  );
}
