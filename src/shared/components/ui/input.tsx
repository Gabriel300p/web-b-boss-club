import { cn } from "@/shared/lib/utils";
import * as React from "react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "form" | "search" | "login";
  size?: "sm" | "md" | "lg" | "login";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default:
        "border-neutral-800 bg-transparent focus:border-amber-400 focus:ring-amber-400/20",
      form: "border-neutral-600 bg-neutral-800 focus:border-primary focus:ring-primary/20",
      search:
        "border-neutral-700 bg-neutral-900/50 focus:border-amber-400 focus:ring-amber-400/20",
      login:
        "border-neutral-800 bg-transparent focus:border-amber-400 focus:ring-amber-400/20",
    };

    const sizes = {
      sm: "h-8 px-2 py-1 text-xs",
      md: "h-10 px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-base",
      login: "px-3.5 py-3.5 text-base",
    };

    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg border font-medium text-neutral-50",
          "placeholder:font-normal placeholder:text-neutral-400",
          "focus:ring-2 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200 ease-in-out",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
