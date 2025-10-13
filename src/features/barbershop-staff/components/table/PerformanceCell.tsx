/**
 * 📊 PerformanceCell Component
 * Displays attendance count and rating in a compact cell
 */
import { BadgeWithoutDot } from "@shared/components/ui/badge";
import { cn } from "@shared/lib/utils";
import { ClipboardList } from "lucide-react";
import { RatingStars } from "./RatingStars";

interface PerformanceCellProps {
  totalAttendances: number;
  averageRating: number | null;
  className?: string;
}

export function PerformanceCell({
  totalAttendances,
  averageRating,
  className,
}: PerformanceCellProps) {
  const isTopPerformer = totalAttendances > 100;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Attendances row */}
      <div className="flex items-center gap-2">
        <ClipboardList className="text-muted-foreground h-3.5 w-3.5" />
        <span className="text-sm font-medium text-neutral-100">
          {totalAttendances}
        </span>
        {isTopPerformer && (
          <BadgeWithoutDot variant="success" size="sm">
            Top
          </BadgeWithoutDot>
        )}
      </div>

      {/* Rating row */}
      <RatingStars rating={averageRating} size="sm" showCount={false} />
    </div>
  );
}
