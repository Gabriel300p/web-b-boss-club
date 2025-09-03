// 🚀 BarbershopStaffDataTable - Optimized data table component for Barbershop Staff feature
import { OptimizedTable } from "@shared/components/ui/OptimizedTable";

import type {
  ColumnDef,
  ColumnFiltersState,
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
import { useMemo, useState } from "react";

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
}

// 🚀 Internal BarbershopStaffDataTable component for optimization
function BarbershopStaffDataTableComponent<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
}: BarbershopStaffDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // 🚀 Memoize table configuration to prevent unnecessary re-creations
  const tableConfig = useMemo(
    () => ({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    }),
    [data, columns, sorting, columnFilters, columnVisibility, rowSelection],
  );

  const table = useReactTable(tableConfig);

  return (
    <div className="w-full space-y-4">
      <OptimizedTable
        table={table}
        enableAnimations={data.length <= 50} // Disable animations for large datasets
      />

      {/* External pagination */}
      {pagination && onPaginationChange && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} funcionários
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPaginationChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="hover:bg-accent rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm">
              Página {pagination.page} de {pagination.total_pages}
            </span>

            <button
              onClick={() => onPaginationChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
              className="hover:bg-accent rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🚀 Memoized export for performance optimization with proper typing
export const BarbershopStaffDataTable =
  BarbershopStaffDataTableComponent as typeof BarbershopStaffDataTableComponent;
