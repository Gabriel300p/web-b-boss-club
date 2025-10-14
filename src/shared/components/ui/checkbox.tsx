import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      className={cn(
        "peer size-5 shrink-0 rounded-sm border-2 transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Estados não selecionados
        "border-neutral-700/30 bg-neutral-800/80",
        // Estados selecionados (checked ou indeterminate)
        "data-[state=checked]:scale-105 data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-neutral-900",
        "data-[state=indeterminate]:scale-105 data-[state=indeterminate]:border-yellow-500 data-[state=indeterminate]:bg-yellow-500 data-[state=indeterminate]:text-neutral-900",
        // Hover
        "hover:border-yellow-600 hover:bg-neutral-700/50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current",
          "animate-in zoom-in-50 duration-200",
        )}
      >
        {checked === "indeterminate" ? (
          <MinusIcon className="h-4 w-4 stroke-[3]" />
        ) : (
          <CheckIcon className="h-4 w-4 stroke-[3]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
