/**
 * 🎯 Optimized Phosphor Icons Strategy
 *
 * Benefits:
 * 1. Tree-shaking: Only imports icons actually used
 * 2. Centralized: Single source of truth for all icons
 * 3. Type-safe: Full TypeScript support
 * 4. Consistent: Same styling and props across app
 * 5. Performance: Lazy loading and memoization ready
 */

// 🚀 Only import the specific icons we need (tree-shaking friendly)
export {
  PencilSimpleLineIcon,
  PlusCircleIcon,
  ProhibitIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

// 🚀 Common icon props for consistency
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const ICON_WEIGHTS = {
  thin: "thin",
  light: "light",
  regular: "regular",
  bold: "bold",
  fill: "fill",
  duotone: "duotone",
} as const;

// 🚀 Common icon configurations
export const iconProps = {
  size: ICON_SIZES.md,
  weight: ICON_WEIGHTS.regular,
} as const;
