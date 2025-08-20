/**
 * 📊 Progress Component - Centro Educacional Alfa
 *
 * Progress bar component for showing completion status.
 */

import { cn } from "@shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

// 🎯 Progress Variants
const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
      variant: {
        default: "bg-secondary",
        success: "bg-success-100",
        warning: "bg-warning-100",
        error: "bg-error-100",
        info: "bg-info-100",
        brand: "bg-brand-100",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-success-500",
        warning: "bg-warning-500",
        error: "bg-error-500",
        info: "bg-info-500",
        brand: "bg-brand-500",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animated: false,
    },
  },
);

// 🎨 Progress Component
interface ProgressProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  /** Progress value (0-100) */
  value?: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Show animated stripes */
  animated?: boolean;
  /** Show progress text */
  showValue?: boolean;
  /** Custom indicator variant */
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>["variant"];
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant,
      animated = false,
      showValue = false,
      indicatorVariant,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full">
        {showValue && (
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`Progress: ${Math.round(percentage)}%`}
          className={cn(progressVariants({ size, variant }), className)}
          {...props}
        >
          <div
            className={cn(
              progressIndicatorVariants({
                variant: indicatorVariant || variant,
                animated,
              }),
            )}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
            }}
          />
        </div>
      </div>
    );
  },
);
Progress.displayName = "Progress";

export { Progress };
