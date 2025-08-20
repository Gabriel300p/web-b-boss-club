/**
 * 🎨 Card Component - Centro Educacional Alfa
 *
 * Flexible card component with consistent styling and variants.
 */

import { cn } from "@shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

// 🎯 Card Variants
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-card",
        elevated: "border-border bg-card shadow-elegant",
        floating: "border-border bg-card shadow-floating",
        outlined: "border-2 border-border bg-card shadow-none",
        ghost: "border-transparent bg-transparent shadow-none",
        success: "border-success-200 bg-success-50 text-success-900",
        warning: "border-warning-200 bg-warning-50 text-warning-900",
        error: "border-error-200 bg-error-50 text-error-900",
        info: "border-info-200 bg-info-50 text-info-900",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      interactive: {
        true: "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      interactive: false,
    },
  },
);

// 🎨 Card Component
interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

// 🏷️ Card Header
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

// 📝 Card Title
const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// 📄 Card Description
const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// 📦 Card Content
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

// 🦶 Card Footer
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
