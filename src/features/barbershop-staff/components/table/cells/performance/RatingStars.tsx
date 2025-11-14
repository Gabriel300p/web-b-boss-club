/**
 * 🌟 RatingStars Component
 * Displays star rating with half-stars support and optional review count
 */
import { cn } from "@shared/lib/utils";
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number | null;
  reviewCount?: number;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: RatingStarsProps) {
  // Se não tem rating, mostra mensagem
  if (rating === null || rating === undefined) {
    return (
      <span className={cn("text-muted-foreground text-sm", className)}>
        Sem avaliações
      </span>
    );
  }

  const roundedRating = Math.round(rating * 10) / 10; // Arredonda para 1 casa decimal
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;

  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-sm" : "text-sm";

  const renderStar = (position: number) => {
    if (position <= fullStars) {
      // Estrela cheia
      return (
        <Star
          key={position}
          className={cn(starSize, "fill-yellow-400 text-yellow-400")}
        />
      );
    } else if (position === fullStars + 1 && hasHalfStar) {
      // Meia estrela
      return (
        <StarHalf
          key={position}
          className={cn(starSize, "fill-yellow-400 text-yellow-400")}
        />
      );
    } else {
      // Estrela vazia
      return (
        <Star
          key={position}
          className={cn(starSize, "fill-neutral-700 text-neutral-700")}
        />
      );
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {/* Stars with half-star support */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((position) => renderStar(position))}
      </div>

      {/* Rating value and count */}
      <div className="flex items-center gap-1">
        <span className={cn("font-medium text-neutral-100", textSize)}>
          {roundedRating.toFixed(1)}
        </span>
        {showCount && reviewCount !== undefined && reviewCount > 0 && (
          <span className={cn("text-muted-foreground", textSize)}>
            ({reviewCount})
          </span>
        )}
      </div>
    </div>
  );
}
