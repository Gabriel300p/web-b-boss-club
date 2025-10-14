import {
  admissionInfoStepSchema,
  basicDataStepSchema,
  getStaffFormDefaults,
  staffApiToFormSchema,
  updateStaffFormInputSchema,
  userAccessStepSchema,
  type BarbershopStaff,
  type CreateStaffFormInput,
} from "@features/barbershop-staff/schemas/barbershop-staff.schemas";
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
import { z } from "zod";
import type { StaffFormMode } from "./StaffForm";
import {
  AdmissionInfoStep,
  BasicDataStep,
  UserAccessStep,
  WorkScheduleStep,
} from "./steps/_index";

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
  validationSchema?: {
    create?: z.ZodSchema;
    edit?: z.ZodSchema;
    view?: z.ZodSchema;
  };
  customValidation?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>,
    mode: StaffFormMode,
  ) => boolean;
}

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

const VALIDATION_FIELD_GROUPS = {
  BASIC_DATA_CREATE: ["full_name", "cpf"] as const,
  BASIC_DATA_EDIT: ["full_name"] as const,
  ADMISSION_INFO: ["status", "unit_ids"] as const,
  USER_ACCESS: ["email"] as const,
} as const;

export const STAFF_FORM_STEPS: StepConfig[] = [
  {
    id: 1,
    labelKey: "wizard.steps.basicData",
    defaultLabel: "Dados Cadastrais",
    icon: UserIcon,
    component: BasicDataStep,
    hasRequiredFields: true,
    validationFields: [...VALIDATION_FIELD_GROUPS.BASIC_DATA_CREATE],
    validationSchema: {
      create: basicDataStepSchema,
      edit: updateStaffFormInputSchema.pick({
        first_name: true,
      }),
    },
  },
  {
    id: 2,
    labelKey: "wizard.steps.admissionInfo",
    defaultLabel: "Informações de Admissão",
    icon: BriefcaseIcon,
    component: AdmissionInfoStep,
    hasRequiredFields: true,
    validationFields: [...VALIDATION_FIELD_GROUPS.ADMISSION_INFO],
    validationSchema: {
      create: admissionInfoStepSchema,
      edit: updateStaffFormInputSchema.pick({
        status: true,
        hire_date: true,
        salary: true,
        commission_rate: true,
        unit_ids: true,
      }),
    },
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
    validationFields: [...VALIDATION_FIELD_GROUPS.USER_ACCESS],
    validationSchema: {
      create: userAccessStepSchema,
      edit: z.object({}),
    },
  },
];

export const transformStaffToFormData = (
  staffData: BarbershopStaff | null | undefined,
): Partial<CreateStaffFormInput> => {
  if (!staffData) {
    return getStaffFormDefaults();
  }
  try {
    return staffApiToFormSchema.parse(staffData);
  } catch (error) {
    // Fallback: se o parse falhar, retorna defaults
    console.warn("Failed to transform staff data, using defaults:", error);
    return getStaffFormDefaults();
  }
};

export const validateStep = (
  stepId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  mode: StaffFormMode,
): boolean => {
  const step = STAFF_FORM_STEPS.find((s) => s.id === stepId);
  if (!step) return true;

  if (step.validationSchema) {
    const schema = step.validationSchema[mode];
    if (schema) {
      const values = form.getValues();
      try {
        schema.parse(values);
        return true;
      } catch {
        return false;
      }
    }
  }

  if (step.customValidation) {
    return step.customValidation(form, mode);
  }

  return !step.hasRequiredFields;
};

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
