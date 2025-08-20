import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { Separator } from "@shared/components/ui/separator";
import { cn } from "@shared/lib/utils";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangeFilterProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  title?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  presets?: Array<{
    label: string;
    value: DateRange;
  }>;
}

export function DateRangeFilter({
  value,
  onChange,
  title = "Data",
  icon,
  presets = [],
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const dateValue: DateValueType = React.useMemo(
    () => ({
      startDate: value?.startDate || null,
      endDate: value?.endDate || null,
    }),
    [value],
  );

  const hasValue = value?.startDate || value?.endDate;

  const handleDateChange = (newValue: DateValueType) => {
    onChange({
      startDate: newValue?.startDate ? new Date(newValue.startDate) : null,
      endDate: newValue?.endDate ? new Date(newValue.endDate) : null,
    });
  };

  const defaultPresets = [
    {
      label: "Hoje",
      value: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
    {
      label: "Últimos 7 dias",
      value: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    },
    {
      label: "Últimos 30 dias",
      value: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    },
    {
      label: "Este mês",
      value: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      },
    },
  ];

  const allPresets = [...defaultPresets, ...presets];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-10 justify-start gap-1.5 border-dashed text-left text-sm font-normal",
            !hasValue && "text-muted-foreground",
          )}
        >
          {icon || <CalendarIcon className="h-4 w-4" />}
          {title}
          {hasValue && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                Período ativo
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-4">
          {/* Presets */}
          {allPresets.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {allPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    onChange(preset.value);
                    setIsOpen(false);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}

          {allPresets.length > 0 && <Separator />}

          {/* Date Picker */}
          <div className="w-full">
            <Datepicker
              value={dateValue}
              onChange={handleDateChange}
              showShortcuts={false}
              showFooter={false}
              primaryColor="blue"
              inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              toggleClassName="absolute bg-blue-300 rounded-r-lg text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              displayFormat="DD/MM/YYYY"
              readOnly
            />
          </div>

          {/* Clear button */}
          {hasValue && (
            <>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  onChange({ startDate: null, endDate: null });
                  setIsOpen(false);
                }}
              >
                Limpar filtro
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
