import {
  AnimatedBox,
  AnimatedTableRow,
} from "@shared/components/animations/motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import type { Cell, Row, Table as TableType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { memo } from "react";

interface OptimizedTableProps<TData> {
  table: TableType<TData>;
  enableAnimations?: boolean;
}

// Memoized table row for performance
const TableRowMemo = memo(function TableRowMemo<TData>({
  row,
  index,
  enableAnimations = true,
}: {
  row: Row<TData>;
  index: number;
  enableAnimations?: boolean;
}) {
  if (enableAnimations) {
    return (
      <AnimatedTableRow
        index={index}
        className="border-b border-neutral-700/50 transition-colors hover:bg-neutral-800/30 data-[state=selected]:bg-neutral-800/50"
      >
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </AnimatedTableRow>
    );
  }

  return (
    <TableRow className="border-b border-neutral-700/50 transition-colors hover:bg-neutral-800/30 data-[state=selected]:bg-neutral-800/50">
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});

export function OptimizedTable<TData>({
  table,
  enableAnimations = true,
}: OptimizedTableProps<TData>) {
  const { rows } = table.getRowModel();

  return (
    <AnimatedBox
      variant="fadeIn"
      className="rounded-md border border-neutral-700"
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows?.length ? (
            rows.map((row, index) => (
              <TableRowMemo
                key={row.id}
                row={row}
                index={index}
                enableAnimations={enableAnimations}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </AnimatedBox>
  );
}
