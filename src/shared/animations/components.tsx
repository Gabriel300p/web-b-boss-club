/**
 * 🎭 Animation Components
 *
 * Reusable animation components that wrap common animation patterns.
 * These components provide consistent animations across the application.
 */

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import {
  ANIMATION_DURATION,
  LIST_ANIMATIONS,
  MICRO_INTERACTIONS,
  PAGE_TRANSITIONS,
} from "./config";

// 🎯 Base Animation Component Props
interface BaseAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  disabled?: boolean;
}

// 🎯 Page Transition Component
interface PageTransitionProps extends BaseAnimationProps {
  variant?: keyof typeof PAGE_TRANSITIONS;
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  (
    {
      children,
      className,
      variant = "fadeIn",
      delay = 0,
      duration,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    // Respect user motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    if (!shouldAnimate) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    const variants = PAGE_TRANSITIONS[variant];
    const transition = {
      duration: duration || ANIMATION_DURATION.slow,
      delay,
      ease: [0.4, 0, 0.2, 1] as const,
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
PageTransition.displayName = "PageTransition";

// 🎯 Micro Interaction Component
interface MicroInteractionProps extends BaseAnimationProps {
  variant?: keyof typeof MICRO_INTERACTIONS;
  trigger?: "hover" | "tap" | "focus";
}

export const MicroInteraction = forwardRef<
  HTMLDivElement,
  MicroInteractionProps
>(
  (
    {
      children,
      className,
      variant = "buttonHover",
      trigger = "hover",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    if (!shouldAnimate) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    const variants = MICRO_INTERACTIONS[variant];
    const transition = {
      duration: ANIMATION_DURATION.fast,
      ease: [0, 0, 0.2, 1] as const,
    };

    const motionProps = {
      [trigger]:
        trigger === "hover" ? "hover" : trigger === "tap" ? "tap" : "focus",
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants}
        initial="rest"
        {...motionProps}
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
MicroInteraction.displayName = "MicroInteraction";

// 🎯 Fade In Component
interface FadeInProps extends BaseAnimationProps {
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  (
    {
      children,
      className,
      direction = "up",
      distance = 20,
      delay = 0,
      duration = ANIMATION_DURATION.normal,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    if (!shouldAnimate) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    const getInitialPosition = () => {
      switch (direction) {
        case "up":
          return { y: distance };
        case "down":
          return { y: -distance };
        case "left":
          return { x: distance };
        case "right":
          return { x: -distance };
        default:
          return {};
      }
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, ...getInitialPosition() }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration,
          delay,
          ease: [0, 0, 0.2, 1],
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
FadeIn.displayName = "FadeIn";

// 🎯 Scale In Component
interface ScaleInProps extends BaseAnimationProps {
  scale?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  (
    {
      children,
      className,
      scale = 0.8,
      delay = 0,
      duration = ANIMATION_DURATION.normal,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    if (!shouldAnimate) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, scale }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration,
          delay,
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
ScaleIn.displayName = "ScaleIn";

// 🎯 Staggered List Component
interface StaggeredListProps extends BaseAnimationProps {
  staggerDelay?: number;
  variant?: "default" | "slideIn";
}

export const StaggeredList = forwardRef<HTMLDivElement, StaggeredListProps>(
  (
    {
      children,
      className,
      staggerDelay = 0.1,
      variant = "default",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    if (!shouldAnimate) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    const baseVariants =
      variant === "slideIn"
        ? LIST_ANIMATIONS.slideInContainer
        : LIST_ANIMATIONS.container;

    const customVariants = {
      ...baseVariants,
      show: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={customVariants}
        initial="hidden"
        animate="show"
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
StaggeredList.displayName = "StaggeredList";

// 🎯 Staggered Item Component
interface StaggeredItemProps extends BaseAnimationProps {
  variant?: "default" | "slideIn";
}

export const StaggeredItem = forwardRef<HTMLDivElement, StaggeredItemProps>(
  (
    { children, className, variant = "default", disabled = false, ...props },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    if (!shouldAnimate) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    const variants =
      variant === "slideIn"
        ? LIST_ANIMATIONS.slideInItem
        : LIST_ANIMATIONS.item;

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
StaggeredItem.displayName = "StaggeredItem";

// 🎯 Motion Button Component
interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, "variants" | "children"> {
  children: ReactNode;
  variant?: "default" | "scale" | "lift";
  disabled?: boolean;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      children,
      className,
      variant = "default",
      disabled = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      style,
      ...motionProps
    },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    const getVariants = () => {
      switch (variant) {
        case "scale":
          return {
            rest: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 },
          };
        case "lift":
          return {
            rest: { y: 0 },
            hover: { y: -2 },
            tap: { y: 0 },
          };
        default:
          return MICRO_INTERACTIONS.buttonHover;
      }
    };

    if (!shouldAnimate) {
      return (
        <button
          ref={ref}
          className={className}
          disabled={disabled}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={style as React.CSSProperties}
        >
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={className}
        variants={getVariants()}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={{
          duration: ANIMATION_DURATION.fast,
          ease: [0, 0, 0.2, 1] as const,
        }}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  },
);
MotionButton.displayName = "MotionButton";

// 🎯 Motion Card Component
interface MotionCardProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "children"> {
  children: ReactNode;
  variant?: "default" | "lift" | "scale";
  disabled?: boolean;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  (
    {
      children,
      className,
      variant = "default",
      disabled = false,
      onMouseEnter,
      onMouseLeave,
      style,
      ...motionProps
    },
    ref,
  ) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !disabled && !prefersReducedMotion;

    const getVariants = () => {
      switch (variant) {
        case "lift":
          return MICRO_INTERACTIONS.cardHover;
        case "scale":
          return {
            rest: { scale: 1 },
            hover: { scale: 1.02 },
          };
        default:
          return {
            rest: { y: 0 },
            hover: { y: -2 },
          };
      }
    };

    if (!shouldAnimate) {
      return (
        <div
          ref={ref}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={style as React.CSSProperties}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={getVariants()}
        initial="rest"
        whileHover="hover"
        transition={{
          duration: ANIMATION_DURATION.fast,
          ease: [0, 0, 0.2, 1] as const,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  },
);
MotionCard.displayName = "MotionCard";
