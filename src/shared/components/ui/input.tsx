import { cn } from "@/shared/lib/utils";
import * as React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "ring-offset-background focus-visible:ring-ring flex w-full rounded-lg border border-neutral-800 bg-transparent px-3 py-4 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus:border-amber-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
