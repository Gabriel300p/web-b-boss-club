/**
 * 🏗️ Table Configuration Types
 * Types for table settings, column management and drag-and-drop functionality
 */

export interface TableColumn {
  id: string;
  label: string;
  defaultVisible?: boolean;
  fixed?: boolean;
}

export interface TableSettings {
  order: string[];
  visibility: Record<string, boolean>;
  updatedAt: string;
}

export interface TableSettingsConfig {
  order: string[];
  visibility: Record<string, boolean>;
}

export interface TableSettingsProps {
  tableId: string;
  columnsFromApi: TableColumn[];
  onChange: (settings: TableSettingsConfig) => void;
  className?: string;
}

export interface UseTableSettingsReturn {
  settings: TableSettingsConfig;
  appliedColumns: TableColumn[];
  updateSettings: (newSettings: Partial<TableSettingsConfig>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
}

// Drag and drop types
export interface DragEndEvent {
  active: { id: string };
  over: { id: string } | null;
}

export interface SortableItemProps {
  id: string;
  column: TableColumn;
  isVisible: boolean;
  onToggleVisibility: (columnId: string) => void;
  isDragging?: boolean;
}
