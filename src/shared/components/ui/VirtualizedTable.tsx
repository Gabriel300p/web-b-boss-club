import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import type { Table as TableType } from "@tanstack/react-table";
import { motion } from "framer-motion";

interface VirtualizedTableProps<TData> {
  table: TableType<TData>;
}

export function VirtualizedTable<TData>({
  table,
}: VirtualizedTableProps<TData>) {
  const { rows } = table.getRowModel();
  // const visibleColumns = table.getVisibleFlatColumns(); // Removed unused variable

  // Don't virtualize if we have less than 20 rows for better UX
  if (rows.length < 20) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header({
                            column: header.column,
                            header,
                            table,
                          })
                        : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-muted/50 border-b transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.getValue() as React.ReactNode}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Virtualization disabled (future optimization). For >=20 rows, return null or a placeholder.
  return null;
}
