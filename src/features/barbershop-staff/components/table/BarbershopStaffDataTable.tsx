import { Pagination } from "@/shared/components/ui";
import { OptimizedTable } from "@shared/components/ui/OptimizedTable";

import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface BarbershopStaffDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPaginationChange?: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  // 🎯 Bulk selection props
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean;
}

function BarbershopStaffDataTableComponent<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  onPageSizeChange,
  rowSelection: externalRowSelection,
  onRowSelectionChange,
  enableRowSelection = false,
}: BarbershopStaffDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});

  // Use external or internal row selection state
  const finalRowSelection = externalRowSelection ?? internalRowSelection;

  const table = useReactTable({
    data,
    columns,
    // 🎯 CRÍTICO: Define como obter o ID único de cada linha
    getRowId: (row: TData) => {
      const record = row as Record<string, unknown>;
      const id = String(record.id);
      return id;
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    enableRowSelection: enableRowSelection ? true : false,
    // 🔥 CRITICAL: Não resetar seleção automaticamente
    autoResetAll: false,
    autoResetPageIndex: false,
    // Server-side pagination
    manualPagination: true,
    pageCount: pagination?.total_pages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: finalRowSelection,
      pagination: {
        pageIndex: (pagination?.page ?? 1) - 1, // TanStack uses 0-based index
        pageSize: pagination?.limit ?? 10,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      <OptimizedTable table={table} enableAnimations={data.length <= 50} />
      <Pagination
        table={table}
        totalItems={pagination?.total}
        onPageChange={onPaginationChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export const BarbershopStaffDataTable =
  BarbershopStaffDataTableComponent as typeof BarbershopStaffDataTableComponent;
