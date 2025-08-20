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
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import type { DateRange as DayPickerRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface ModernCalendarProps {
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
  showPresets?: boolean;
  showClearButton?: boolean;
  variant?: "default" | "compact" | "floating";
}

// 🎯 Presets modernos e inteligentes  
const getModernPresets = (): Array<{ 
  label: string; 
  value: DateRange; 
}> => {
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

export function ModernCalendar({
  value,
  onChange,
  title = "Selecionar Data",
  icon,
  mode = "range",
  presets = [],
  autoApply = true,
  className,
  showPresets = true,
  showClearButton = true,
  variant = "default",
}: ModernCalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DayPickerRange | undefined>(undefined);

  const allPresets = [...getModernPresets(), ...presets];
  const hasValue = value?.startDate || value?.endDate;

  // Convert our DateRange to DayPicker format
  const selectedRange: DayPickerRange | undefined = React.useMemo(() => {
    if (mode === "single" && value?.startDate) {
      return { from: value.startDate, to: value.startDate };
    }
    if (mode === "range" && value?.startDate) {
      return { from: value.startDate, to: value.endDate || value.startDate };
    }
    return undefined;
  }, [value, mode]);

  // Format display text
  const displayText = React.useMemo(() => {
    if (!hasValue) return `Selecione ${mode === "single" ? "uma data" : "um período"}`;
    
    if (mode === "single" && value?.startDate) {
      return format(value.startDate, "dd/MM/yyyy", { locale: ptBR });
    }
    
    if (mode === "range") {
      if (value?.startDate && value?.endDate) {
        if (isSameDay(value.startDate, value.endDate)) {
          return format(value.startDate, "dd/MM/yyyy", { locale: ptBR });
        }
        return `${format(value.startDate, "dd/MM", { locale: ptBR })} - ${format(value.endDate, "dd/MM/yyyy", { locale: ptBR })}`;
      }
      if (value?.startDate) {
        return `${format(value.startDate, "dd/MM/yyyy", { locale: ptBR })} - ...`;
      }
    }
    
    return "Selecione uma data";
  }, [value, hasValue, mode]);

  // Handle calendar selection
  const handleCalendarSelect = (range: DayPickerRange | undefined) => {
    if (!range) return;

    if (autoApply) {
      const newValue: DateRange = {
        startDate: range.from || null,
        endDate: range.to || range.from || null,
      };
      onChange(newValue);
      
      if (mode === "single" || (range.from && range.to)) {
        setIsOpen(false);
      }
    } else {
      setTempRange(range);
    }
  };

  // Handle preset click
  const handlePresetClick = (preset: { label: string; value: DateRange }) => {
    onChange(preset.value);
    setTempRange(undefined);
    if (autoApply) {
      setIsOpen(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    onChange({ startDate: null, endDate: null });
    setTempRange(undefined);
  };

  // Handle apply (for non-auto-apply mode)
  const handleApply = () => {
    if (tempRange) {
      const newValue: DateRange = {
        startDate: tempRange.from || null,
        endDate: tempRange.to || tempRange.from || null,
      };
      onChange(newValue);
    }
    setTempRange(undefined);
    setIsOpen(false);
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "h-8 text-sm px-2";
      case "floating":
        return "rounded-full border-2 shadow-lg hover:shadow-xl";
      default:
        return "h-10";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal transition-all duration-200",
            getVariantClasses(),
            !hasValue && "text-muted-foreground",
            hasValue && "border-primary/30 bg-primary/5",
            "hover:border-primary/50 hover:bg-primary/10",
            "focus:ring-2 focus:ring-primary/20",
            className
          )}
        >
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ 
                color: hasValue ? "rgb(59 130 246)" : "rgb(107 114 128)" 
              }}
              transition={{ duration: 0.2 }}
            >
              {icon || <CalendarIcon className="h-4 w-4" />}
            </motion.div>
            <span className="flex-1 truncate">{displayText}</span>
            {hasValue && showClearButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="ml-2"
              >
                <Badge variant="secondary" className="h-5 px-1">
                  {mode === "range" ? "período" : "data"}
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-auto p-0 border-2 shadow-2xl" 
        align="start"
        sideOffset={4}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "p-4 space-y-4",
              variant === "floating" && "rounded-2xl"
            )}
          >
            {/* Header with title */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
              {hasValue && (
                <Badge variant="outline" className="text-xs">
                  {mode === "range" ? "Período" : "Data única"}
                </Badge>
              )}
            </div>

            {/* Presets */}
            {showPresets && allPresets.length > 0 && (
              <motion.div 
                className="grid grid-cols-2 gap-2 pb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {allPresets.map((preset, index) => (
                  <motion.div
                    key={preset.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-full text-xs font-medium transition-all duration-200",
                        "hover:bg-primary/10 rounded-lg border hover:border-primary/30"
                      )}
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {showPresets && allPresets.length > 0 && <Separator />}

            {/* Modern Calendar */}
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
                  numberOfMonths={variant === "compact" ? 1 : 2}
                  className="rounded-xl border-0"
                  classNames={{
                    months: cn(
                      "flex space-y-4 sm:space-y-0",
                      variant === "compact" ? "flex-col" : "flex-col sm:flex-row sm:space-x-6"
                    ),
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center mb-4",
                    caption_label: "text-base font-semibold text-gray-900",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-8 w-8 bg-white border-2 border-gray-200 p-0 rounded-full",
                      "hover:border-primary hover:bg-primary/10 transition-all duration-200",
                      "focus:ring-2 focus:ring-primary/20"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex mb-2",
                    head_cell: cn(
                      "text-gray-500 rounded-md w-10 h-8 font-semibold text-xs",
                      "flex items-center justify-center"
                    ),
                    row: "flex w-full mt-1",
                    cell: cn(
                      "h-10 w-10 text-center text-sm p-0 relative m-0.5",
                      "rounded-lg hover:bg-gray-100 transition-colors duration-150"
                    ),
                    day: cn(
                      "h-9 w-9 p-0 font-medium rounded-lg border-2 border-transparent",
                      "hover:border-primary/30 hover:bg-primary/10 transition-all duration-200",
                      "focus:ring-2 focus:ring-primary/20"
                    ),
                    day_selected: cn(
                      "bg-primary text-white border-primary shadow-md",
                      "hover:bg-primary hover:text-white hover:border-primary",
                      "focus:bg-primary focus:text-white"
                    ),
                    day_today: cn(
                      "bg-blue-50 text-blue-700 border-blue-200 font-bold",
                      "hover:bg-blue-100 hover:border-blue-300"
                    ),
                    day_outside: "text-gray-300 hover:text-gray-400",
                    day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
                    day_range_middle: cn(
                      "bg-primary/20 text-primary-foreground border-primary/20",
                      "hover:bg-primary/30"
                    ),
                    day_hidden: "invisible",
                  }}
                  components={{
                    Chevron: ({ orientation }) => (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {orientation === "left" ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </motion.div>
                    ),
                  }}
                />
              ) : (
                <DayPicker
                  mode="single"
                  selected={(tempRange || selectedRange)?.from}
                  onSelect={(date) =>
                    handleCalendarSelect(date ? { from: date, to: date } : undefined)
                  }
                  locale={ptBR}
                  className="rounded-xl border-0"
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center mb-4",
                    caption_label: "text-base font-semibold text-gray-900",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-8 w-8 bg-white border-2 border-gray-200 p-0 rounded-full",
                      "hover:border-primary hover:bg-primary/10 transition-all duration-200"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex mb-2",
                    head_cell: cn(
                      "text-gray-500 rounded-md w-10 h-8 font-semibold text-xs",
                      "flex items-center justify-center"
                    ),
                    row: "flex w-full mt-1",
                    cell: cn(
                      "h-10 w-10 text-center text-sm p-0 relative m-0.5",
                      "rounded-lg hover:bg-gray-100 transition-colors duration-150"
                    ),
                    day: cn(
                      "h-9 w-9 p-0 font-medium rounded-lg border-2 border-transparent",
                      "hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                    ),
                    day_selected: cn(
                      "bg-primary text-white border-primary shadow-md",
                      "hover:bg-primary hover:text-white"
                    ),
                    day_today: cn(
                      "bg-blue-50 text-blue-700 border-blue-200 font-bold",
                      "hover:bg-blue-100"
                    ),
                    day_outside: "text-gray-300",
                    day_disabled: "text-gray-300 opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              )}
            </motion.div>

            {/* Modern Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between pt-2 border-t"
            >
              {/* Clear button with animation */}
              {showClearButton && (hasValue || tempRange) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className={cn(
                      "text-red-600 hover:bg-red-50 hover:text-red-700",
                      "border border-transparent hover:border-red-200",
                      "rounded-lg transition-all duration-200"
                    )}
                  >
                    <XIcon className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>
                </motion.div>
              )}

              <div className="flex-1" />

              {/* Apply button (only if not auto-apply) */}
              {!autoApply && tempRange?.from && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Button 
                    size="sm" 
                    onClick={handleApply}
                    className={cn(
                      "bg-primary hover:bg-primary/90 shadow-md",
                      "rounded-lg transition-all duration-200 hover:shadow-lg"
                    )}
                  >
                    Aplicar
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
