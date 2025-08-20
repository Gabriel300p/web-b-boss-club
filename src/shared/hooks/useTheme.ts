/**
 * 🪝 Theme Hook - Centro Educacional Alfa
 *
 * Custom hook for accessing theme context.
 */

import {
  ThemeContext,
  type ThemeContextValue,
} from "@shared/contexts/theme-context";
import { useContext } from "react";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
