import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Separator } from "@shared/components/ui/separator";
import { cn } from "@shared/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import * as React from "react";

type TextFilterSize = "sm" | "md" | "lg";

interface TextFilterProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  icon?: React.ReactNode;
  debounceMs?: number;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  size?: TextFilterSize;
}

const ICON_SIZES = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-4 w-4",
} as const;

const CLEAR_BUTTON_SIZES = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-6 w-6",
} as const;

export function TextFilter({
  value = "",
  onChange,
  placeholder = "Pesquisar...",
  title,
  icon = <SearchIcon className="h-4 w-4" />,
  debounceMs = 300,
  className,
  disabled = false,
  "aria-label": ariaLabel,
  size = "md",
}: TextFilterProps) {
  const [internalValue, setInternalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 🔥 OPTIMIZATION: Memoize onChange to prevent infinite loops
  const memoizedOnChange = React.useCallback(onChange, [onChange]);

  // Sync external value changes
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced onChange - OPTIMIZED
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      memoizedOnChange(internalValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null; // 🔥 Explicit null assignment
      }
    };
  }, [internalValue, memoizedOnChange, debounceMs]); // 🔥 Use memoized version

  const clearFilter = React.useCallback(() => {
    setInternalValue("");
    memoizedOnChange("");
  }, [memoizedOnChange]); // 🔥 Memoize clearFilter too

  // 🎯 Função para focar no input
  const focusInput = React.useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
      inputRef.current.select(); // Seleciona o texto existente
    }
  }, [disabled]);

  // 🎯 Atalho global Ctrl+K para focar na busca (usando ref para evitar conflitos)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+F ou Cmd+F (Mac) - atalho universal para busca
      if ((event.ctrlKey || event.metaKey) && event.key === "e") {
        // Verificar se não está em um input/textarea ativo
        const activeElement = document.activeElement;
        const isInputActive =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement)?.contentEditable === "true";

        if (!isInputActive && inputRef.current && !disabled) {
          event.preventDefault();
          event.stopPropagation();
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    // Usar capture para garantir que seja executado primeiro
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [disabled]); // Apenas disabled como dependência

  if (title) {
    // Render as filter button
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-accent/50 gap-1.5 border-dashed transition-colors"
          onClick={focusInput}
          disabled={disabled}
          aria-label={ariaLabel || `Filtrar por ${title}`}
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
            ref={inputRef}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            placeholder={placeholder}
            variant="search"
            size={size}
            className={cn("pr-20 pl-9", className)}
            disabled={disabled}
            aria-label={ariaLabel || `Campo de pesquisa para ${title}`}
          />
          <SearchIcon
            className={cn(
              "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2",
              ICON_SIZES[size],
            )}
          />
          <kbd className="absolute top-1/2 right-8 hidden -translate-y-1/2 rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-300 md:inline">
            {navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"} +
            E
          </kbd>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-accent/50 absolute top-1/2 right-1 -translate-y-1/2 p-0",
                CLEAR_BUTTON_SIZES[size],
              )}
              onClick={clearFilter}
              aria-label="Limpar filtro"
            >
              <XIcon className={ICON_SIZES[size]} />
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
        ref={inputRef}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        variant="search"
        size={size}
        className={cn("pr-20 pl-8")}
        disabled={disabled}
        aria-label={ariaLabel || "Campo de pesquisa"}
      />
      <SearchIcon
        className={cn(
          "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2",
          ICON_SIZES[size],
        )}
      />

      {value ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hover:bg-accent/50 absolute top-1/2 right-1 -translate-y-1/2 p-0",
            CLEAR_BUTTON_SIZES[size],
          )}
          onClick={clearFilter}
          aria-label="Limpar filtro"
        >
          <XIcon className={ICON_SIZES[size]} />
        </Button>
      ) : (
        <kbd className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-300 md:inline">
          {navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"} + E
        </kbd>
      )}
    </div>
  );
}
