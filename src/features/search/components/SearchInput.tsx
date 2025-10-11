/**
 * 🔍 SearchInput Component
 * Input de busca com debounce, loading state e animações
 */

import { MagnifyingGlassIcon, X } from "@phosphor-icons/react";
import { Input } from "@shared/components/ui/input";
import { cn } from "@shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * 🔍 Input de busca com recursos avançados
 *
 * Features:
 * - Auto-focus ao abrir
 * - Clear button animado
 * - Loading spinner
 * - Ícone de busca
 * - Placeholder dinâmico
 * - Acessibilidade completa
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Pesquisar no sistema...",
      isLoading = false,
      autoFocus = true,
      className,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Auto-focus ao montar
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        // Pequeno delay para garantir que o modal está totalmente aberto
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [autoFocus, inputRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleClear = () => {
      onClear();
      inputRef.current?.focus();
    };

    const hasValue = value.length > 0;

    return (
      <div className="relative flex items-center">
        {/* Ícone de busca / Loading spinner */}
        <div className="pointer-events-none absolute left-3 flex items-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-300" />
              </motion.div>
            ) : (
              <motion.div
                key="search-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-neutral-400 dark:text-neutral-500"
                  weight="bold"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "h-12 pr-10 pl-11 text-base",
            "border-neutral-200 dark:border-neutral-700",
            "focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
            "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
            className,
          )}
          aria-label="Pesquisar no sistema"
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear button */}
        <AnimatePresence>
          {hasValue && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className={cn(
                "absolute right-3 flex items-center justify-center",
                "h-6 w-6 rounded-md",
                "text-neutral-400 hover:text-neutral-600",
                "dark:text-neutral-500 dark:hover:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                "transition-colors duration-150",
                "focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:focus:ring-neutral-600",
              )}
              aria-label="Limpar busca"
              type="button"
            >
              <X className="h-4 w-4" weight="bold" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
