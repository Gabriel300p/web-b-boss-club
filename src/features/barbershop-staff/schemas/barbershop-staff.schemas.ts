/**
 * 📝 Barbershop Staff Schema Definitions
 * Validation schemas for barbershop staff management
 */
import { emailSchema, nameSchema } from "@shared/schemas/common";
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
  }),
  barbershop: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

// 📝 Form schema for creating staff
export const createStaffFormSchema = z.object({
  barbershop_id: z.string().min(1, "ID da barbearia é obrigatório"),
  user: z.object({
    email: emailSchema,
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .optional(),
    first_name: nameSchema,
    last_name: z.string().optional(),
    display_name: z.string().optional(),
    cpf: z.string().min(1, "CPF é obrigatório"),
    phone: z.string().optional(),
    is_foreigner: z.boolean().default(false).optional(),
  }),
  role_in_shop: userRoleEnum.default("BARBER"),
  status: staffStatusEnum.default("ACTIVE").optional(),
  salary: z.number().positive("Salário deve ser positivo").optional(),
  commission_rate: z
    .number()
    .min(0)
    .max(100, "Comissão deve estar entre 0 e 100%")
    .optional(),
  hire_date: z.string().datetime().optional(),
  is_available: z.boolean().default(true).optional(),
  internal_notes: z.string().optional(),
});

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

// 🔍 Filters schema for staff queries
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
export type CreateStaffFormData = z.infer<typeof createStaffFormSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffFormSchema>;
export type StaffFilters = z.infer<typeof staffFiltersSchema>;
export type CreateStaffResponse = z.infer<typeof createStaffResponseSchema>;
export type StaffListResponse = z.infer<typeof staffListResponseSchema>;
export type StaffStatsResponse = z.infer<typeof staffStatsResponseSchema>;
export type StaffStatus = z.infer<typeof staffStatusEnum>;
export type UserRole = z.infer<typeof userRoleEnum>;
