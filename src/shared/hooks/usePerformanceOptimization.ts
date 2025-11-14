import { useCallback, useMemo, useRef } from "react";

interface PerformanceConfig {
  enableAnimations?: boolean;
  debounceMs?: number;
  virtualizeThreshold?: number;
  lazyLoadThreshold?: number;
}

export function usePerformanceOptimization<T>(
  data: T[],
  config: PerformanceConfig = {},
) {
  const {
    enableAnimations = true,
    debounceMs = 300,
    virtualizeThreshold = 100,
    lazyLoadThreshold = 50,
  } = config;

  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  // Determine if we should enable animations based on data size and performance
  const shouldEnableAnimations = useMemo(() => {
    if (!enableAnimations) return false;

    // Disable animations for large datasets
    if (data.length > lazyLoadThreshold) return false;

    // Check if we're rendering too frequently (potential performance issue)
    const avgRenderTime =
      renderCountRef.current > 0
        ? (Date.now() - lastRenderTimeRef.current) / renderCountRef.current
        : 0;

    return avgRenderTime < 16; // 60fps threshold
  }, [data.length, enableAnimations, lazyLoadThreshold]);

  // Determine if we should use virtualization
  const shouldVirtualize = useMemo(() => {
    return data.length > virtualizeThreshold;
  }, [data.length, virtualizeThreshold]);

  // Create optimized change handler with debouncing
  const createDebouncedCallback = useCallback(
    <Args extends unknown[]>(
      handler: (...args: Args) => void,
      customDebounce?: number,
    ) => {
      let timeoutId: NodeJS.Timeout;

      return (...args: Args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handler(...args);
        }, customDebounce || debounceMs);
      };
    },
    [debounceMs],
  );

  // Memoize large datasets to prevent unnecessary recalculations
  const optimizedData = useMemo(() => {
    // For very large datasets, we might want to implement chunking
    if (data.length > 1000) {
      // Return a proxy or chunked version for initial render
      return data.slice(0, 100); // Show first 100 items initially
    }
    return data;
  }, [data]);

  // Performance monitoring
  const getPerformanceMetrics = useCallback(() => {
    return {
      dataSize: data.length,
      renderCount: renderCountRef.current,
      shouldEnableAnimations,
      shouldVirtualize,
      lastRenderTime: lastRenderTimeRef.current,
    };
  }, [data.length, shouldEnableAnimations, shouldVirtualize]);

  return {
    optimizedData,
    shouldEnableAnimations,
    shouldVirtualize,
    createDebouncedCallback,
    getPerformanceMetrics,
    performanceConfig: {
      enableAnimations: shouldEnableAnimations,
      virtualize: shouldVirtualize,
      dataSize: data.length,
    },
  };
}
