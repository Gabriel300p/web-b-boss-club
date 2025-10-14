/**
 * 🎯 Multi-Select Component
 * Allows selecting multiple items from a list with search/filter capability
 * Built with Popover + Checkbox (shadcn/ui pattern)
 */
import { BadgeWithoutDot } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayed?: number; // Quantos badges mostrar antes de "+N"
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Selecione...",
  emptyMessage = "Nenhuma opção encontrada",
  disabled = false,
  className,
  maxDisplayed = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOptions = React.useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  );

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange?.(newValue);
  };

  const handleRemove = (valueToRemove: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange?.(value.filter((v) => v !== valueToRemove));
  };

  const displayedBadges = selectedOptions.slice(0, maxDisplayed);
  const remainingCount = selectedOptions.length - maxDisplayed;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-neutral-800 bg-neutral-900/50 px-3 text-neutral-50 hover:bg-neutral-800 disabled:opacity-60",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-neutral-500">{placeholder}</span>
            ) : (
              <>
                {displayedBadges.map((option) => (
                  <BadgeWithoutDot
                    key={option.value}
                    variant="neutral"
                    className="mr-1 bg-neutral-700 text-neutral-100"
                  >
                    {option.label}
                    <button
                      className="ring-offset-background ml-1 rounded-full outline-none hover:bg-neutral-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(
                            option.value,
                            e as unknown as React.MouseEvent,
                          );
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => handleRemove(option.value, e)}
                    >
                      <X className="h-3 w-3 text-neutral-400 hover:text-neutral-200" />
                    </button>
                  </BadgeWithoutDot>
                ))}
                {remainingCount > 0 && (
                  <BadgeWithoutDot
                    variant="neutral"
                    className="bg-neutral-700 text-neutral-100"
                  >
                    +{remainingCount}
                  </BadgeWithoutDot>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] border-neutral-700 bg-neutral-900 p-0"
        align="start"
      >
        <div className="flex flex-col gap-2 p-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-600 focus:outline-none"
            />
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-neutral-400">
                {emptyMessage}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggle(option.value)}
                      disabled={option.disabled}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-neutral-100 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(option.value)}
                        className="pointer-events-none"
                      />
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
