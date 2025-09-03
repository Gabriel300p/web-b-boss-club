import { FilterToolbarSkeleton } from "@/shared/components/skeletons/FilterSkeletons";
import { EmptyState } from "@shared/components/common/EmptyState";
import { PlusCircleIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import Divider from "@shared/components/ui/divider";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ComunicacoesToolbar,
  createColumns,
  DataTable,
  ModalComunicacao,
  ModalDeleteConfirm,
} from "../components/_index";
import { CommunicationTableSkeleton } from "../components/skeletons/_index";
import { useComunicacoes, useFilters, useModals } from "../hooks/_index";
import type { ComunicacaoForm } from "../schemas/comunicacao.schemas";

export default function ComunicacoesPage() {
  const { t } = useTranslation("records");
  const {
    comunicacoes,
    isLoading,
    error,
    createComunicacao,
    updateComunicacao,
    deleteComunicacao,
  } = useComunicacoes();

  const {
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedComunicacao,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
  } = useModals();

  const { filterComunicacoes, hasActiveFilters, resetFilters } = useFilters();

  // Apply filters to comunicacoes
  const filteredComunicacoes = useMemo(() => {
    return filterComunicacoes(comunicacoes);
  }, [comunicacoes, filterComunicacoes]);

  // Extract unique autores for filter
  const autores = useMemo(() => {
    const uniqueAutores = Array.from(new Set(comunicacoes.map((c) => c.autor)));
    return uniqueAutores.sort();
  }, [comunicacoes]);

  // Determine what to show
  const shouldShowEmptyState = !isLoading && comunicacoes.length === 0;
  const shouldShowFilteredEmptyState =
    !isLoading &&
    comunicacoes.length > 0 &&
    filteredComunicacoes.length === 0 &&
    hasActiveFilters;

  const handleSaveNew = async (data: ComunicacaoForm) => {
    await createComunicacao(data);
  };

  const handleSaveEdit = async (data: ComunicacaoForm) => {
    if (selectedComunicacao) {
      await updateComunicacao(selectedComunicacao.id, data);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedComunicacao) {
      await deleteComunicacao(selectedComunicacao.id);
    }
  };

  // Memoize columns to prevent unnecessary re-creation
  const columns = useMemo(
    () =>
      createColumns({
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
              <ComunicacoesToolbar
                autores={autores}
                totalCount={filteredComunicacoes.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content - Table or Empty States */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <CommunicationTableSkeleton />
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
              <DataTable columns={columns} data={filteredComunicacoes} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals - No Suspense to avoid complexity */}
      <ModalComunicacao
        isOpen={isAddModalOpen}
        onClose={closeAllModals}
        onSave={handleSaveNew}
        isEditing={false}
      />

      <ModalComunicacao
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        onSave={handleSaveEdit}
        comunicacao={selectedComunicacao}
        isEditing={true}
      />

      <ModalDeleteConfirm
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        onConfirm={handleConfirmDelete}
        comunicacao={selectedComunicacao}
      />
    </motion.div>
  );
}
