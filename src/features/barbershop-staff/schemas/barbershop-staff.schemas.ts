/**
 * 📝 Barbershop Staff Schema Definitions
 * Validation schemas for barbershop staff management
 */
import { emailSchema, nameSchema } from "@shared/schemas/common";
import { cleanCPF, validateCPF } from "@shared/utils/cpf.utils";
import { z } from "zod";

// 🏷️ Enum definitions matching backend
export const staffStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "TERMINATED",
]);

export const userRoleEnum = z.enum([
  "SUPER_ADMIN",
  "BARBERSHOP_OWNER",
  "BARBER",
  "CLIENT",
  "PENDING",
]);

// 📝 Base staff schema (for responses)
export const barbershopStaffSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  barbershop_id: z.string(),
  first_name: z.string(),
  last_name: z
    .union([z.string(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  display_name: z
    .union([z.string(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  phone: z
    .union([z.string(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  role_in_shop: userRoleEnum,
  status: staffStatusEnum,
  salary: z
    .union([z.number(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  commission_rate: z
    .union([z.number(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  hire_date: z
    .union([z.string(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  is_available: z.boolean(),
  internal_notes: z
    .union([z.string(), z.null(), z.object({})])
    .transform((val) =>
      val && typeof val === "object" && Object.keys(val).length === 0
        ? null
        : val,
    ),
  created_at: z.string(),
  updated_at: z.string(),

  // Related data
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: userRoleEnum,
    cpf: z
      .union([z.string(), z.null(), z.object({})])
      .transform((val) =>
        val && typeof val === "object" && Object.keys(val).length === 0
          ? null
          : val,
      ),
  }),
  barbershop: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

// 📝 Base form input schema (antes da transformação - para validação de formulário)
export const createStaffFormInputSchema = z.object({
  // 📋 Campos do formulário (user-friendly)
  full_name: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(
      (val) => {
        const cleaned = cleanCPF(val);
        return cleaned.length === 11;
      },
      {
        message: "CPF deve ter 11 dígitos",
      },
    )
    .refine(
      (val) => {
        return validateCPF(val);
      },
      {
        message: "CPF inválido. Verifique os dígitos digitados",
      },
    ),
  email: emailSchema,
  phone: z.string().optional(),
  status: staffStatusEnum.default("ACTIVE").optional(),
  internal_notes: z.string().optional(),

  // 📋 Campos opcionais avançados (para futuras expansões)
  salary: z.number().positive("Salário deve ser positivo").optional(),
  commission_rate: z
    .number()
    .min(0)
    .max(100, "Comissão deve estar entre 0 e 100%")
    .optional(),
  hire_date: z.string().datetime().optional(),
});

// 📝 Form schema for creating staff (com transformação para formato do backend)
// Aceita full_name e transforma automaticamente para o formato do backend
export const createStaffFormSchema = createStaffFormInputSchema.transform(
  (data) => {
    // 🔄 Transformação 1: Dividir full_name em first_name e last_name
    const nameParts = data.full_name.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // 🔄 Transformação 2: Montar payload no formato esperado pelo backend
    return {
      user: {
        first_name,
        last_name: last_name || undefined,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone || undefined,
      },
      role_in_shop: "BARBER" as const,
      status: data.status || "ACTIVE",
      is_available: true,
      internal_notes: data.internal_notes || undefined,
      // Campos opcionais avançados
      salary: data.salary,
      commission_rate: data.commission_rate,
      hire_date: data.hire_date,
    };
  },
);

// 📝 Form schema for updating staff
export const updateStaffFormSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: z.string().optional(),
  display_name: z.string().optional(),
  phone: z.string().optional(),
  role_in_shop: userRoleEnum.optional(),
  status: staffStatusEnum.optional(),
  salary: z.number().positive().optional(),
  commission_rate: z.number().min(0).max(100).optional(),
  hire_date: z.string().datetime().optional(),
  is_available: z.boolean().optional(),
  internal_notes: z.string().optional(),
});

// � Schema inverso: API → Form (para edição/visualização)
// Converte dados da API de volta para formato do formulário
export const staffApiToFormSchema = z
  .object({
    first_name: z.string(),
    last_name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    status: staffStatusEnum,
    internal_notes: z.string().nullable().optional(),
    user: z
      .object({
        cpf: z.string().optional(),
        email: z.string().optional(),
      })
      .optional(),
  })
  .transform((data) => ({
    full_name: [data.first_name, data.last_name].filter(Boolean).join(" "),
    cpf: data.user?.cpf || "",
    email: data.user?.email || "",
    phone: data.phone || "",
    status: data.status,
    internal_notes: data.internal_notes || "",
  }));

// 📋 Schemas por step (para validação granular)
export const basicDataStepSchema = createStaffFormInputSchema.pick({
  full_name: true,
  cpf: true,
  status: true,
  phone: true,
  internal_notes: true,
});

export const userAccessStepSchema = createStaffFormInputSchema.pick({
  email: true,
});

// �🔍 Filters schema for staff queries
export const staffFiltersSchema = z.object({
  // Basic filters
  status: staffStatusEnum.optional(),
  is_available: z.boolean().optional(),
  barbershop_id: z.string().optional(),
  role_in_shop: userRoleEnum.optional(),

  // Advanced filters
  search: z.string().optional(),
  hired_after: z.string().datetime().optional(),
  hired_before: z.string().datetime().optional(),
  available_for_booking: z.boolean().optional(),

  // Pagination and sorting
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort_by: z.enum(["name", "hire_date", "status", "created_at"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

// 📄 Response schemas
export const createStaffResponseSchema = z.object({
  staff: barbershopStaffSchema,
  generated_password: z.string().optional(),
});

export const staffListResponseSchema = z.object({
  data: z.array(barbershopStaffSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
  meta: z.object({
    has_data: z.boolean(),
    is_filtered: z.boolean(),
    applied_filters: z.array(z.string()).optional(),
    result_status: z.enum([
      "success_with_data",
      "success_empty_filtered",
      "success_empty_no_staff",
      "success_empty_no_access",
    ]),
    message: z.string().optional(),
  }),
  statistics: z.object({
    total_active: z.number(),
    total_inactive: z.number(),
    total_suspended: z.number(),
    total_terminated: z.number(),
    available_now: z.number(),
    total_barbers: z.number(),
    total_owners: z.number(),
    avg_tenure_days: z.number(),
    turnover_rate_30d: z.number(),
  }),
});

export const staffStatsResponseSchema = z.object({
  general_stats: z.object({
    total_active: z.number(),
    total_inactive: z.number(),
    total_suspended: z.number(),
    total_terminated: z.number(),
    available_now: z.number(),
  }),
  role_distribution: z.object({
    total_barbers: z.number(),
    total_owners: z.number(),
    total_other: z.number(),
  }),
  performance_metrics: z.object({
    avg_tenure_days: z.number(),
    turnover_rate_30d: z.number(),
    hire_rate_30d: z.number(),
  }),
  availability_metrics: z.object({
    availability_percentage: z.number(),
    active_and_available: z.number(),
  }),
});

// 🔧 Type definitions
export type BarbershopStaff = z.infer<typeof barbershopStaffSchema>;
export type CreateStaffFormInput = z.infer<typeof createStaffFormInputSchema>;
export type CreateStaffFormData = z.infer<typeof createStaffFormSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffFormSchema>;
export type StaffFilters = z.infer<typeof staffFiltersSchema>;
export type CreateStaffResponse = z.infer<typeof createStaffResponseSchema>;
export type StaffListResponse = z.infer<typeof staffListResponseSchema>;
export type StaffStatsResponse = z.infer<typeof staffStatsResponseSchema>;
export type StaffStatus = z.infer<typeof staffStatusEnum>;
export type UserRole = z.infer<typeof userRoleEnum>;

// 🔧 Utility: Extrair defaults do schema automaticamente
export const getStaffFormDefaults = (): Partial<CreateStaffFormInput> => {
  // Retorna valores padrão sem validação (para formulário vazio)
  return {
    full_name: "",
    cpf: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    internal_notes: "",
  };
};
