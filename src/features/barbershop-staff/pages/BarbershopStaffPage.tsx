import { Divider } from "@/shared/components/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { useStableStaffManagement } from "../hooks/useStableStaffManagement";
import { BarbershopStaffPageContent } from "./sections/BarbershopStaffPageContent";
import { BarbershopStaffPageHeader } from "./sections/BarbershopStaffPageHeader";

export function BarbershopStaffPage() {
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
    <div className="m-5 flex flex-col gap-5 rounded-xl bg-neutral-900 p-6">
      <BarbershopStaffPageHeader
        totalCount={pagination?.total || 0}
        statistics={statistics}
        lastUpdated={lastUpdated}
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
      />
    </div>
  );
}
