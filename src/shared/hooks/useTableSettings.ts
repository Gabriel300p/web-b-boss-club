/**
 * 🎛️ useTableSettings Hook
 * Manages table configuration with localStorage persistence
 */

import type {
  TableColumn,
  TableSettings,
  TableSettingsConfig,
  UseTableSettingsReturn,
} from "@shared/types/table.types";
import { useCallback, useMemo, useState } from "react";

const STORAGE_PREFIX = "table-settings";

export const useTableSettings = (
  tableId: string,
  columnsFromApi: TableColumn[],
): UseTableSettingsReturn => {
  // Generate storage key
  const storageKey = `${STORAGE_PREFIX}:${tableId}`;

  // Load settings from localStorage
  const loadSettings = useCallback((): TableSettings | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  // Create default settings based on API columns
  const createDefaultSettings = useCallback((): TableSettingsConfig => {
    const defaultOrder = columnsFromApi.map((col) => col.id);
    const defaultVisibility: Record<string, boolean> = {};

    columnsFromApi.forEach((col, index) => {
      // Use defaultVisible if provided, otherwise show first 5 columns
      if (col.defaultVisible !== undefined) {
        defaultVisibility[col.id] = col.defaultVisible;
      } else {
        defaultVisibility[col.id] = index < 5;
      }
    });

    return {
      order: defaultOrder,
      visibility: defaultVisibility,
    };
  }, [columnsFromApi]);

  // Initialize settings state
  const [settings, setSettings] = useState<TableSettingsConfig>(() => {
    const stored = loadSettings();
    const defaults = createDefaultSettings();

    if (!stored) {
      return defaults;
    }

    // Merge stored settings with defaults for new columns
    const mergedOrder = [
      ...stored.order.filter((id) =>
        columnsFromApi.some((col) => col.id === id),
      ),
      ...defaults.order.filter((id) => !stored.order.includes(id)),
    ];

    const mergedVisibility = {
      ...defaults.visibility,
      ...stored.visibility,
    };

    return {
      order: mergedOrder,
      visibility: mergedVisibility,
    };
  });

  // Apply order and visibility to columns
  const appliedColumns = useMemo((): TableColumn[] => {
    // Start with all columns from API
    const allColumns = [...columnsFromApi];

    // Create a map for quick lookup
    const columnMap = new Map(allColumns.map((col) => [col.id, col]));

    // Build ordered columns based on settings.order
    const orderedColumns: TableColumn[] = [];
    const usedIds = new Set<string>();

    // First, add columns in the order specified by settings.order
    for (const id of settings.order) {
      const column = columnMap.get(id);
      if (column) {
        orderedColumns.push(column);
        usedIds.add(id);
      }
    }

    // Then add any remaining columns that weren't in the order
    for (const column of allColumns) {
      if (!usedIds.has(column.id)) {
        orderedColumns.push(column);
      }
    }

    return orderedColumns;
  }, [settings.order, columnsFromApi]);

  // Update settings
  const updateSettings = useCallback(
    (newSettings: Partial<TableSettingsConfig>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [],
  );

  // Reset to defaults
  const resetSettings = useCallback(() => {
    const defaults = createDefaultSettings();
    setSettings(defaults);
    localStorage.removeItem(storageKey);
  }, [createDefaultSettings, storageKey]);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    const settingsToSave: TableSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(settingsToSave));
    } catch (error) {
      console.warn("Failed to save table settings:", error);
    }
  }, [settings, storageKey]);

  return {
    settings,
    appliedColumns,
    updateSettings,
    resetSettings,
    saveSettings,
  };
};
