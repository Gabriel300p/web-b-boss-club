/**
 * 🤏 DragHandle Component
 * Accessible drag handle for sortable items
 */

import { DotsSixVertical } from "@phosphor-icons/react";
import { forwardRef } from "react";

import { cn } from "@/shared/lib/utils";

interface DragHandleProps {
  className?: string;
  isDragging?: boolean;
}

export const DragHandle = forwardRef<HTMLDivElement, DragHandleProps>(
  ({ className, isDragging = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex cursor-grab items-center justify-center rounded p-1 text-neutral-400 transition-all duration-200 hover:bg-neutral-700/50 hover:text-neutral-200 focus:bg-neutral-700/50 focus:text-neutral-200 focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-1 focus:ring-offset-neutral-900 focus:outline-none active:cursor-grabbing",
          isDragging && "cursor-grabbing bg-amber-400/10 text-amber-400",
          className,
        )}
        aria-label="Arrastar para reordenar"
        tabIndex={0}
        role="button"
        {...props}
      >
        <DotsSixVertical className="h-4 w-4" weight="bold" />
      </div>
    );
  },
);

DragHandle.displayName = "DragHandle";
