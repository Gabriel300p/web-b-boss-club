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

export const STAFF_FORM_STEPS: StepConfig[] = [
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

/* ============================================================================
 * FIELD MAPPING CONFIGURATION (Single Source of Truth)
 * ========================================================================= */

const FIELD_MAPPING = {
  full_name: {
    formField: "full_name",
    defaultValue: "",
    // API → Form: combina first_name + last_name
    fromAPI: (data: Record<string, unknown>) => {
      const firstName = data.first_name as string;
      const lastName = data.last_name as string | null | undefined;
      return [firstName, lastName].filter(Boolean).join(" ");
    },
    // Form → API: divide em first_name e last_name
    toAPI: (value: unknown) => {
      const trimmed = (value as string)?.trim() || "";
      const parts = trimmed.split(" ");
      return {
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || undefined,
      };
    },
  },
  cpf: {
    formField: "cpf",
    defaultValue: "",
    fromAPI: (data: Record<string, unknown>) => {
      const user = data.user as Record<string, unknown> | undefined;
      return typeof user?.cpf === "string" && user.cpf ? user.cpf : "";
    },
    toAPI: (value: unknown) => ({ cpf: value as string }),
  },
  email: {
    formField: "email",
    defaultValue: "",
    fromAPI: (data: Record<string, unknown>) => {
      const user = data.user as Record<string, unknown> | undefined;
      return (user?.email as string | undefined) || "";
    },
    toAPI: (value: unknown, mode: "create" | "update") => {
      // Email só é enviado no create
      if (mode === "create") {
        const str = (value as string | undefined)?.trim();
        return { email: str || undefined };
      }
      return {};
    },
  },
  phone: {
    formField: "phone",
    defaultValue: "",
    fromAPI: (data: Record<string, unknown>) => {
      return typeof data.phone === "string" && data.phone ? data.phone : "";
    },
    toAPI: (value: unknown) => {
      const str = (value as string | undefined)?.trim();
      return { phone: str || undefined };
    },
  },
  status: {
    formField: "status",
    defaultValue: "ACTIVE",
    fromAPI: (data: Record<string, unknown>) => data.status as string,
    toAPI: (value: unknown) => ({ status: (value as string) || "ACTIVE" }),
  },
  description: {
    formField: "description",
    defaultValue: "",
    fromAPI: (data: Record<string, unknown>) => {
      return typeof data.internal_notes === "string" && data.internal_notes
        ? data.internal_notes
        : "";
    },
    toAPI: (value: unknown, mode: "create" | "update") => {
      // Description só é enviado no update como internal_notes
      if (mode === "update") {
        const str = (value as string | undefined)?.trim();
        return { internal_notes: str || undefined };
      }
      return {};
    },
  },
} as const;

export const transformStaffToFormData = (
  staffData: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  if (!staffData) {
    // Return default values from mapping
    return Object.keys(FIELD_MAPPING).reduce(
      (acc, key) => {
        const config = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING];
        acc[config.formField] = config.defaultValue;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  // Transform using fromAPI functions
  return Object.keys(FIELD_MAPPING).reduce(
    (acc, key) => {
      const config = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING];
      acc[config.formField] = config.fromAPI(staffData);
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

export const transformFormDataToCreate = (data: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};

  Object.keys(FIELD_MAPPING).forEach((key) => {
    const config = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING];
    const formValue = data[config.formField];
    const apiData = config.toAPI(formValue, "create");
    Object.assign(result, apiData);
  });

  return result;
};

export const transformFormDataToUpdate = (data: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};

  Object.keys(FIELD_MAPPING).forEach((key) => {
    const config = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING];
    const formValue = data[config.formField];
    const apiData = config.toAPI(formValue, "update");
    Object.assign(result, apiData);
  });

  return result;
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
