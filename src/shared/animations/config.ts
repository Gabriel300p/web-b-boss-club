/**
 * 🎭 Animation System Configuration
 *
 * Centralized animation configuration for the entire application.
 * Provides consistent timing, easing, and behavior across all components.
 */

import type { Variants } from "framer-motion";

// 🎯 Animation Durations
export const ANIMATION_DURATION = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
  slowest: 1.0,
} as const;

// 🎯 Animation Easings
export const ANIMATION_EASING = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  elastic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  spring: { type: "spring", damping: 20, stiffness: 300 },
  gentleSpring: { type: "spring", damping: 25, stiffness: 200 },
  smoothSpring: { type: "spring", damping: 30, stiffness: 250 },
} as const;

// 🎯 Page Transition Variants
export const PAGE_TRANSITIONS: Record<string, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

// 🎯 Micro-interaction Variants
export const MICRO_INTERACTIONS: Record<string, Variants> = {
  buttonHover: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  cardHover: {
    rest: { y: 0, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" },
    hover: {
      y: -2,
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
  },
  iconSpin: {
    rest: { rotate: 0 },
    hover: { rotate: 360 },
  },
  iconBounce: {
    rest: { scale: 1 },
    hover: { scale: [1, 1.2, 1] },
  },
  focusRing: {
    initial: { scale: 1, opacity: 0 },
    animate: { scale: 1.05, opacity: 1 },
    exit: { scale: 1, opacity: 0 },
  },
};

// 🎯 Loading State Variants
export const LOADING_STATES: Record<string, Variants> = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  bounce: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  rotate: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

// 🎯 List Animation Variants
export const LIST_ANIMATIONS: Record<string, Variants> = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },
  slideInContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  slideInItem: {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
  },
};

// 🎯 Modal/Dialog Variants
export const MODAL_ANIMATIONS: Record<string, Variants> = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modal: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: "100%",
      transition: {
        duration: 0.3,
      },
    },
  },
};

// 🎯 Toast Animation Variants
export const TOAST_ANIMATIONS: Record<string, Variants> = {
  default: {
    initial: { opacity: 0, x: 400, scale: 0.95 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      x: 400,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  },
  slideDown: {
    initial: { opacity: 0, y: -100, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  },
};

// 🎯 Animation Configuration
export const ANIMATION_CONFIG = {
  // Respect user preferences
  respectMotionPreference: true,

  // Default transition for most animations
  defaultTransition: {
    duration: ANIMATION_DURATION.normal,
    ease: ANIMATION_EASING.easeOut,
  },

  // Page transition timing
  pageTransition: {
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASING.easeInOut,
  },

  // Micro-interaction timing
  microInteraction: {
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASING.easeOut,
  },

  // Loading state timing
  loadingState: {
    duration: ANIMATION_DURATION.slower,
    ease: ANIMATION_EASING.easeInOut,
  },
} as const;

// 🎯 Export all configurations
export const ANIMATIONS = {
  PAGE_TRANSITIONS,
  MICRO_INTERACTIONS,
  LOADING_STATES,
  LIST_ANIMATIONS,
  MODAL_ANIMATIONS,
  TOAST_ANIMATIONS,
  ANIMATION_CONFIG,
  ANIMATION_DURATION,
  ANIMATION_EASING,
} as const;

export default ANIMATIONS;
