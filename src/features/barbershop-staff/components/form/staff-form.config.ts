import {
  createStaffMinimalFormSchema,
  updateStaffFormSchema,
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

export const FIELDS = {
  full_name: { defaultValue: "" },
  cpf: { defaultValue: "" },
  email: { defaultValue: "" },
  phone: { defaultValue: "" },
  status: { defaultValue: "ACTIVE" as const },
  internal_notes: { defaultValue: "" },
} as const;

export type FormFieldName = keyof typeof FIELDS;

export interface StaffAPIData {
  first_name: string;
  last_name: string | null | undefined;
  phone: string | null | undefined;
  status: string;
  internal_notes: string | null | undefined;
  user?: {
    cpf?: string;
    email?: string;
  };
}
export interface StaffAPIPayload {
  first_name?: string;
  last_name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  status?: string;
  internal_notes?: string;
}

const FieldTransformers = {
  splitFullName: (
    fullName: string,
  ): Pick<StaffAPIPayload, "first_name" | "last_name"> => {
    const trimmed = fullName.trim();
    if (!trimmed) return { first_name: "", last_name: undefined };

    const parts = trimmed.split(" ");
    return {
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || undefined,
    };
  },

  joinFullName: (firstName: string, lastName?: string | null): string => {
    return [firstName, lastName].filter(Boolean).join(" ");
  },

  extractUserField: <T>(
    data: StaffAPIData,
    field: keyof NonNullable<StaffAPIData["user"]>,
  ): T | "" => {
    const user = data.user;
    const value = user?.[field];
    return (value as T) || ("" as T);
  },

  cleanOptionalString: (value: unknown): string | undefined => {
    const str = (value as string | undefined)?.trim();
    return str || undefined;
  },

  getNullableString: (value: unknown): string => {
    return typeof value === "string" && value ? value : "";
  },
} as const;

interface FieldMappingConfig {
  defaultValue: string;
  fromAPI: (data: StaffAPIData) => string;
  toAPI: (value: string, mode: "create" | "update") => Partial<StaffAPIPayload>;
}

const FIELD_MAPPING: Record<FormFieldName, FieldMappingConfig> = {
  full_name: {
    defaultValue: FIELDS.full_name.defaultValue,
    fromAPI: (data) =>
      FieldTransformers.joinFullName(data.first_name, data.last_name),
    toAPI: (value) => FieldTransformers.splitFullName(value),
  },

  cpf: {
    defaultValue: FIELDS.cpf.defaultValue,
    fromAPI: (data) => FieldTransformers.extractUserField<string>(data, "cpf"),
    toAPI: (value) => ({ cpf: value }),
  },

  email: {
    defaultValue: FIELDS.email.defaultValue,
    fromAPI: (data) =>
      FieldTransformers.extractUserField<string>(data, "email"),
    toAPI: (value, mode) => {
      // Email só enviado no create
      if (mode === "create") {
        return { email: FieldTransformers.cleanOptionalString(value) };
      }
      return {};
    },
  },

  phone: {
    defaultValue: FIELDS.phone.defaultValue,
    fromAPI: (data) => FieldTransformers.getNullableString(data.phone),
    toAPI: (value) => ({ phone: FieldTransformers.cleanOptionalString(value) }),
  },

  status: {
    defaultValue: FIELDS.status.defaultValue,
    fromAPI: (data) => data.status,
    toAPI: (value) => ({ status: value || "ACTIVE" }),
  },

  internal_notes: {
    defaultValue: FIELDS.internal_notes.defaultValue,
    fromAPI: (data) => FieldTransformers.getNullableString(data.internal_notes),
    toAPI: (value) => ({ 
      internal_notes: FieldTransformers.cleanOptionalString(value) 
    }),
  },
};

const VALIDATION_FIELD_GROUPS = {
  BASIC_DATA_CREATE: [
    "full_name",
    "cpf",
    "status",
  ] as const satisfies ReadonlyArray<FormFieldName>,
  BASIC_DATA_EDIT: [
    "full_name",
    "status",
  ] as const satisfies ReadonlyArray<FormFieldName>,
  USER_ACCESS: ["email"] as const satisfies ReadonlyArray<FormFieldName>,
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
      create: createStaffMinimalFormSchema.pick({
        full_name: true,
        cpf: true,
        status: true,
      }),
      edit: updateStaffFormSchema.pick({
        first_name: true,
        status: true,
      }),
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
    validationFields: [...VALIDATION_FIELD_GROUPS.USER_ACCESS],
    validationSchema: {
      create: createStaffMinimalFormSchema.pick({ email: true }),
      edit: z.object({}), // No validation on edit
    },
  },
];

const createTransformer = (mode: "create" | "update") => {
  return (data: Record<string, unknown>): Record<string, unknown> => {
    return Object.keys(FIELD_MAPPING).reduce(
      (result, key) => {
        const fieldName = key as FormFieldName;
        const config = FIELD_MAPPING[fieldName];
        const formValue = data[fieldName] as string;
        const apiData = config.toAPI(formValue, mode);
        return { ...result, ...apiData };
      },
      {} as Record<string, unknown>,
    );
  };
};

export const transformStaffToFormData = (
  staffData: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  if (!staffData) {
    return Object.keys(FIELD_MAPPING).reduce(
      (acc, key) => {
        const fieldName = key as FormFieldName;
        const config = FIELD_MAPPING[fieldName];
        acc[fieldName] = config.defaultValue;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return Object.keys(FIELD_MAPPING).reduce(
    (acc, key) => {
      const fieldName = key as FormFieldName;
      const config = FIELD_MAPPING[fieldName];
      acc[fieldName] = config.fromAPI(staffData as unknown as StaffAPIData);
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

export const transformFormDataToCreate = createTransformer("create");
export const transformFormDataToUpdate = createTransformer("update");

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
