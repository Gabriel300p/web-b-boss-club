import { useCallback, useRef } from "react";

/**
 * Hook para debounce de funções, útil para otimizar performance
 * em operações que podem ser chamadas frequentemente
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay],
  );
}
