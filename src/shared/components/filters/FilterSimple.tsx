import { Badge, BadgeWithoutDot } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { Separator } from "@shared/components/ui/separator";
import type { Column } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
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

// Animation variants for performance optimization
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.05, duration: 0.2 }
  })
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export function FilterSimple<TData, TValue>({
  column,
  title,
  options,
  icon,
  placeholder,
  value: externalValue,
  onChange: externalOnChange,
  animated = true,
}: FilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const columnFilterValue = column?.getFilterValue();
  const [searchTerm, setSearchTerm] = React.useState("");

  const selectedValues = React.useMemo(() => {
    // Use external value if provided, otherwise use column filter value
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

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleOptionClick = (option: FilterOption) => {
    if (isBooleanFilter) {
      if (externalOnChange) {
        externalOnChange([option.value]);
      } else {
        column?.setFilterValue(option.value);
      }
    } else {
      const newSelectedValues = new Set(selectedValues);
      if (selectedValues.has(option.value)) {
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
  };

  const handleClearAll = () => {
    if (externalOnChange) {
      externalOnChange([]);
    } else {
      column?.setFilterValue(undefined);
    }
  };

  // Conditional wrapper for animations
  const AnimationWrapper = animated ? motion.div : React.Fragment;
  const ItemWrapper = animated ? motion.div : React.Fragment;
  const getItemProps = (index: number) => animated ? {
    variants: itemVariants,
    initial: "hidden",
    animate: "visible",
    custom: index
  } : {};

  const ButtonWrapper = animated ? motion.div : React.Fragment;
  const buttonProps = animated ? {
    whileHover: buttonVariants.hover,
    whileTap: buttonVariants.tap,
    transition: { duration: 0.2 }
  } : {};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ButtonWrapper {...buttonProps}>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-accent/50 h-10 gap-1.5 border border-slate-200 text-sm transition-colors"
          >
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
        </ButtonWrapper>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-md p-0" align="start">
        <AnimatePresence>
          <AnimationWrapper
            {...(animated ? {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
              transition: { duration: 0.2 }
            } : {})}
          >
            <div className="p-2">
              {/* Search Input */}
              {options.length > 5 && (
                <input
                  type="text"
                  placeholder={placeholder || `Filtrar ${title?.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 mb-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-500">
                    Nenhum resultado encontrado.
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = selectedValues.has(option.value);
                    const count = option.count || facets?.get(option.value) || 0;

                    return (
                      <ItemWrapper
                        key={option.value.toString()}
                        {...getItemProps(index)}
                      >
                        <div
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded transition-colors"
                          onClick={() => handleOptionClick(option)}
                        >
                          {animated ? (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Checkbox checked={isSelected} />
                            </motion.div>
                          ) : (
                            <Checkbox checked={isSelected} />
                          )}
                          <div className="flex items-center gap-1.5 flex-1">
                            {option.icon}
                            <span className="text-sm">{option.label}</span>
                          </div>
                          {count > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {count}
                            </span>
                          )}
                        </div>
                      </ItemWrapper>
                    );
                  })
                )}
              </div>

              {/* Clear Button */}
              {selectedValues.size > 0 && (
                <>
                  <Separator className="my-2" />
                  <button
                    onClick={handleClearAll}
                    className="w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Limpar filtro
                  </button>
                </>
              )}
            </div>
          </AnimationWrapper>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
