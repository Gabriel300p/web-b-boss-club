import { Button } from "@shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<TData> {
  table: Table<TData>;
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;

  // Gerar array de páginas para mostrar na paginação
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas para mostrar antes e depois da atual
    const range = [];
    const rangeWithDots = [];

    // Para telas pequenas, limitar o número de páginas visíveis
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      // Se tem poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-row items-center justify-between space-x-4 pt-4">
      {/* Informações e seletor de items por página */}
      <div className="flex w-full flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-neutral-700 sm:text-sm dark:text-neutral-200">
            {totalItems}{" "}
            <span className="font-normal text-neutral-400 dark:text-neutral-500">
              itens
            </span>
          </p>
          <hr className="hidden h-4 border border-neutral-200 sm:block md:h-6 dark:border-neutral-700" />
          <div className="flex items-center space-x-2">
            <p className="hidden text-xs whitespace-nowrap text-neutral-600 sm:block sm:text-sm dark:text-neutral-300">
              Linhas por página
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="py-1 text-xs sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent
                side="top"
                className="dark:border-neutral-700 dark:bg-neutral-900"
              >
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem
                    key={size}
                    value={`${size}`}
                    className="dark:data-[state=checked]:bg-primary dark:text-neutral-200 dark:data-[state=checked]:text-white"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Navegação de páginas */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <span className="hidden text-center text-xs font-medium text-neutral-600 sm:block sm:text-left sm:text-sm dark:text-neutral-300">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            {/* Botão página anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 w-7 p-0 disabled:opacity-30 sm:h-8 sm:w-8 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>

            {/* Números das páginas */}
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {getVisiblePages().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={index}
                      className="hidden px-1 text-xs text-neutral-400 sm:inline sm:px-2 sm:text-sm dark:text-neutral-500"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    className={`h-7 w-7 p-0 text-xs sm:h-8 sm:w-8 sm:text-sm ${
                      isActive
                        ? "bg-primary dark:bg-primary text-white transition-opacity duration-300 hover:opacity-80 dark:text-black"
                        : "text-neutral-600 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Botão próxima página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 w-7 p-0 disabled:opacity-30 sm:h-8 sm:w-8 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
