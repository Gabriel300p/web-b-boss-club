/**
 * 🏢 UnitsCell Component
 * Displays barbershop units with popover details for multiple units
 * Features: Unit photo placeholders, star for primary unit, functional radio buttons
 */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { cn } from "@shared/lib/utils";
import { ChevronRight, Loader2, Star } from "lucide-react";
import { useUpdatePrimaryUnit } from "../../../hooks/useUpdatePrimaryUnit";

interface Unit {
  id: string;
  name: string;
  city: string;
  state: string;
  is_primary: boolean;
  logo_url?: string | null;
}

interface UnitsCellProps {
  staffId: string;
  units: Unit[];
  className?: string;
}

/**
 * Gera iniciais do nome da unidade para o placeholder
 * Ex: "Unidade Shopping" -> "US"
 */
// function getUnitInitials(name: string): string {
//   return name
//     .split(" ")
//     .slice(0, 2)
//     .map((word) => word[0])
//     .join("")
//     .toUpperCase();
// }

/**
 * Componente de foto da unidade (placeholder com iniciais)
 */
// function UnitPhoto({ unit, size = "sm" }: { unit: Unit; size?: "sm" | "md" }) {
//   const sizeClasses = {
//     sm: "h-6 w-6 text-xs",
//     md: "h-8 w-8 text-sm",
//   };

//   if (unit.logo_url) {
//     return (
//       <img
//         src={unit.logo_url}
//         alt={unit.name}
//         className={cn("rounded-full object-cover", sizeClasses[size])}
//       />
//     );
//   }

//   // Placeholder com iniciais
//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center rounded-full bg-neutral-700 font-semibold text-neutral-300",
//         sizeClasses[size],
//       )}
//     >
//       {getUnitInitials(unit.name)}
//     </div>
//   );
// }

export function UnitsCell({ staffId, units, className }: UnitsCellProps) {
  const { mutate: updatePrimaryUnit, isPending } = useUpdatePrimaryUnit();

  // Handler para mudança de unidade principal
  const handleUnitChange = (unitId: string) => {
    if (isPending) return; // Evita múltiplos cliques durante loading

    updatePrimaryUnit({
      staffId,
      primaryUnitId: unitId,
    });
  };

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
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {/* <UnitPhoto unit={unit} size="sm" /> */}
        <span className="text-sm text-neutral-100">{unit.name}</span>
        {unit.is_primary && (
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        )}
      </div>
    );
  }

  // Se tem múltiplas unidades
  const primaryUnit = units.find((u) => u.is_primary) || units[0];
  const otherUnitsCount = units.length - 1;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* <UnitPhoto unit={primaryUnit} size="sm" /> */}
      <span className="text-sm text-neutral-100">{primaryUnit.name}</span>
      {/* {primaryUnit.is_primary && (
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      )} */}

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-0.5 text-xs font-semibold text-yellow-400 transition-colors hover:text-yellow-300"
            aria-label="Ver todas as unidades"
          >
            <span>+{otherUnitsCount}</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="right">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-100">
              Unidades ({units.length})
            </h4>
            <ul className="space-y-3">
              {units.map((unit) => (
                <li
                  key={unit.id}
                  className="flex items-start gap-3 rounded-md border border-neutral-800 bg-neutral-900/50 p-3 transition-colors hover:border-neutral-700"
                >
                  {/* Radio button - FUNCIONAL */}
                  <button
                    type="button"
                    onClick={() => handleUnitChange(unit.id)}
                    disabled={isPending || unit.is_primary}
                    className={cn(
                      "mt-0.5 flex-shrink-0 transition-opacity",
                      isPending && "cursor-not-allowed opacity-50",
                      !unit.is_primary && "cursor-pointer hover:opacity-80",
                    )}
                    aria-label={
                      unit.is_primary
                        ? "Unidade principal atual"
                        : "Definir como unidade principal"
                    }
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                    ) : unit.is_primary ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-yellow-400">
                        <div className="h-2 w-2 rounded-full bg-yellow-400" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-neutral-600" />
                    )}
                  </button>

                  {/* Foto da unidade */}
                  {/* <UnitPhoto unit={unit} size="md" /> */}

                  {/* Informações da unidade */}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-100">
                        {unit.name}
                      </span>
                      {unit.is_primary && (
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <span className="text-xs text-neutral-400">
                      {unit.city}/{unit.state}
                    </span>
                    {unit.is_primary && (
                      <span className="text-xs font-medium text-yellow-400">
                        Unidade principal
                      </span>
                    )}
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
