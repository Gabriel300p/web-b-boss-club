/**
 * ⭐ ProportionalStar Component
 * Displays a single star with proportional fill based on rating (0-5)
 * Uses CSS clip-path for smooth gradient-like fill effect
 */
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { cn } from "@shared/lib/utils";
import { Star } from "lucide-react";

interface ProportionalStarProps {
  rating: number | null;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

export function ProportionalStar({
  rating,
  reviewCount = 0,
  size = "md",
  className,
  showTooltip = false,
}: ProportionalStarProps) {
  // Se não tem rating, mostra estrela vazia
  if (rating === null || rating === undefined) {
    const starContent = (
      <div className={cn("relative inline-flex items-center", className)}>
        <svg
          className={cn(
            "text-neutral-700",
            size === "sm" && "h-4 w-4",
            size === "md" && "h-5 w-5",
            size === "lg" && "h-6 w-6",
          )}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
    );

    if (!showTooltip) return starContent;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{starContent}</TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-neutral-400">Sem avaliações</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 text-neutral-700" />
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Calcula a porcentagem de preenchimento (0-100%)
  // Rating vai de 0 a 5, então dividimos por 5 e multiplicamos por 100
  const fillPercentage = Math.min(100, Math.max(0, (rating / 5) * 100));

  const starSize =
    size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6";

  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 > 0;

  const starContent = (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Background star (empty/gray) */}
      <svg
        className={cn("absolute text-neutral-700", starSize)}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>

      {/* Foreground star (filled/yellow) with clip-path for proportional fill */}
      <svg
        className={cn("relative text-yellow-400", starSize)}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
        }}
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>

      {/* Optional stroke for definition */}
      <svg
        className={cn(
          "pointer-events-none absolute text-yellow-500/30",
          starSize,
        )}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  if (!showTooltip) return starContent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{starContent}</TooltipTrigger>
      <TooltipContent side="top">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-100">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-400">
              ({reviewCount} {reviewCount === 1 ? "avaliação" : "avaliações"})
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => {
              if (i <= fullStars) {
                return (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                );
              } else if (i === fullStars + 1 && hasPartialStar) {
                return (
                  <div key={i} className="relative">
                    <Star className="h-4 w-4 text-neutral-700" />
                    <Star
                      className="absolute top-0 left-0 h-4 w-4 fill-yellow-400 text-yellow-400"
                      style={{
                        clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                      }}
                    />
                  </div>
                );
              } else {
                return <Star key={i} className="h-4 w-4 text-neutral-700" />;
              }
            })}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
