import { OptimizedTable } from "@shared/components/ui/OptimizedTable";
import { Pagination } from "@shared/components/ui/pagination";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// 🚀 Internal DataTable component for optimization
function DataTableComponent<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
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
      <Pagination table={table} />
    </div>
  );
}

// 🚀 Memoized export for performance optimization with proper typing
export const DataTable = DataTableComponent as typeof DataTableComponent;
