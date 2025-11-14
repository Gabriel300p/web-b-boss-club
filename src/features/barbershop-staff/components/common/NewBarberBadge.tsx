/**
 * 🆕 NewBarberBadge Component
 * Badge para indicar barbeiros em período de rampa (< 90 dias)
 */
import { cn } from "@shared/lib/utils";

interface NewBarberBadgeProps {
  daysWorking: number;
  className?: string;
}

export function NewBarberBadge({
  daysWorking,
  className,
}: NewBarberBadgeProps) {
  // Só mostra se está no período de rampa (< 90 dias)
  if (daysWorking > 90) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
        className,
      )}
    >
      <span className="text-sm">🆕</span>
      <span className="tracking-wide uppercase">Novo ({daysWorking}d)</span>
    </div>
  );
}
