/**
 * 🎯 Theme Utilities - Centro Educacional Alfa
 *
 * Utilities for theme management and design token access.
 */

import { designTokens } from "@shared/styles/design-tokens";

// 🎯 Theme utility functions
export const themeUtils = {
  getColorValue: (colorPath: string) => {
    const path = colorPath.split(".");
    let value: Record<string, unknown> = designTokens.colors;

    for (const key of path) {
      if (value && typeof value === "object" && key in value) {
        value = value[key] as Record<string, unknown>;
      } else {
        return "";
      }
    }

    return typeof value === "string" ? value : "";
  },

  getSpacingValue: (spacing: keyof typeof designTokens.spacing) => {
    return designTokens.spacing[spacing];
  },

  getAnimationDuration: (
    duration: keyof typeof designTokens.animation.duration,
  ) => {
    return designTokens.animation.duration[duration];
  },
} as const;

// 🌐 System Preferences Detection
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getSystemReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getSystemHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
}

// 💾 Local Storage Keys
export const STORAGE_KEYS = {
  theme: "cea-theme-mode",
  reducedMotion: "cea-reduced-motion",
  highContrast: "cea-high-contrast",
} as const;
