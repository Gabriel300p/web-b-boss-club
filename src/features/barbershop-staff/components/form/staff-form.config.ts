/**
 * @fileoverview Staff Form Configuration
 *
 * Configuração centralizada do formulário wizard de Staff (Colaboradores).
 * Este arquivo contém TODA a lógica de configuração, validação e transformação
 * de dados do formulário, servindo como Single Source of Truth.
 *
 * @module staff-form.config
 */

import type { LucideIcon } from "lucide-react";
import {
  BriefcaseIcon,
  CalendarIcon,
  EyeIcon,
  KeyIcon,
  PencilIcon,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { StaffFormMode } from "./StaffForm";
import {
  AdmissionInfoStep,
  BasicDataStep,
  UserAccessStep,
  WorkScheduleStep,
} from "./steps/_index";

/* ============================================================================
 * TYPE DEFINITIONS
 * ========================================================================= */

export interface SidebarHeaderConfig {
  icon: LucideIcon;
  titleKey: string;
  titleDefault: string;
  subtitleKey: string;
  subtitleDefault: string;
}

export interface StepConfig {
  id: number;
  labelKey: string;
  defaultLabel: string;
  icon: LucideIcon;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  hasRequiredFields: boolean;
  validationFields?: string[];
  customValidation?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>,
    mode: StaffFormMode,
  ) => boolean;
}

/* ============================================================================
 * SIDEBAR HEADER CONFIGURATION
 * ========================================================================= */

export const SIDEBAR_HEADER_CONFIGS: Record<
  StaffFormMode,
  SidebarHeaderConfig
> = {
  create: {
    icon: PlusCircleIcon,
    titleKey: "wizard.title",
    titleDefault: "Adicionar novo barbeiro",
    subtitleKey: "wizard.subtitle",
    subtitleDefault: "Preencha os dados do novo colaborador",
  },
  view: {
    icon: EyeIcon,
    titleKey: "modals.staffModal.viewTitle",
    titleDefault: "Visualizar Colaborador",
    subtitleKey: "modals.staffModal.viewSubtitle",
    subtitleDefault: "Informações detalhadas do colaborador",
  },
  edit: {
    icon: PencilIcon,
    titleKey: "modals.staffModal.editTitle",
    titleDefault: "Editar Colaborador",
    subtitleKey: "modals.staffModal.editSubtitle",
    subtitleDefault: "Atualize as informações do colaborador",
  },
};

/* ============================================================================
 * WIZARD STEPS CONFIGURATION
 *
 * Para adicionar/remover steps, modifique este array.
 * O sistema ajusta automaticamente validação, UI e progress bar.
 * ========================================================================= */

export const STAFF_FORM_STEPS: StepConfig[] = [
  // Step 1: Dados Cadastrais (obrigatório)
  {
    id: 1,
    labelKey: "wizard.steps.basicData",
    defaultLabel: "Dados Cadastrais",
    icon: UserIcon,
    component: BasicDataStep,
    hasRequiredFields: true,
    validationFields: ["full_name", "status"],
    customValidation: (form, mode) => {
      const values = form.getValues();
      const cpfValue = values.cpf as string | undefined;
      // CPF obrigatório apenas no create
      if (mode === "edit") {
        return !!(values.full_name && values.status);
      }
      return !!(values.full_name && cpfValue && values.status);
    },
  },

  // Step 2: Informações de Admissão (opcional)
  {
    id: 2,
    labelKey: "wizard.steps.admissionInfo",
    defaultLabel: "Informações de Admissão",
    icon: BriefcaseIcon,
    component: AdmissionInfoStep,
    hasRequiredFields: false,
    validationFields: [],
  },

  // Step 3: Horário de Trabalho (opcional)
  {
    id: 3,
    labelKey: "wizard.steps.workSchedule",
    defaultLabel: "Horário de Trabalho",
    icon: CalendarIcon,
    component: WorkScheduleStep,
    hasRequiredFields: false,
    validationFields: [],
  },

  // Step 4: Acesso do Usuário (obrigatório)
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

/* ============================================================================
 * VALIDATION HELPERS
 * ========================================================================= */

export const hasRequiredFields = (stepId: number): boolean => {
  return (
    STAFF_FORM_STEPS.find((s) => s.id === stepId)?.hasRequiredFields ?? false
  );
};

export const getTotalSteps = (): number => {
  return STAFF_FORM_STEPS.length;
};

export const getValidationFields = (stepId: number): string[] => {
  return STAFF_FORM_STEPS.find((s) => s.id === stepId)?.validationFields ?? [];
};

/* ============================================================================
 * PROGRESS CALCULATION
 * ========================================================================= */

export const getCompletedStepsCount = (
  validationState: Record<number, boolean>,
  visitedSteps: Set<number>,
): number => {
  return STAFF_FORM_STEPS.filter((step) => {
    const hasRequired = step.hasRequiredFields;
    const isValid = validationState[step.id] || false;
    const isVisited = visitedSteps.has(step.id);
    return hasRequired ? isValid : isVisited;
  }).length;
};

export const getProgressPercentage = (
  validationState: Record<number, boolean>,
  visitedSteps: Set<number>,
): number => {
  const completed = getCompletedStepsCount(validationState, visitedSteps);
  const total = getTotalSteps();
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

/* ============================================================================
 * DATA TRANSFORMATION (API ↔ FORM)
 *
 * Funções responsáveis por converter dados entre formato da API e formulário.
 * - READ:   API → Form (transformStaffToFormData)
 * - CREATE: Form → API (transformFormDataToCreate)
 * - UPDATE: Form → API (transformFormDataToUpdate)
 * ========================================================================= */

// Private Helpers (não exportados)
// ---------------------------------

const splitFullName = (fullName: string) => {
  const trimmed = fullName?.trim() || "";
  const parts = trimmed.split(" ");
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" ") || undefined,
  };
};

const cleanString = (value: unknown): string | undefined => {
  const str = (value as string | undefined)?.trim();
  return str || undefined;
};

// Public Transformers
// -------------------

/**
 * Converte dados da API para formato do formulário (READ)
 * @param staffData - Dados do staff vindos da API ou null para valores default
 * @returns Dados formatados para o formulário
 */
export const transformStaffToFormData = (
  staffData: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  if (!staffData) {
    return {
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
      status: "ACTIVE",
      description: "",
    };
  }

  const firstName = staffData.first_name as string;
  const lastName = staffData.last_name as string | null | undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const user = staffData.user as Record<string, unknown> | undefined;
  const cpf = typeof user?.cpf === "string" && user.cpf ? user.cpf : "";
  const email = (user?.email as string | undefined) || "";

  const phone =
    typeof staffData.phone === "string" && staffData.phone
      ? staffData.phone
      : "";
  const description =
    typeof staffData.internal_notes === "string" && staffData.internal_notes
      ? staffData.internal_notes
      : "";

  return {
    full_name: fullName,
    cpf,
    email,
    phone,
    status: staffData.status as string,
    description,
  };
};

/**
 * Converte dados do formulário para criação via API (CREATE)
 * @param data - Dados do formulário
 * @returns Payload formatado para criação
 */
export const transformFormDataToCreate = (data: Record<string, unknown>) => {
  const { first_name, last_name } = splitFullName(data.full_name as string);

  return {
    first_name,
    last_name,
    cpf: data.cpf as string,
    email: cleanString(data.email),
    phone: cleanString(data.phone),
    status: (data.status as string) || "ACTIVE",
  };
};

/**
 * Converte dados do formulário para atualização via API (UPDATE)
 * @param data - Dados do formulário
 * @returns Payload formatado para atualização
 */
export const transformFormDataToUpdate = (data: Record<string, unknown>) => {
  const { first_name, last_name } = splitFullName(data.full_name as string);

  return {
    first_name,
    last_name,
    phone: cleanString(data.phone),
    status: data.status as string,
    internal_notes: cleanString(data.description),
  };
};
