/**
 * 🎯 Hook: useStepNavigation
 * Hook genérico para gerenciar navegação entre steps em formulários wizard
 *
 * @example
 * const { goToNext, goToPrevious, goToStep, isFirstStep, isLastStep } = useStepNavigation({
 *   currentStep: 1,
 *   totalSteps: 4,
 *   onStepChange: (step) => setCurrentStep(step)
 * });
 */

import { useCallback, useMemo } from "react";

interface UseStepNavigationOptions {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

interface UseStepNavigationReturn {
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const useStepNavigation = ({
  currentStep,
  totalSteps,
  onStepChange,
}: UseStepNavigationOptions): UseStepNavigationReturn => {
  // ✅ Memoiza cálculos de posição
  const isFirstStep = useMemo(() => currentStep === 1, [currentStep]);
  const isLastStep = useMemo(
    () => currentStep === totalSteps,
    [currentStep, totalSteps],
  );
  const canGoNext = useMemo(() => !isLastStep, [isLastStep]);
  const canGoPrevious = useMemo(() => !isFirstStep, [isFirstStep]);

  // ✅ Memoiza handlers para evitar recriações desnecessárias
  const goToNext = useCallback(() => {
    if (canGoNext) {
      onStepChange(currentStep + 1);
    }
  }, [currentStep, canGoNext, onStepChange]);

  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, canGoPrevious, onStepChange]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        onStepChange(step);
      }
    },
    [totalSteps, onStepChange],
  );

  return {
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrevious,
  };
};
