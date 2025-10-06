import { Divider } from "@/shared/components/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { StaffModal } from "../components/dialogs/StaffModal";
import { ToggleStaffStatusModal } from "../components/dialogs/ToggleStaffStatusModal";
import { useBarbershopStaff } from "../hooks/useBarbershopStaff";
import { useStableStaffManagement } from "../hooks/useStableStaffManagement";
import type { BarbershopStaff } from "../schemas/barbershop-staff.schemas";
import { BarbershopStaffPageContent } from "./sections/BarbershopStaffPageContent";
import { BarbershopStaffPageHeader } from "./sections/BarbershopStaffPageHeader";

export function BarbershopStaffPage() {
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
  // 🛡️ Use hook estável que NÃO causa re-renders desnecessários
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
    onTableSettingsChange,
    tableSettings,
  } = useStableStaffManagement();

  // 🎯 Hook com ações (toggle status, etc)
  const { toggleStaffStatus } = useBarbershopStaff(filters);

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
      <div className="flex flex-col gap-5 rounded-xl bg-neutral-900 p-6">
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
          onTableSettingsChange={onTableSettingsChange}
          tableSettings={tableSettings}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      </div>

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
      <ToggleStaffStatusModal
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
