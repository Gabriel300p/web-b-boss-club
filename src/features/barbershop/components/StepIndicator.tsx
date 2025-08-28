import { Check } from "@phosphor-icons/react";
import { cn } from "@shared/lib/utils";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
  className,
}: StepIndicatorProps) {
  return (
    <div
      className={cn("flex items-center justify-center space-x-4", className)}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <motion.div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                {
                  "border-primary bg-primary text-primary-foreground":
                    isCompleted,
                  "border-primary bg-primary/20 text-primary": isCurrent,
                  "border-muted-foreground/30 text-muted-foreground": isPending,
                },
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </motion.div>

            {/* Step Label */}
            <motion.span
              className={cn(
                "ml-3 text-sm font-medium transition-colors duration-300",
                {
                  "text-primary": isCompleted || isCurrent,
                  "text-muted-foreground": isPending,
                },
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
            >
              {step}
            </motion.span>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <motion.div
                className={cn("mx-4 h-0.5 w-8 transition-colors duration-300", {
                  "bg-primary": isCompleted,
                  "bg-muted-foreground/30": !isCompleted,
                })}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
