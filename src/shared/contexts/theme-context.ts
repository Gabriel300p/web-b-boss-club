/**
 * 🎨 Theme Context - Centro Educacional Alfa
 *
 * React context for theme management.
 */

import { designTokens, type DesignTokens } from "@shared/styles/design-tokens";
import { createContext } from "react";

// 🎯 Theme Configuration
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  tokens: DesignTokens;
  colorScheme: "light" | "dark";
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface ThemeContextValue {
  // Theme state
  config: ThemeConfig;

  // Theme actions
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;

  // Theme utilities
  getColorValue: (colorPath: string) => string;
  getSpacingValue: (spacing: keyof typeof designTokens.spacing) => string;
  getAnimationDuration: (
    duration: keyof typeof designTokens.animation.duration,
  ) => string;
  isLight: boolean;
  isDark: boolean;
}

// 🎨 Theme Context
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
