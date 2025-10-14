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
import type { Table as TableType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

interface OptimizedTableProps<TData> {
  table: TableType<TData>;
  enableAnimations?: boolean;
}

export function OptimizedTable<TData>({
  table,
  enableAnimations = true,
}: OptimizedTableProps<TData>) {
  const { rows } = table.getRowModel();

  return (
    <AnimatedBox variant="fadeIn" className="rounded-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers
                .filter((header) => header.column.getIsVisible())
                .map((header) => (
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
            rows.map((row, index) => {
              const RowComponent = enableAnimations
                ? AnimatedTableRow
                : TableRow;
              return (
                <RowComponent
                  key={row.id}
                  index={index}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-neutral-700/50 transition-colors hover:bg-neutral-800/30 data-[state=selected]:bg-neutral-800/50"
                >
                  {row
                    .getVisibleCells()
                    .filter((cell) => cell.column.getIsVisible())
                    .map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                </RowComponent>
              );
            })
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
