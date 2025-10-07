/**
 * 📋 Staff Form Configuration
 * Configuração centralizada para gerenciar steps do formulário
 */

export interface StepConfig {
  id: number;
  hasRequiredFields: boolean;
  validationFields?: string[]; // Campos a serem observados para validação
}

/**
 * 🎯 Configuração dos steps do formulário de Staff
 *
 * Para adicionar/remover steps, basta modificar este array.
 * O sistema ajusta automaticamente validação, cores e progress bar.
 */
export const STAFF_FORM_STEPS: StepConfig[] = [
  {
    id: 1,
    hasRequiredFields: true,
    validationFields: ["full_name", "cpf", "status"],
  },
  {
    id: 2,
    hasRequiredFields: false,
    validationFields: [],
  },
  {
    id: 3,
    hasRequiredFields: false,
    validationFields: [],
  },
  {
    id: 4,
    hasRequiredFields: true,
    validationFields: ["email"],
  },
];

/**
 * 🔍 Helper: Verifica se um step tem campos obrigatórios
 */
export const hasRequiredFields = (stepId: number): boolean => {
  return (
    STAFF_FORM_STEPS.find((s) => s.id === stepId)?.hasRequiredFields ?? false
  );
};

/**
 * 🔍 Helper: Retorna total de steps
 */
export const getTotalSteps = (): number => {
  return STAFF_FORM_STEPS.length;
};

/**
 * 🔍 Helper: Retorna campos de validação de um step
 */
export const getValidationFields = (stepId: number): string[] => {
  return STAFF_FORM_STEPS.find((s) => s.id === stepId)?.validationFields ?? [];
};
