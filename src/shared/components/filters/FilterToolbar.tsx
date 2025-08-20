import { Button } from "@shared/components/ui/button";
import { Separator } from "@shared/components/ui/separator";
import { cn } from "@shared/lib/utils";
import { RotateCcwIcon } from "lucide-react";
import * as React from "react";

interface FilterToolbarProps {
  children: React.ReactNode;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function FilterToolbar({
  children,
  onReset,
  hasActiveFilters = false,
  className,
}: FilterToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}

      {hasActiveFilters && onReset && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 px-2 text-xs lg:px-3"
          >
            <RotateCcwIcon className="mr-1 h-3 w-3" />
            Limpar filtros
          </Button>
        </>
      )}
    </div>
  );
}
