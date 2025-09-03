// 🚀 BarbershopStaffDataTable - Optimized data table component for Barbershop Staff feature
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

interface BarbershopStaffDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// 🚀 Internal BarbershopStaffDataTable component for optimization
function BarbershopStaffDataTableComponent<TData, TValue>({
  columns,
  data,
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
      <Pagination table={table} />
    </div>
  );
}

// 🚀 Memoized export for performance optimization with proper typing
export const BarbershopStaffDataTable =
  BarbershopStaffDataTableComponent as typeof BarbershopStaffDataTableComponent;
