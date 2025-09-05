/**
 * 🚀 Performance Monitor Hook
 * Monitor renders e detecta possíveis problemas de performance
 */
import { useEffect, useRef } from "react";

interface PerformanceMonitorOptions {
  componentName: string;
  maxRenders?: number;
  timeWindow?: number;
  onExcessiveRenders?: (count: number) => void;
}

export function usePerformanceMonitor({
  componentName,
  maxRenders = 10,
  timeWindow = 5000, // 5 seconds
  onExcessiveRenders,
}: PerformanceMonitorOptions) {
  const renderCount = useRef(0);
  const lastResetTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    
    // Reset counter if time window has passed
    if (now - lastResetTime.current > timeWindow) {
      renderCount.current = 1;
      lastResetTime.current = now;
      return;
    }

    // Check if renders exceeded threshold
    if (renderCount.current > maxRenders) {
      console.warn(
        `🚨 Performance Warning: ${componentName} rendered ${renderCount.current} times in ${timeWindow}ms`
      );
      
      onExcessiveRenders?.(renderCount.current);
      
      // Reset to prevent spam
      renderCount.current = 0;
      lastResetTime.current = now;
    }
  });

  // Development only logging
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🔄 ${componentName} rendered (${renderCount.current})`);
    }
  });
}
