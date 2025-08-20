/**
 * 🎨 Enhanced Theme Provider - Centro Educacional Alfa
 * 
 * Provides centralized theme management with design tokens,
 * dark mode support, and theme utilities.
 */

import { useEffect, useState, type ReactNode } from "react";
import { designTokens } from "@shared/styles/design-tokens";
import { 
  getSystemTheme, 
  getSystemReducedMotion, 
  getSystemHighContrast,
  STORAGE_KEYS,
  themeUtils
} from "@shared/utils/theme-utils";
import { 
  ThemeContext, 
  type ThemeMode, 
  type ThemeConfig, 
  type ThemeContextValue 
} from "@shared/contexts/theme-context";

// 📦 Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultMode = "system",
  storageKey = STORAGE_KEYS.theme,
  enableSystem = true,
}: ThemeProviderProps) {
  // 🔄 State
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode;
    try {
      return (localStorage.getItem(storageKey) as ThemeMode) || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.reducedMotion);
      return stored ? JSON.parse(stored) : getSystemReducedMotion();
    } catch {
      return getSystemReducedMotion();
    }
  });

  const [highContrast, setHighContrastState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.highContrast);
      return stored ? JSON.parse(stored) : getSystemHighContrast();
    } catch {
      return getSystemHighContrast();
    }
  });

  // 🎯 Computed values
  const systemTheme = getSystemTheme();
  const colorScheme = mode === "system" ? systemTheme : mode === "dark" ? "dark" : "light";
  const isLight = colorScheme === "light";
  const isDark = colorScheme === "dark";

  // 🎨 Theme configuration
  const config: ThemeConfig = {
    mode,
    tokens: designTokens,
    colorScheme,
    reducedMotion,
    highContrast,
  };

  // 📝 Actions
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(storageKey, newMode);
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else if (mode === "dark") {
      setMode(enableSystem ? "system" : "light");
    } else {
      setMode("light");
    }
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.reducedMotion, JSON.stringify(enabled));
    } catch {
      // Ignore localStorage errors
    }
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.highContrast, JSON.stringify(enabled));
    } catch {
      // Ignore localStorage errors
    }
  };

  // 🎯 Context value
  const value: ThemeContextValue = {
    config,
    setMode,
    toggleMode,
    setReducedMotion,
    setHighContrast,
    getColorValue: themeUtils.getColorValue,
    getSpacingValue: themeUtils.getSpacingValue,
    getAnimationDuration: themeUtils.getAnimationDuration,
    isLight,
    isDark,
  };

  // 🌐 System theme change listener
  useEffect(() => {
    if (!enableSystem || mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // Force re-render when system theme changes
      setModeState((prev) => (prev === "system" ? "system" : prev));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, enableSystem]);

  // 🎨 Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");
    
    // Add current theme class
    root.classList.add(colorScheme);
    
    // Apply accessibility preferences
    if (reducedMotion) {
      root.style.setProperty("--motion-reduce", "1");
    } else {
      root.style.removeProperty("--motion-reduce");
    }
    
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [colorScheme, reducedMotion, highContrast]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
