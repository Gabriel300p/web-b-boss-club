/**
 * 📊 PerformanceCell Component
 * Displays attendance count and rating in a compact, elegant cell
 */
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { cn } from "@shared/lib/utils";
import { Calendar } from "lucide-react";
import { ProportionalStar } from "./ProportionalStar";

interface PerformanceCellProps {
  totalAttendances: number;
  averageRating: number | null;
  reviewCount?: number;
  className?: string;
}

export function PerformanceCell({
  totalAttendances,
  averageRating,
  reviewCount = 0,
  className,
}: PerformanceCellProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Rating with proportional star */}
      <div className="flex items-center gap-1.5">
        <ProportionalStar
          rating={averageRating}
          reviewCount={reviewCount}
          size="sm"
          showTooltip={true}
        />
        {averageRating !== null && (
          <span className="text-sm font-medium text-neutral-100">
            {averageRating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Attendances with subtle icon and tooltip */}
      {totalAttendances > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex cursor-help items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-300">
              <Calendar className="h-3 w-3" />
              <span>{totalAttendances}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Total de atendimentos realizados</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
