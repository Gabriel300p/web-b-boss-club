/**
 * 🎯 TableSettings - Exports Centralizados
 * Ponto de entrada único para todos os componentes e utilitários do TableSettings
 */

// 🎨 Componentes principais
export { TableSettings } from "./TableSettings";
export { SortableItem } from "./SortableItem";

// 🎛️ Hooks
export { useTableSettings } from "@shared/hooks/useTableSettings";

// 🛠️ Utilitários
export {
  applyTableSettings,
  createColumnVisibilityState,
  convertColumnVisibilityToSettings,
} from "@shared/utils/table-settings.utils";

// 📝 Tipos TypeScript
export type {
  TableColumn,
  TableSettingsConfig,
  TableSettingsProps,
  UseTableSettingsReturn,
  DragEndEvent,
  SortableItemProps,
} from "@shared/types/table.types";
