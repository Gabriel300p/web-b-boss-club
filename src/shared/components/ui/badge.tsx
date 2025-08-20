/**
 * 🏷️ Badge Component - Centro Educacional Alfa
 *
 * Versatile badge component for labels, status indicators, and notifications.
 */

import { cn } from "@shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

// 🎯 Badge Variants
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground",

        // Semantic variants
        success:
          "border-transparent bg-success-500 text-white hover:bg-success-600",
        warning:
          "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        error: "border-transparent bg-error-500 text-white hover:bg-error-600",
        info: "border-transparent bg-info-500 text-white hover:bg-info-600",

        // Light semantic variants
        "success-light":
          "border-success-200 bg-success-50 text-success-700 hover:bg-success-100",
        "warning-light":
          "border-warning-200 bg-warning-50 text-warning-700 hover:bg-warning-100",
        "error-light":
          "border-error-200 bg-error-50 text-error-700 hover:bg-error-100",
        "info-light":
          "border-info-200 bg-info-50 text-info-700 hover:bg-info-100",

        // Brand variants
        brand: "border-transparent bg-brand-500 text-white hover:bg-brand-600",
        "brand-light":
          "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-sm font-medium",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  },
);

// 🎨 Badge Component
interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a dot indicator */
  dot?: boolean;
  /** Badge content for screen readers */
  "aria-label"?: string;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, shape, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)}
        {...props}
      >
        {dot && (
          <span
            className="mr-1 h-1.5 w-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    );
  },
);
Badge.displayName = "Badge";

// BadgeWithoutDot variant (for filters)
const BadgeWithoutDot = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, shape, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, shape }),
          "rounded-sm",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
BadgeWithoutDot.displayName = "BadgeWithoutDot";

export { Badge, BadgeWithoutDot };
