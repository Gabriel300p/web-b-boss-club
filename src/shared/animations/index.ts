/**
 * 🎭 Animation System - Main Export
 *
 * Complete animation system for the application.
 * Provides configurations, components, hooks, and utilities.
 */

// 📦 Configuration
export {
  ANIMATION_CONFIG,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  LIST_ANIMATIONS,
  LOADING_STATES,
  MICRO_INTERACTIONS,
  MODAL_ANIMATIONS,
  PAGE_TRANSITIONS,
  TOAST_ANIMATIONS,
} from "./config";

// 🎪 Components
export {
  FadeIn,
  MicroInteraction,
  MotionButton,
  MotionCard,
  PageTransition,
  ScaleIn,
  StaggeredItem,
  StaggeredList,
} from "./components";

// 🎪 Hooks
export {
  useAnimationState,
  useHoverAnimation,
  useInView,
  usePageTransition,
  usePrefersReducedMotion,
  useScrollProgress,
  useSequentialAnimation,
  useStaggerAnimation,
} from "./hooks";

// 🎯 Animation System Status
export const ANIMATION_SYSTEM_VERSION = "1.0.0";
export const ANIMATION_SYSTEM_STATUS = "🟢 Active" as const;

// 🎯 Animation System Info
export const ANIMATION_SYSTEM_INFO = {
  version: ANIMATION_SYSTEM_VERSION,
  status: ANIMATION_SYSTEM_STATUS,
  components: [
    "PageTransition",
    "MicroInteraction",
    "FadeIn",
    "ScaleIn",
    "StaggeredList",
    "StaggeredItem",
    "MotionButton",
    "MotionCard",
  ],
  hooks: [
    "usePrefersReducedMotion",
    "useAnimationState",
    "useInView",
    "useStaggerAnimation",
    "useSequentialAnimation",
    "useHoverAnimation",
    "useScrollProgress",
    "usePageTransition",
  ],
  features: [
    "Accessibility-first animations",
    "Performance optimized",
    "Responsive design support",
    "User preference detection",
    "TypeScript strict mode compatible",
    "Consistent timing and easing",
    "Modular and reusable components",
  ],
} as const;
