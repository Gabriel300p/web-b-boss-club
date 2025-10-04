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
  onPageSizeChange?: (limit: number) => void;
}

function BarbershopStaffDataTableComponent<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  onPageSizeChange,
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
      // Server-side pagination
      manualPagination: true,
      pageCount: pagination?.total_pages ?? -1,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination: {
          pageIndex: (pagination?.page ?? 1) - 1, // TanStack uses 0-based index
          pageSize: pagination?.limit ?? 10,
        },
      },
    }),
    [
      data,
      columns,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    ],
  );

  const table = useReactTable(tableConfig);

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
