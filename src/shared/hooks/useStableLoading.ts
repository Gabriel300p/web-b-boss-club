/**
 * 🛡️ Stable Loading Hook
 * Hook que gerencia estado de loading resistente ao React StrictMode
 * Evita skeleton duplo e garante UX consistente
 */
import { useRef, useState, useEffect } from "react";

interface UseStableLoadingOptions {
  /**
   * Estado de loading original do React Query
   */
  isLoading: boolean;
  
  /**
   * Delay mínimo para mostrar loading (evita flickers)
   * @default 150
   */
  minLoadingTime?: number;
  
  /**
   * Se deve debounce o loading state
   * @default true
   */
  enableDebounce?: boolean;
}

/**
 * Hook que estabiliza o estado de loading para evitar problemas com React StrictMode
 */
export function useStableLoading({
  isLoading,
  minLoadingTime = 150,
  enableDebounce = true,
}: UseStableLoadingOptions) {
  const [stableLoading, setStableLoading] = useState(false);
  const loadingStartTime = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 🎯 No primeiro render, se já está loading, marcar tempo de início
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isLoading) {
        loadingStartTime.current = Date.now();
        setStableLoading(true);
      }
      return;
    }

    // 🎯 Quando loading inicia
    if (isLoading && !stableLoading) {
      loadingStartTime.current = Date.now();
      
      if (enableDebounce) {
        // Pequeno debounce para evitar flickers em requests muito rápidos
        timeoutRef.current = setTimeout(() => {
          setStableLoading(true);
        }, 50);
      } else {
        setStableLoading(true);
      }
    }

    // 🎯 Quando loading termina
    if (!isLoading && stableLoading) {
      const elapsedTime = loadingStartTime.current 
        ? Date.now() - loadingStartTime.current 
        : 0;
      
      // Garantir tempo mínimo de loading para UX consistente
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        timeoutRef.current = setTimeout(() => {
          setStableLoading(false);
          loadingStartTime.current = null;
        }, remainingTime);
      } else {
        setStableLoading(false);
        loadingStartTime.current = null;
      }
    }

    // Cleanup timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isLoading, stableLoading, minLoadingTime, enableDebounce]);

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    /**
     * Estado de loading estabilizado
     */
    isLoading: stableLoading,
    
    /**
     * Loading original (para debug)
     */
    originalLoading: isLoading,
    
    /**
     * Se está no estado de transição (útil para animações)
     */
    isTransitioning: isLoading !== stableLoading,
  };
}
