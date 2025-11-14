/**
 * 🛠️ Table Settings Utilities
 * Helper functions for integrating TableSettings with existing tables
 */

import type { ColumnDef } from "@tanstack/react-table";
import type { TableSettingsConfig } from "@shared/types/table.types";

/**
 * Applies table settings (order and visibility) to column definitions
 * @param columns - Original column definitions
 * @param settings - Table settings with order and visibility
 * @returns Filtered and reordered column definitions
 */
export function applyTableSettings<T>(
  columns: ColumnDef<T>[],
  settings?: TableSettingsConfig,
): ColumnDef<T>[] {
  if (!settings) return columns;

  // Filter visible columns
  const visibleColumns = columns.filter((col) => {
    return settings.visibility[col.id!] !== false;
  });

  // Reorder columns
  const orderedColumns = settings.order
    .map((columnId) => visibleColumns.find((col) => col.id === columnId))
    .filter((col): col is ColumnDef<T> => col !== undefined);

  // Add unordered columns (new columns not in settings)
  const unorderedColumns = visibleColumns.filter(
    (col) => !settings.order.includes(col.id!),
  );

  return [...orderedColumns, ...unorderedColumns];
}

/**
 * Creates a column visibility state for TanStack Table from table settings
 * @param settings - Table settings
 * @returns Column visibility state object
 */
export function createColumnVisibilityState(
  settings?: TableSettingsConfig,
): Record<string, boolean> {
  if (!settings) return {};
  
  return Object.fromEntries(
    Object.entries(settings.visibility).map(([columnId, visible]) => [
      columnId,
      visible,
    ]),
  );
}

/**
 * Converts TanStack Table column visibility state to table settings format
 * @param columnVisibility - TanStack Table column visibility state
 * @returns Visibility settings object
 */
export function convertColumnVisibilityToSettings(
  columnVisibility: Record<string, boolean>,
): Record<string, boolean> {
  return { ...columnVisibility };
}
