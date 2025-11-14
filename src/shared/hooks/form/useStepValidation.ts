/**
 * 🎯 Hook: useStepValidation
 * Hook genérico para validação de steps em formulários wizard
 *
 * @example
 * const isStepValid = useStepValidation(form, mode, STAFF_FORM_STEPS);
 * const isValid = isStepValid(1); // true ou false
 */

import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { StaffFormMode } from "../../../features/barbershop-staff/components/form/StaffForm";
import type { StepConfig } from "../../../features/barbershop-staff/components/form/staff-form.config";

export const useStepValidation = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>, // Genérico para funcionar com qualquer tipo de formulário
  mode: StaffFormMode,
  config: StepConfig[],
) => {
  // ✅ Memoiza a função de validação para evitar recriações desnecessárias
  return useMemo(() => {
    return (stepId: number): boolean => {
      const step = config.find((s) => s.id === stepId);
      if (!step) return false;

      // Steps sem campos obrigatórios são sempre válidos
      if (!step.hasRequiredFields) return true;

      // ✅ Prioriza validação customizada (se existir)
      if (step.customValidation) {
        return step.customValidation(form, mode);
      }

      // ✅ Validação genérica baseada nos campos configurados
      const { validationFields = [] } = step;

      return validationFields.every((field) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = form.getValues(field as any);
        return !!value; // Campo preenchido = válido
      });
    };
  }, [form, mode, config]);
};
