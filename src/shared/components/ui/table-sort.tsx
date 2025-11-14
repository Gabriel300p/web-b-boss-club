import type { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableSortProps<TData> {
  column: Column<TData, unknown>;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

const TableSort = <TData,>({
  column,
  children,
  align = "left",
  className,
}: TableSortProps<TData>) => {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const sortDirection = column.getIsSorted();

  const handleSort = (direction: "asc" | "desc") => {
    if (sortDirection === direction) {
      // Se já está na direção clicada, remove a ordenação
      column.clearSorting();
    } else {
      // Define a nova direção de ordenação
      column.toggleSorting(direction === "desc");
    }
  };

  return (
    <div
      className={`flex items-center gap-2 ${alignmentClasses[align]} w-full ${className}`}
    >
      <span className="select-none">{children}</span>
      <div className="flex flex-col items-center rounded-sm border border-neutral-600/50 bg-neutral-800/50">
        {/* Seta para cima (ASC) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSort("asc");
          }}
          className={`flex cursor-pointer items-center justify-center rounded-sm transition-all duration-200 hover:scale-110 ${
            sortDirection === "asc"
              ? "bg-yellow-900/30 text-yellow-400 shadow-sm"
              : "text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-300"
          }`}
          aria-label="Ordenar crescente"
          title="Ordenar crescente"
        >
          <ChevronUp className="-mb-0.5 h-3 w-3" />
        </button>

        {/* Seta para baixo (DESC) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSort("desc");
          }}
          className={`flex h-3 w-4 cursor-pointer items-center justify-center rounded-sm transition-all duration-200 hover:scale-110 ${
            sortDirection === "desc"
              ? "bg-yellow-900/30 text-yellow-400 shadow-sm"
              : "text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-300"
          }`}
          aria-label="Ordenar decrescente"
          title="Ordenar decrescente"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default TableSort;
