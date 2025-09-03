import {
  MicroInteraction,
  StaggeredItem,
  StaggeredList,
} from "@shared/animations";
import { Badge, BadgeWithoutDot } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { Separator } from "@shared/components/ui/separator";
import type { Column } from "@tanstack/react-table";
import * as React from "react";

export interface FilterOption {
  label: string;
  value: string | boolean;
  icon?: React.ReactNode;
  count?: number;
  isBooleanFilter?: boolean;
}

interface FilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FilterOption[];
  icon?: React.ReactNode;
  placeholder?: string;
  value?: (string | boolean)[];
  onChange?: (values: (string | boolean)[]) => void;
  animated?: boolean;
}

const ANIMATION_CONFIG = {
  staggerDelay: 0.05,
  duration: 0.2,
} as const;

export const Filter = React.memo(
  <TData, TValue>({
    column,
    title,
    options,
    icon,
    placeholder,
    value: externalValue,
    onChange: externalOnChange,
    animated = true,
  }: FilterProps<TData, TValue>) => {
    const facets = column?.getFacetedUniqueValues();
    const columnFilterValue = column?.getFilterValue();

    const selectedValues = React.useMemo(() => {
      if (externalValue !== undefined) {
        return new Set(externalValue);
      }

      if (Array.isArray(columnFilterValue)) {
        return new Set(columnFilterValue as (string | boolean)[]);
      }

      if (columnFilterValue !== undefined) {
        return new Set([columnFilterValue] as (string | boolean)[]);
      }

      return new Set();
    }, [columnFilterValue, externalValue]);

    const isBooleanFilter = options.some((option) => option.isBooleanFilter);

    // 🎯 Handle option selection with proper event handling
    const handleOptionSelect = React.useCallback(
      (option: FilterOption) => {
        if (isBooleanFilter) {
          if (externalOnChange) {
            externalOnChange([option.value]);
          } else {
            column?.setFilterValue(option.value);
          }
        } else {
          const newSelectedValues = new Set(selectedValues);
          const isSelected = selectedValues.has(option.value);

          if (isSelected) {
            newSelectedValues.delete(option.value);
          } else {
            newSelectedValues.add(option.value);
          }

          const filterValues = Array.from(newSelectedValues);

          if (externalOnChange) {
            externalOnChange(filterValues as (string | boolean)[]);
          } else {
            column?.setFilterValue(
              filterValues.length ? filterValues : undefined,
            );
          }
        }
      },
      [isBooleanFilter, externalOnChange, column, selectedValues],
    );

    // 🎯 Handle clear filter
    const handleClearFilter = React.useCallback(() => {
      if (externalOnChange) {
        externalOnChange([]);
      } else {
        column?.setFilterValue(undefined);
      }
    }, [externalOnChange, column]);

    // 🎯 Memoized options rendering for better performance
    const renderedOptions = React.useMemo(() => {
      return options.map((option) => {
        const isSelected = selectedValues.has(option.value);
        const count = option.count || facets?.get(option.value) || 0;

        return (
          <StaggeredItem
            key={option.value.toString()}
            variant="slideIn"
            disabled={!animated}
          >
            <CommandItem
              className="hover:bg-accent/80 flex cursor-pointer items-center gap-2 transition-colors select-auto"
              onSelect={() => handleOptionSelect(option)}
              style={{ userSelect: "auto", pointerEvents: "auto" }}
            >
              <MicroInteraction
                variant="buttonHover"
                disabled={!animated}
                className="mt-1"
              >
                <Checkbox checked={isSelected} />
              </MicroInteraction>
              <div className="flex items-center gap-1.5">
                {option.icon}
                <span>{option.label}</span>
              </div>
              {count > 0 && (
                <span className="ml-auto flex h-4 w-4 items-center justify-center text-xs">
                  {count}
                </span>
              )}
            </CommandItem>
          </StaggeredItem>
        );
      });
    }, [options, selectedValues, facets, animated, handleOptionSelect]);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <MicroInteraction variant="buttonHover" disabled={!animated}>
            <Button variant="outline" size="md">
              {icon}
              {title}
              {selectedValues.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-0.5 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedValues.size}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedValues.size > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {selectedValues.size} selecionados
                      </Badge>
                    ) : (
                      options
                        .filter((option) => selectedValues.has(option.value))
                        .map((option) => (
                          <BadgeWithoutDot
                            key={option.value.toString()}
                            variant="secondary"
                            className="rounded-sm px-1 font-normal"
                          >
                            {option.label}
                          </BadgeWithoutDot>
                        ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </MicroInteraction>
        </PopoverTrigger>
        <PopoverContent className="w-fit max-w-md p-0" align="start">
          <StaggeredList
            variant="slideIn"
            staggerDelay={ANIMATION_CONFIG.staggerDelay}
            disabled={!animated}
          >
            <Command>
              <CommandInput
                placeholder={
                  placeholder || `Filtrar ${title?.toLowerCase()}...`
                }
              />
              <CommandList>
                <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                <CommandGroup>{renderedOptions}</CommandGroup>
                {selectedValues.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={handleClearFilter}
                        className="cursor-pointer justify-center text-center text-red-600 transition-colors duration-200 select-auto hover:bg-red-800/10"
                        style={{ userSelect: "auto", pointerEvents: "auto" }}
                      >
                        Limpar filtro
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </StaggeredList>
        </PopoverContent>
      </Popover>
    );
  },
) as <TData, TValue>(props: FilterProps<TData, TValue>) => React.JSX.Element;
