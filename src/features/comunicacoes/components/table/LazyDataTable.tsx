import type { ColumnDef } from "@tanstack/react-table";
import { lazy, type ComponentType } from "react";

// 🚀 Lazy-loaded DataTable with proper typing
const LazyDataTableComponent = lazy(() =>
  import("./DataTable").then((module) => ({
    default: module.DataTable,
  })),
);

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Type-safe wrapper for lazy DataTable with proper generics
export const LazyDataTable = LazyDataTableComponent as ComponentType<
  DataTableProps<unknown, unknown>
>;
