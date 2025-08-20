import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Separator } from "@shared/components/ui/separator";
import { cn } from "@shared/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import * as React from "react";

interface TextFilterProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  icon?: React.ReactNode;
  debounceMs?: number;
  className?: string;
}

export function TextFilter({
  value = "",
  onChange,
  placeholder = "Pesquisar...",
  title,
  icon = <SearchIcon className="h-4 w-4" />,
  debounceMs = 300,
  className,
}: TextFilterProps) {
  const [internalValue, setInternalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync external value changes
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced onChange
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [internalValue, onChange, debounceMs]);

  const clearFilter = () => {
    setInternalValue("");
    onChange("");
  };

  if (title) {
    // Render as filter button
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5 border-dashed text-sm"
          onClick={() => {
            // Focus on input when button is clicked
            const input = document.querySelector(
              `[data-filter-title="${title}"]`,
            ) as HTMLInputElement;
            input?.focus();
          }}
        >
          {icon}
          {title}
          {value && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                Ativo
              </Badge>
            </>
          )}
        </Button>
        <div className="relative">
          <Input
            data-filter-title={title}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            placeholder={placeholder}
            className={cn("h-10 w-64 pl-8", value && "pr-8")}
          />
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
              onClick={clearFilter}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render as simple input
  return (
    <div className={cn("relative", className)}>
      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className={cn("h-10 pl-8", value && "pr-8")}
      />
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
          onClick={clearFilter}
        >
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
