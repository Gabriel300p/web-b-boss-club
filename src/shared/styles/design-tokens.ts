/**
 * 🎨 Design Tokens - Centro Educacional Alfa
 *
 * Sistema de tokens centralizado para manter consistência visual
 * e facilitar manutenção em toda a aplicação.
 */

// 🎯 Core Brand Colors
export const brandColors = {
  primary: {
    50: "oklch(0.971 0.013 264.695)",
    100: "oklch(0.929 0.027 264.695)",
    200: "oklch(0.871 0.054 264.695)",
    300: "oklch(0.792 0.081 264.695)",
    400: "oklch(0.694 0.108 264.695)",
    500: "oklch(0.576 0.135 264.695)", // Primary
    600: "oklch(0.458 0.108 264.695)",
    700: "oklch(0.359 0.081 264.695)",
    800: "oklch(0.278 0.054 264.695)",
    900: "oklch(0.216 0.027 264.695)",
    950: "oklch(0.129 0.013 264.695)",
  },
  secondary: {
    50: "oklch(0.976 0.006 264.695)",
    100: "oklch(0.941 0.012 264.695)",
    200: "oklch(0.894 0.024 264.695)",
    300: "oklch(0.831 0.036 264.695)",
    400: "oklch(0.753 0.048 264.695)",
    500: "oklch(0.659 0.060 264.695)", // Secondary
    600: "oklch(0.565 0.048 264.695)",
    700: "oklch(0.471 0.036 264.695)",
    800: "oklch(0.388 0.024 264.695)",
    900: "oklch(0.322 0.012 264.695)",
    950: "oklch(0.204 0.006 264.695)",
  },
} as const;

// 🌈 Semantic Colors
export const semanticColors = {
  success: {
    50: "oklch(0.973 0.044 162.012)",
    100: "oklch(0.937 0.089 162.012)",
    200: "oklch(0.885 0.178 162.012)",
    300: "oklch(0.812 0.267 162.012)",
    400: "oklch(0.720 0.356 162.012)",
    500: "oklch(0.628 0.445 162.012)", // Success
    600: "oklch(0.537 0.356 162.012)",
    700: "oklch(0.445 0.267 162.012)",
    800: "oklch(0.363 0.178 162.012)",
    900: "oklch(0.298 0.089 162.012)",
    950: "oklch(0.171 0.044 162.012)",
  },
  warning: {
    50: "oklch(0.977 0.028 85.875)",
    100: "oklch(0.945 0.056 85.875)",
    200: "oklch(0.890 0.113 85.875)",
    300: "oklch(0.812 0.169 85.875)",
    400: "oklch(0.720 0.225 85.875)",
    500: "oklch(0.628 0.281 85.875)", // Warning
    600: "oklch(0.537 0.225 85.875)",
    700: "oklch(0.445 0.169 85.875)",
    800: "oklch(0.363 0.113 85.875)",
    900: "oklch(0.298 0.056 85.875)",
    950: "oklch(0.171 0.028 85.875)",
  },
  error: {
    50: "oklch(0.975 0.028 17.378)",
    100: "oklch(0.943 0.056 17.378)",
    200: "oklch(0.886 0.113 17.378)",
    300: "oklch(0.808 0.169 17.378)",
    400: "oklch(0.714 0.225 17.378)",
    500: "oklch(0.620 0.281 17.378)", // Error
    600: "oklch(0.527 0.225 17.378)",
    700: "oklch(0.435 0.169 17.378)",
    800: "oklch(0.356 0.113 17.378)",
    900: "oklch(0.294 0.056 17.378)",
    950: "oklch(0.169 0.028 17.378)",
  },
  info: {
    50: "oklch(0.975 0.028 248.046)",
    100: "oklch(0.943 0.056 248.046)",
    200: "oklch(0.886 0.113 248.046)",
    300: "oklch(0.808 0.169 248.046)",
    400: "oklch(0.714 0.225 248.046)",
    500: "oklch(0.620 0.281 248.046)", // Info
    600: "oklch(0.527 0.225 248.046)",
    700: "oklch(0.435 0.169 248.046)",
    800: "oklch(0.356 0.113 248.046)",
    900: "oklch(0.294 0.056 248.046)",
    950: "oklch(0.169 0.028 248.046)",
  },
} as const;

// 🌊 Neutral Colors (Slate-based)
export const neutralColors = {
  white: "oklch(1 0 0)",
  slate: {
    50: "oklch(0.984 0.003 264.695)",
    100: "oklch(0.967 0.006 264.695)",
    200: "oklch(0.928 0.013 264.695)",
    300: "oklch(0.871 0.026 264.695)",
    400: "oklch(0.776 0.043 264.695)",
    500: "oklch(0.665 0.055 264.695)",
    600: "oklch(0.553 0.043 264.695)",
    700: "oklch(0.447 0.026 264.695)",
    800: "oklch(0.322 0.013 264.695)",
    900: "oklch(0.204 0.006 264.695)",
    950: "oklch(0.129 0.003 264.695)",
  },
  black: "oklch(0 0 0)",
} as const;

// 📏 Spacing Scale
export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// 🔤 Typography Scale
export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "Consolas", "monospace"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
    "5xl": ["3rem", { lineHeight: "1" }], // 48px
    "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
    "7xl": ["4.5rem", { lineHeight: "1" }], // 72px
    "8xl": ["6rem", { lineHeight: "1" }], // 96px
    "9xl": ["8rem", { lineHeight: "1" }], // 128px
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// 🔘 Border Radius Scale
export const borderRadius = {
  none: "0",
  sm: "0.25rem", // 4px
  DEFAULT: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.625rem", // 10px (--radius)
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// 🌫️ Shadow Scale
export const boxShadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "none",
} as const;

// ⚡ Animation Tokens
export const animation = {
  duration: {
    instant: "75ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    slowest: "1000ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
} as const;

// 📱 Breakpoints
export const breakpoints = {
  xs: "475px", // Mobile small
  sm: "640px", // Mobile
  md: "768px", // Tablet
  lg: "1024px", // Laptop
  xl: "1280px", // Desktop
  "2xl": "1400px", // Large desktop
} as const;

// 🎯 Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// 🎨 Design System Export
export const designTokens = {
  colors: {
    brand: brandColors,
    semantic: semanticColors,
    neutral: neutralColors,
  },
  spacing,
  typography,
  borderRadius,
  boxShadow,
  animation,
  breakpoints,
  zIndex,
} as const;

export type DesignTokens = typeof designTokens;
export type BrandColors = typeof brandColors;
export type SemanticColors = typeof semanticColors;
export type NeutralColors = typeof neutralColors;
