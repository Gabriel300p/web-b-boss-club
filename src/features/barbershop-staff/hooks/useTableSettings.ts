/**
 * 🎛️ Table Settings Hook
 * Gerencia configurações de colunas da tabela de staff
 */

import { useTableSettings as useSharedTableSettings } from "@shared/hooks/useTableSettings";
import type { TableSettingsConfig } from "@shared/types/table.types";
import { useCallback, useMemo } from "react";

const TABLE_ID = "barbershop-staff";

export function useTableSettings() {
  const {
    settings,
    appliedColumns,
    updateSettings,
    resetSettings,
    saveSettings,
  } = useSharedTableSettings(TABLE_ID, []);

  // 🎯 Handler para mudanças nas configurações
  const handleTableSettingsChange = useCallback(
    (newSettings: TableSettingsConfig) => {
      updateSettings(newSettings);
      saveSettings();
    },
    [updateSettings, saveSettings],
  );

  // 🎯 Configurações memoizadas para evitar re-renders
  const tableSettings = useMemo(
    () => ({
      settings,
      appliedColumns,
      onTableSettingsChange: handleTableSettingsChange,
      resetSettings,
    }),
    [settings, appliedColumns, handleTableSettingsChange, resetSettings],
  );

  return tableSettings;
}
