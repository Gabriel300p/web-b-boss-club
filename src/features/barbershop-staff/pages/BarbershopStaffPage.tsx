import { Divider } from "@/shared/components/ui";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { BulkActionsBar } from "../components/common/BulkActionsBar";
import { StaffModal } from "../components/dialogs/StaffModal";
import { StaffStatusModal } from "../components/dialogs/StaffStatusModal";
import { useBarbershopStaff } from "../hooks/useBarbershopStaff";
import { useBulkActions } from "../hooks/useBulkActions";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useStableStaffManagement } from "../hooks/useStableStaffManagement";
import type { BarbershopStaff } from "../schemas/barbershop-staff.schemas";
import { BarbershopStaffPageContent } from "./sections/BarbershopStaffPageContent";
import { BarbershopStaffPageHeader } from "./sections/BarbershopStaffPageHeader";

export function BarbershopStaffPage() {
  // 🔍 Ler nome do staff da URL (vindo da busca global)
  const search = useSearch({ from: "/barbershop-staff" });
  const navigate = useNavigate();

  // 🎯 Modal states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<
    "create" | "view" | "edit"
  >("create");
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<BarbershopStaff | null>(
    null,
  );

  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    staff,
    pagination,
    statistics,
    isLoading,
    refetch,
  } = useStableStaffManagement();

  // 🔍 Aplicar filtro automático quando vem da busca global
  const filterAppliedRef = useRef(false);

  useEffect(() => {
    const staffName = search.staffName;

    // Só aplicar uma vez quando tem staffName na URL
    if (!staffName || filterAppliedRef.current) return;

    // Marcar como aplicado
    filterAppliedRef.current = true;

    // Aplicar filtro
    updateFilter("search", staffName);

    // Limpar URL (manter apenas o filtro, remover search param)
    navigate({
      to: "/barbershop-staff",
      search: {},
      replace: true,
    });
  }, [search.staffName, updateFilter, navigate]);

  // Reset quando staffName muda
  useEffect(() => {
    if (search.staffName) {
      filterAppliedRef.current = false;
    }
  }, [search.staffName]);

  // 🎯 Hook com ações (toggle status, etc)
  const { toggleStaffStatus } = useBarbershopStaff(filters);

  // 🎯 Bulk selection hook
  const bulkSelection = useBulkSelection({
    data: staff,
    totalRecords: pagination?.total,
  });

  // 🎯 Bulk actions hook (activate/deactivate/csv)
  const bulkActions = useBulkActions({
    onSuccess: () => {
      // Limpar seleção após sucesso
      bulkSelection.clearSelection();
      // Refetch data para atualizar lista
      refetch();
    },
    onCSVExportSuccess: () => {
      // Limpar seleção após export
      bulkSelection.clearSelection();
    },
  });

  // 🎯 Handler para exportar CSV
  const handleExportCSV = useCallback(() => {
    // Filtrar apenas os staff selecionados
    const selectedStaff = staff.filter((s) =>
      bulkSelection.selectedIds.includes(s.id),
    );
    bulkActions.exportCSV(selectedStaff);
  }, [staff, bulkSelection.selectedIds, bulkActions]);

  // 🎯 Estado para loading de select all pages
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false);

  // 🎯 Handler para selecionar todas as páginas
  const handleSelectAllPages = useCallback(async () => {
    setIsLoadingAllPages(true);
    try {
      // Importar dinamicamente para evitar circular dependency
      const { fetchAllStaffIds } = await import(
        "../services/barbershop-staff.service"
      );
      const allIds = await fetchAllStaffIds(filters);
      bulkSelection.selectAllPages(allIds);
    } catch (error) {
      console.error("Error fetching all staff IDs:", error);
    } finally {
      setIsLoadingAllPages(false);
    }
  }, [filters, bulkSelection]);

  // 🎯 Handlers para ações
  const handleCreate = useCallback(() => {
    setStaffModalMode("create");
    setSelectedStaffId(null);
    setIsStaffModalOpen(true);
  }, []);

  const handleView = useCallback((staff: BarbershopStaff) => {
    setStaffModalMode("view");
    setSelectedStaffId(staff.id);
    setIsStaffModalOpen(true);
  }, []);

  const handleEdit = useCallback((staff: BarbershopStaff) => {
    setStaffModalMode("edit");
    setSelectedStaffId(staff.id);
    setIsStaffModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback((staff: BarbershopStaff) => {
    setSelectedStaff(staff);
    setIsToggleStatusModalOpen(true);
  }, []);

  const handleConfirmToggleStatus = useCallback(async () => {
    if (!selectedStaff) return;

    await toggleStaffStatus(selectedStaff.id);
    setIsToggleStatusModalOpen(false);
    setSelectedStaff(null);
  }, [selectedStaff, toggleStaffStatus]);

  // 🎯 lastUpdated estável que só muda quando dados são realmente carregados
  const [lastUpdated, setLastUpdated] = useState(() =>
    new Date().toLocaleTimeString("pt-BR"),
  );
  const previousLoadingRef = useRef(isLoading);

  // 🔥 OPTIMIZATION: Memoize the update function to prevent unnecessary re-renders
  const updateLastUpdated = useCallback(() => {
    setLastUpdated(new Date().toLocaleTimeString("pt-BR"));
  }, []);

  // Atualizar lastUpdated apenas quando sai do loading (dados foram efetivamente carregados)
  useEffect(() => {
    const wasLoading = previousLoadingRef.current;
    const isCurrentlyLoading = isLoading;

    // Só atualizar quando estava loading e agora não está mais (dados carregados)
    if (wasLoading && !isCurrentlyLoading) {
      updateLastUpdated();
    }

    previousLoadingRef.current = isCurrentlyLoading;
  }, [isLoading, updateLastUpdated]); // 🔥 Add updateLastUpdated to dependencies

  return (
    <>
      <div className="flex flex-col gap-5 rounded-xl bg-neutral-900 p-5 lg:p-6">
        <BarbershopStaffPageHeader
          totalCount={pagination?.total || 0}
          statistics={statistics}
          lastUpdated={lastUpdated}
          onCreateClick={handleCreate}
        />
        <Divider className="my-1" />
        <BarbershopStaffPageContent
          staff={staff}
          pagination={pagination}
          isLoading={isLoading}
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          refetch={refetch}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          bulkSelection={bulkSelection}
        />
      </div>

      {/* 🎯 Barra de ações em lote (FASE 3 - completa com CSV) */}
      <BulkActionsBar
        selectedCount={bulkSelection.selectedCount}
        selectedIds={bulkSelection.selectedIds}
        onClearSelection={bulkSelection.clearSelection}
        onActivate={bulkActions.activateStaff}
        onDeactivate={bulkActions.deactivateStaff}
        onDownloadCSV={handleExportCSV}
        isActivating={bulkActions.isActivating}
        isDeactivating={bulkActions.isDeactivating}
        isExportingCSV={bulkActions.isExportingCSV}
        isLimitReached={bulkSelection.isLimitReached}
        maxLimit={bulkSelection.maxLimit}
        totalRecords={pagination?.total}
        isAllPagesSelected={bulkSelection.isAllPagesSelected}
        onToggleAllPages={handleSelectAllPages}
        isLoadingAllPages={isLoadingAllPages}
      />

      {/* Modal unificada para criar/visualizar/editar colaborador */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => {
          setIsStaffModalOpen(false);
          setSelectedStaffId(null);
        }}
        mode={staffModalMode}
        staffId={selectedStaffId}
      />

      {/* Modal de confirmação para inativar/ativar colaborador */}
      <StaffStatusModal
        isOpen={isToggleStatusModalOpen}
        onClose={() => {
          setIsToggleStatusModalOpen(false);
          setSelectedStaff(null);
        }}
        onConfirm={handleConfirmToggleStatus}
        staff={selectedStaff}
      />
    </>
  );
}
