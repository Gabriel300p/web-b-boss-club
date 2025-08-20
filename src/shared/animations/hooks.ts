/**
 * 🎪 Animation Hooks
 *
 * Custom hooks for programmatic animation control and user preference detection.
 * These hooks provide reactive animation states and controls.
 */

import { useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

// Type alias for cleaner code
type AnimationControls = ReturnType<typeof useAnimationControls>;

// 🎯 Prefers Reduced Motion Hook
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Handle both old and new browser APIs
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

// 🎯 Animation State Hook
interface AnimationState {
  isAnimating: boolean;
  hasAnimated: boolean;
  controls: AnimationControls;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useAnimationState(): AnimationState {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const controls = useAnimationControls();

  const start = useCallback(async () => {
    setIsAnimating(true);
    try {
      await controls.start("animate");
      setHasAnimated(true);
    } finally {
      setIsAnimating(false);
    }
  }, [controls]);

  const stop = useCallback(() => {
    controls.stop();
    setIsAnimating(false);
  }, [controls]);

  const reset = useCallback(() => {
    controls.set("initial");
    setIsAnimating(false);
    setHasAnimated(false);
  }, [controls]);

  return {
    isAnimating,
    hasAnimated,
    controls,
    start,
    stop,
    reset,
  };
}

// 🎯 Intersection Observer Hook for Scroll Animations
interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
}

interface UseInViewResult {
  ref: React.RefObject<HTMLElement | null>;
  isInView: boolean;
  hasBeenInView: boolean;
}

export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  disabled = false,
}: UseInViewOptions = {}): UseInViewResult {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (
      disabled ||
      typeof window === "undefined" ||
      !window.IntersectionObserver
    ) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }

        // Stop observing if triggerOnce and element has been in view
        if (triggerOnce && inView) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, disabled, hasBeenInView]);

  return {
    ref,
    isInView,
    hasBeenInView,
  };
}

// 🎯 Stagger Animation Hook
interface UseStaggerAnimationResult {
  controls: AnimationControls;
  getItemDelay: (index: number) => number;
  startStagger: () => Promise<void>;
  resetStagger: () => void;
}

export function useStaggerAnimation(): UseStaggerAnimationResult {
  const controls = useAnimationControls();

  const getItemDelay = useCallback((index: number) => index * 0.1, []);

  const startStagger = useCallback(async () => {
    await controls.start("visible");
  }, [controls]);

  const resetStagger = useCallback(() => {
    controls.set("hidden");
  }, [controls]);

  return {
    controls,
    getItemDelay,
    startStagger,
    resetStagger,
  };
}

// 🎯 Sequential Animation Hook
interface UseSequentialAnimationResult {
  controls: AnimationControls;
  currentAnimation: string | null;
  isComplete: boolean;
  start: () => Promise<void>;
  pause: () => void;
  reset: () => void;
  goToAnimation: (animationName: string) => Promise<void>;
}

export function useSequentialAnimation(
  animations: string[],
): UseSequentialAnimationResult {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimationControls();

  const start = useCallback(async () => {
    setIsComplete(false);

    for (const animation of animations) {
      setCurrentAnimation(animation);
      await controls.start(animation);
    }

    setIsComplete(true);
  }, [animations, controls]);

  const pause = useCallback(() => {
    controls.stop();
  }, [controls]);

  const reset = useCallback(() => {
    controls.set(animations[0] || "initial");
    setCurrentAnimation(null);
    setIsComplete(false);
  }, [controls, animations]);

  const goToAnimation = useCallback(
    async (animationName: string) => {
      if (animations.includes(animationName)) {
        setCurrentAnimation(animationName);
        await controls.start(animationName);
      }
    },
    [animations, controls],
  );

  return {
    controls,
    currentAnimation,
    isComplete,
    start,
    pause,
    reset,
    goToAnimation,
  };
}

// 🎯 Hover Animation Hook
interface UseHoverAnimationResult {
  ref: React.RefObject<HTMLElement | null>;
  isHovered: boolean;
  hoverProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export function useHoverAnimation(): UseHoverAnimationResult {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  const hoverProps = {
    onMouseEnter: () => {
      if (shouldAnimate) {
        setIsHovered(true);
      }
    },
    onMouseLeave: () => {
      if (shouldAnimate) {
        setIsHovered(false);
      }
    },
  };

  return {
    ref,
    isHovered,
    hoverProps,
  };
}

// 🎯 Scroll Progress Hook
interface UseScrollProgressResult {
  scrollProgress: number;
  isScrolling: boolean;
}

export function useScrollProgress(): UseScrollProgressResult {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial call

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollProgress,
    isScrolling,
  };
}

// 🎯 Page Transition Hook
interface UsePageTransitionResult {
  controls: AnimationControls;
  isTransitioning: boolean;
  startTransition: () => Promise<void>;
  endTransition: () => Promise<void>;
}

export function usePageTransition(): UsePageTransitionResult {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const controls = useAnimationControls();

  const startTransition = useCallback(async () => {
    setIsTransitioning(true);
    await controls.start("exit");
  }, [controls]);

  const endTransition = useCallback(async () => {
    await controls.start("enter");
    setIsTransitioning(false);
  }, [controls]);

  return {
    controls,
    isTransitioning,
    startTransition,
    endTransition,
  };
}
