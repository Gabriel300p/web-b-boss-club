import { Pagination } from "@/shared/components/ui";
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

function BarbershopStaffDataTableComponent<TData, TValue>({
  columns,
  data,
}: BarbershopStaffDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
      <OptimizedTable table={table} enableAnimations={data.length <= 50} />

      <Pagination table={table} />
    </div>
  );
}

export const BarbershopStaffDataTable =
  BarbershopStaffDataTableComponent as typeof BarbershopStaffDataTableComponent;
