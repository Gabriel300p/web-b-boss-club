import type { RowSelectionState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BarbershopStaff } from "../schemas/barbershop-staff.schemas";

// 🎯 Limite máximo de seleção para "selecionar todos"
const MAX_SELECTION_LIMIT = 500;

interface UseBulkSelectionProps {
  data: BarbershopStaff[];
  totalRecords?: number;
}

export interface UseBulkSelectionReturn {
  // TanStack Table compatible
  rowSelection: RowSelectionState;
  setRowSelection: (
    updater:
      | RowSelectionState
      | ((old: RowSelectionState) => RowSelectionState),
  ) => void;

  // Helper functions
  selectedIds: string[];
  selectedCount: number;
  isAllSelected: boolean;
  isLimitReached: boolean;
  maxLimit: number;
  clearSelection: () => void;
  selectAllPages: (ids: string[]) => void;
  isAllPagesSelected: boolean;
  totalRecords?: number;
}

/**
 * 🎯 Hook para gerenciar seleção em lote usando TanStack Table
 *
 * Features:
 * - Compatível com rowSelection do TanStack Table
 * - Seleção individual via checkbox (gerenciado pelo TanStack Table)
 * - Select all (página atual via TanStack Table)
 * - Select all pages (até 500 registros)
 * - Estado otimizado e re-renders corretos
 */
export function useBulkSelection({
  data,
  totalRecords,
}: UseBulkSelectionProps): UseBulkSelectionReturn {
  // 🎯 Estado do TanStack Table: { [id]: boolean }
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isAllPagesSelected, setIsAllPagesSelected] = useState(false);

  // 🔍 DEBUG: Log state changes
  useEffect(() => {
    console.log("📊 rowSelection state:", rowSelection);
    console.log(
      "📊 Selected IDs:",
      Object.keys(rowSelection).filter((id) => rowSelection[id]),
    );
  }, [rowSelection]);

  // 🎯 CRÍTICO: Wrapper para aceitar updater function do TanStack Table
  const handleRowSelectionChange = useCallback(
    (
      updater:
        | RowSelectionState
        | ((old: RowSelectionState) => RowSelectionState),
    ) => {
      console.log("🔄 handleRowSelectionChange called with:", updater);
      setRowSelection(updater);
    },
    [],
  );

  // 🎯 Computed values
  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );

  const selectedCount = selectedIds.length;

  const isAllSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.every((staff) => rowSelection[staff.id] === true);
  }, [data, rowSelection]);

  const isLimitReached = selectedCount >= MAX_SELECTION_LIMIT;

  // 🎯 Limpar todas as seleções
  const clearSelection = useCallback(() => {
    setRowSelection({});
    setIsAllPagesSelected(false);
  }, []);

  // 🎯 Selecionar todos de todas as páginas
  const selectAllPages = useCallback((allIds: string[]) => {
    const idsToSelect = allIds.slice(0, MAX_SELECTION_LIMIT);
    const newSelection: RowSelectionState = {};
    idsToSelect.forEach((id) => {
      newSelection[id] = true;
    });
    setRowSelection(newSelection);
    setIsAllPagesSelected(true);
  }, []);

  // Resetar isAllPagesSelected quando limpar seleção
  useEffect(() => {
    if (selectedCount === 0) {
      setIsAllPagesSelected(false);
    }
  }, [selectedCount]);

  return {
    rowSelection,
    setRowSelection: handleRowSelectionChange,
    selectedIds,
    selectedCount,
    isAllSelected,
    isLimitReached,
    maxLimit: MAX_SELECTION_LIMIT,
    clearSelection,
    selectAllPages,
    isAllPagesSelected,
    totalRecords,
  };
}
