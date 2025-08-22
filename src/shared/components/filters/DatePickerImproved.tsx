import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { Separator } from "@shared/components/ui/separator";
import { cn } from "@shared/lib/utils";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, XIcon } from "lucide-react";
import * as React from "react";
import type { DateRange as DayPickerRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DatePickerImprovedProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  title?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  mode?: "single" | "range";
  presets?: Array<{
    label: string;
    value: DateRange;
  }>;
  autoApply?: boolean;
  className?: string;
}

// 🎯 Presets padrão inteligentes
const getDefaultPresets = (): Array<{ label: string; value: DateRange }> => {
  const today = new Date();

  return [
    {
      label: "Hoje",
      value: {
        startDate: startOfDay(today),
        endDate: endOfDay(today),
      },
    },
    {
      label: "Ontem",
      value: {
        startDate: startOfDay(subDays(today, 1)),
        endDate: endOfDay(subDays(today, 1)),
      },
    },
    {
      label: "Últimos 7 dias",
      value: {
        startDate: startOfDay(subDays(today, 6)),
        endDate: endOfDay(today),
      },
    },
    {
      label: "Últimos 30 dias",
      value: {
        startDate: startOfDay(subDays(today, 29)),
        endDate: endOfDay(today),
      },
    },
    {
      label: "Esta semana",
      value: {
        startDate: startOfWeek(today, { weekStartsOn: 0 }),
        endDate: endOfWeek(today, { weekStartsOn: 0 }),
      },
    },
    {
      label: "Este mês",
      value: {
        startDate: startOfMonth(today),
        endDate: endOfMonth(today),
      },
    },
  ];
};

export function DatePickerImproved({
  value,
  onChange,
  title = "Data",
  icon,
  mode = "range",
  presets = [],
  autoApply = true,
  className,
}: DatePickerImprovedProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DayPickerRange | undefined>(
    undefined,
  );

  const allPresets = [...getDefaultPresets(), ...presets];
  const hasValue = value?.startDate || value?.endDate;

  // Convert our DateRange to DayPicker format
  const selectedRange: DayPickerRange | undefined = React.useMemo(() => {
    if (mode === "single" && value?.startDate) {
      return { from: value.startDate, to: value.startDate };
    }
    if (mode === "range" && value?.startDate) {
      return { from: value.startDate, to: value.endDate || undefined };
    }
    return undefined;
  }, [value, mode]);

  // Formato de exibição do valor selecionado
  const getDisplayValue = () => {
    if (!hasValue) return title;

    if (mode === "single" && value?.startDate) {
      return format(value.startDate, "dd/MM/yyyy", { locale: ptBR });
    }

    if (mode === "range") {
      if (value?.startDate && value?.endDate) {
        return `${format(value.startDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(value.endDate, "dd/MM/yyyy", { locale: ptBR })}`;
      }
      if (value?.startDate) {
        return `${format(value.startDate, "dd/MM/yyyy", { locale: ptBR })} - ...`;
      }
    }

    return title;
  };

  // Handle preset selection
  const handlePresetClick = (preset: { label: string; value: DateRange }) => {
    onChange(preset.value);
    if (autoApply) {
      setIsOpen(false);
    }
  };

  // Handle calendar selection
  const handleCalendarSelect = (range: DayPickerRange | undefined) => {
    if (!range?.from) return;

    const newRange: DateRange = {
      startDate: range.from,
      endDate: mode === "range" ? range.to || null : null,
    };

    if (autoApply && (mode === "single" || range.to)) {
      onChange(newRange);
      setIsOpen(false);
    } else {
      setTempRange(range);
    }
  };

  // Apply manual changes
  const handleApply = () => {
    if (tempRange?.from) {
      const newRange: DateRange = {
        startDate: tempRange.from,
        endDate: mode === "range" ? tempRange.to || null : null,
      };
      onChange(newRange);
    }
    setIsOpen(false);
  };

  // Clear filter
  const handleClear = () => {
    const clearedRange = { startDate: null, endDate: null };
    onChange(clearedRange);
    setTempRange(undefined);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "font-norma h-10 justify-start gap-1.5 border border-neutral-200 text-left text-sm",
              !hasValue && "text-muted-foreground",
              className,
            )}
          >
            {icon || <CalendarIcon className="h-4 w-4" />}
            <span className="truncate">{getDisplayValue()}</span>
            {hasValue && (
              <>
                <Separator orientation="vertical" className="mx-0.5 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {mode === "range" ? "Período" : "Data"} ativo
                </Badge>
              </>
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 p-4"
          >
            {/* Presets */}
            {allPresets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-2"
              >
                {allPresets.map((preset, index) => (
                  <motion.div
                    key={preset.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary/10 h-8 w-full text-xs transition-colors"
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {allPresets.length > 0 && <Separator />}

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              {mode === "range" ? (
                <DayPicker
                  mode="range"
                  selected={tempRange || selectedRange}
                  onSelect={handleCalendarSelect}
                  locale={ptBR}
                  numberOfMonths={2}
                  className="rounded-md border-0"
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded border",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded hover:bg-accent",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              ) : (
                <DayPicker
                  mode="single"
                  selected={(tempRange || selectedRange)?.from}
                  onSelect={(date) =>
                    handleCalendarSelect(
                      date ? { from: date, to: date } : undefined,
                    )
                  }
                  locale={ptBR}
                  className="rounded-md border-0"
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded border",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded hover:bg-accent",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between pt-2"
            >
              {/* Clear button */}
              {(hasValue || tempRange) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XIcon className="mr-1 h-4 w-4" />
                  Limpar
                </Button>
              )}

              <div className="flex-1" />

              {/* Apply button (only if not auto-apply) */}
              {!autoApply && tempRange?.from && (
                <Button size="sm" onClick={handleApply} className="ml-2">
                  Aplicar
                </Button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
