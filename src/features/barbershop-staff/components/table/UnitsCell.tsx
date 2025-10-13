/**
 * 🏢 UnitsCell Component
 * Displays barbershop units with popover details for multiple units
 */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { cn } from "@shared/lib/utils";
import { ChevronRight, MapPin } from "lucide-react";

interface Unit {
  id: string;
  name: string;
  city: string;
  state: string;
  is_primary: boolean;
}

interface UnitsCellProps {
  units: Unit[];
  className?: string;
}

export function UnitsCell({ units, className }: UnitsCellProps) {
  // Se não tem unidades
  if (!units || units.length === 0) {
    return (
      <span className={cn("text-muted-foreground text-xs", className)}>
        Sem unidade
      </span>
    );
  }

  // Se tem apenas 1 unidade
  if (units.length === 1) {
    const unit = units[0];
    return (
      <div
        className={cn("flex items-center justify-center gap-1.5", className)}
      >
        {unit.is_primary && (
          <MapPin className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        )}
        <span className="text-sm text-neutral-100">{unit.name}</span>
      </div>
    );
  }

  // Se tem múltiplas unidades
  const primaryUnit = units.find((u) => u.is_primary) || units[0];
  const otherUnitsCount = units.length - 1;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <span className="text-sm text-neutral-100">{primaryUnit.name}</span>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-0.5 text-xs font-semibold text-yellow-400 transition-colors hover:text-yellow-300"
            aria-label="Ver todas as unidades"
          >
            <span className="hidden sm:inline">+{otherUnitsCount}</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" side="right">
          <div className="space-y-2">
            <h4 className="mb-2 text-sm font-semibold text-neutral-100">
              Unidades ({units.length})
            </h4>
            <ul className="space-y-2">
              {units.map((unit) => (
                <li key={unit.id} className="flex items-start gap-2 text-sm">
                  {unit.is_primary ? (
                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <span className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-100">
                      {unit.name}
                      {unit.is_primary && (
                        <span className="ml-1.5 text-xs text-yellow-400">
                          (Principal)
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {unit.city}/{unit.state}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
