/**
 * 📋 Staff Form Configuration
 * Configuração centralizada para gerenciar steps do formulário
 */

import type { LucideIcon } from "lucide-react";
import { BriefcaseIcon, CalendarIcon, KeyIcon, UserIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { StaffFormMode } from "./StaffForm";
import {
  AdmissionInfoStep,
  BasicDataStep,
  UserAccessStep,
  WorkScheduleStep,
} from "./steps";

export interface StepConfig {
  id: number;
  labelKey: string; // Chave de tradução
  defaultLabel: string; // Label fallback
  icon: LucideIcon; // Ícone do step
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>; // Componente do step (genérico para reutilização)
  hasRequiredFields: boolean;
  validationFields?: string[]; // Campos a serem observados para validação
  customValidation?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>, // Genérico para reutilização em diferentes formulários
    mode: StaffFormMode,
  ) => boolean; // Validação customizada (opcional)
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
    labelKey: "wizard.steps.basicData",
    defaultLabel: "Dados Cadastrais",
    icon: UserIcon,
    component: BasicDataStep,
    hasRequiredFields: true,
    validationFields: ["full_name", "status"],
    // ✅ Validação customizada para CPF (obrigatório apenas no create)
    customValidation: (form, mode) => {
      const values = form.getValues();
      const cpfValue = values.cpf as string | undefined;
      const isEditMode = mode === "edit";

      // No edit, CPF é opcional
      if (isEditMode) {
        return !!(values.full_name && values.status);
      }

      // No create, CPF é obrigatório
      return !!(values.full_name && cpfValue && values.status);
    },
  },
  {
    id: 2,
    labelKey: "wizard.steps.admissionInfo",
    defaultLabel: "Informações de Admissão",
    icon: BriefcaseIcon,
    component: AdmissionInfoStep,
    hasRequiredFields: false,
    validationFields: [],
  },
  {
    id: 3,
    labelKey: "wizard.steps.workSchedule",
    defaultLabel: "Horário de Trabalho",
    icon: CalendarIcon,
    component: WorkScheduleStep,
    hasRequiredFields: false,
    validationFields: [],
  },
  {
    id: 4,
    labelKey: "wizard.steps.userAccess",
    defaultLabel: "Acesso do Usuário",
    icon: KeyIcon,
    component: UserAccessStep,
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
