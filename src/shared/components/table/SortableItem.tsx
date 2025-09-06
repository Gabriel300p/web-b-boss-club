/**
 * 📋 SortableItem Component
 * Individual sortable column item with drag handle and visibility toggle
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lock } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@shared/components/ui/checkbox";
import { DragHandle } from "@shared/components/ui/drag-handle";
import type { SortableItemProps } from "@shared/types/table.types";

export const SortableItem = ({
  id,
  column,
  isVisible,
  onToggleVisibility,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id,
    disabled: column.fixed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleVisibility = () => {
    if (!column.fixed) {
      onToggleVisibility(column.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Support keyboard navigation for reordering
    if (e.ctrlKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      // Note: This would require additional logic in parent to handle keyboard reordering
      // For now, we focus on mouse/touch drag and drop
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border border-neutral-700/50 bg-neutral-800/50 p-3 transition-all duration-200 hover:border-neutral-600/70 hover:bg-neutral-700/50",
        isDragging && "scale-105 opacity-50 shadow-xl",
        column.fixed && "border-neutral-600/70 bg-neutral-900/50",
      )}
      onKeyDown={handleKeyDown}
    >
      {/* Drag Handle */}
      <DragHandle
        ref={setActivatorNodeRef}
        className={cn(column.fixed && "cursor-not-allowed opacity-50")}
        isDragging={isDragging}
        {...attributes}
        {...listeners}
      />

      {/* Visibility Checkbox */}
      <div className="flex items-center">
        <Checkbox
          id={`visibility-${column.id}`}
          checked={isVisible}
          onCheckedChange={handleToggleVisibility}
          disabled={column.fixed}
          aria-describedby={
            column.fixed ? `fixed-indicator-${column.id}` : undefined
          }
        />
      </div>

      {/* Column Label */}
      <div className="flex-1">
        <label
          htmlFor={`visibility-${column.id}`}
          className={cn(
            "cursor-pointer text-sm font-medium text-neutral-200 transition-colors hover:text-neutral-100",
            column.fixed && "text-neutral-400",
          )}
        >
          {column.label}
        </label>
      </div>

      {/* Fixed Column Indicator */}
      {column.fixed && (
        <div
          id={`fixed-indicator-${column.id}`}
          className="flex items-center text-neutral-500"
          title="Coluna fixa - não pode ser ocultada ou reordenada"
        >
          <Lock className="h-4 w-4" />
          <span className="sr-only">Coluna fixa</span>
        </div>
      )}
    </div>
  );
};
