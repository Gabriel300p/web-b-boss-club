/**
 * ⏱️ useDebouncedValue Hook
 * Debounce de valores (strings, numbers, etc) em vez de funções
 */

import { useEffect, useState } from "react";

/**
 * 🎯 Debounce de valor
 * Retorna o valor após um delay sem mudanças
 *
 * @param value - Valor para fazer debounce
 * @param delay - Delay em milissegundos
 * @returns Valor debounced
 *
 * @example
 * const debouncedQuery = useDebouncedValue(query, 300);
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value changes before delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
