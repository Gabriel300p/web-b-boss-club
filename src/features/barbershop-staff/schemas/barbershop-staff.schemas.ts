/**
 * 📝 Barbershop Staff Schema Definitions
 * Validation schemas for barbershop staff management
 */
import { emailSchema, nameSchema } from "@shared/schemas/common";
import { cleanCPF, validateCPF } from "@shared/utils/cpf.utils";
import {
  currencyToNumber,
  numberToCurrency,
} from "@shared/utils/currency.utils";
import { dateToISODatetime, isoToDate } from "@shared/utils/date.utils";
import {
  numberToPercentage,
  percentageToNumber,
} from "@shared/utils/percentage.utils";
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

// 🎯 SCHEMA BASE - Define TODOS os campos UMA ÚNICA VEZ com validações completas
// Todos os outros schemas derivam deste usando .pick(), .omit(), .extend(), .partial()
const baseStaffFieldsSchema = z.object({
  // 📋 Campos de identificação e nome
  full_name: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  first_name: nameSchema,
  last_name: z.string(),
  display_name: z.string(),

  // 📋 Campos de contato e documentação
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
  phone: z.string(),

  // 📸 Campo de avatar (opcional - aceita vazio ou URL válida)
  avatar_url: z.union([z.string().url(), z.literal("")]).optional(),

  // 📋 Campos de status e função
  status: staffStatusEnum,
  role_in_shop: userRoleEnum,
  is_available: z.boolean(),

  // 📋 Campos financeiros
  salary: z.number().positive("Salário deve ser positivo"),
  commission_rate: z
    .number()
    .min(0)
    .max(100, "Comissão deve estar entre 0 e 100%"),

  // 📋 Campos de datas e notas
  hire_date: z.string().datetime(),
  terminated_date: z.string().datetime(),
  internal_notes: z.string(),
});

// 📝 Base staff schema (for API responses)
// Usa campos do schema base onde possível
export const barbershopStaffSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  barbershop_id: z.string(),
  first_name: baseStaffFieldsSchema.shape.first_name,
  last_name: baseStaffFieldsSchema.shape.last_name.nullable(),
  display_name: baseStaffFieldsSchema.shape.display_name.nullable(),
  phone: baseStaffFieldsSchema.shape.phone.nullable(),
  role_in_shop: baseStaffFieldsSchema.shape.role_in_shop,
  status: baseStaffFieldsSchema.shape.status,
  salary: baseStaffFieldsSchema.shape.salary.nullable(),
  commission_rate: baseStaffFieldsSchema.shape.commission_rate.nullable(),
  hire_date: baseStaffFieldsSchema.shape.hire_date.nullable(),
  is_available: baseStaffFieldsSchema.shape.is_available,
  internal_notes: baseStaffFieldsSchema.shape.internal_notes.nullable(),
  created_at: z.string(),
  updated_at: z.string(),

  // Related data
  user: z.object({
    id: z.string(),
    email: baseStaffFieldsSchema.shape.email,
    role: userRoleEnum,
    cpf: baseStaffFieldsSchema.shape.cpf.nullable(),
    avatar_url: baseStaffFieldsSchema.shape.avatar_url.nullable(),
  }),
  barbershop: z.object({
    id: z.string(),
    name: z.string(),
  }),

  // 🆕 FASE 2.x - Novos campos de analytics
  units: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        city: z.string(),
        state: z.string(),
        is_primary: z.boolean(),
      }),
    )
    .optional()
    .default([]),
  total_attendances: z.number().optional().default(0),
  average_rating: z.number().nullable().optional(),
  total_revenue: z.number().optional().default(0),
  score: z.number().nullable().optional(), // 🎯 Score de desempenho (0-100)
  _count: z
    .object({
      reviews: z.number().optional(),
    })
    .optional(),
});

// 📝 Schema para criação de staff (formulário)
// Deriva do schema base, apenas selecionando campos necessários + ajustando opcionalidade
export const createStaffFormInputSchema = baseStaffFieldsSchema
  .pick({
    full_name: true,
    cpf: true,
    email: true,
    phone: true,
    status: true,
    internal_notes: true,
    avatar_url: true, // 📸 Avatar URL
    // hire_date: true, // REMOVIDO TEMPORARIAMENTE - aceita string formatada DD/MM/YYYY
    // terminated_date: true, // REMOVIDO TEMPORARIAMENTE
  })
  .extend({
    // Ajusta campos opcionais com defaults
    phone: baseStaffFieldsSchema.shape.phone.optional(),
    status: baseStaffFieldsSchema.shape.status.default("ACTIVE").optional(),
    internal_notes: baseStaffFieldsSchema.shape.internal_notes.optional(),

    // Campos de data aceitam string formatada (DD/MM/YYYY) em vez de datetime ISO
    hire_date: z.string().optional(),
    // terminated_date: z.string().optional(), // COMENTADO - será adicionado depois

    // Campos formatados como string no frontend (serão convertidos para number no transform)
    salary: z.string().optional(),
    commission_rate: z.string().optional(),

    // 🆕 FASE 4 - Campos de unidades (múltiplas)
    unit_ids: z.array(z.string()).optional().default([]),
    primary_unit_id: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se primary_unit_id foi definido, deve estar em unit_ids
      if (data.primary_unit_id && data.unit_ids && data.unit_ids.length > 0) {
        return data.unit_ids.includes(data.primary_unit_id);
      }
      return true;
    },
    {
      message: "Unidade principal deve estar na lista de unidades selecionadas",
      path: ["primary_unit_id"],
    },
  );

// 📝 Form schema for creating staff (com transformação para formato do backend)
// Aceita full_name e transforma automaticamente para o formato do backend
export const createStaffFormSchema = createStaffFormInputSchema.transform(
  (data) => {
    // 🔄 Transformação 1: Dividir full_name em first_name e last_name
    const nameParts = data.full_name.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // 🔄 Transformação 2: Converter strings formatadas para números (apenas se não estiverem vazias)
    const salary =
      data.salary && data.salary.trim()
        ? currencyToNumber(data.salary)
        : undefined;
    const commission_rate =
      data.commission_rate && data.commission_rate.trim()
        ? percentageToNumber(data.commission_rate)
        : undefined;

    // 🔄 Transformação 3: Converter datas DD/MM/YYYY para ISO datetime (YYYY-MM-DDTHH:mm:ss.sssZ) (apenas se não estiverem vazias)
    const hire_date =
      data.hire_date && data.hire_date.trim()
        ? dateToISODatetime(data.hire_date) || undefined
        : undefined;
    // const terminated_date =
    //   data.terminated_date && data.terminated_date.trim()
    //     ? dateToISO(data.terminated_date) || undefined
    //     : undefined;

    // 🔄 Transformação 4: Montar payload no formato esperado pelo backend
    return {
      user: {
        first_name,
        last_name: last_name || undefined,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone || undefined,
        avatar_url: data.avatar_url || undefined, // 📸 Avatar URL
      },
      role_in_shop: "BARBER" as const,
      status: data.status || "ACTIVE",
      is_available: true,
      internal_notes: data.internal_notes || undefined,
      // Campos opcionais avançados (convertidos)
      salary,
      commission_rate,
      hire_date,
      // terminated_date, // COMENTADO TEMPORARIAMENTE
      // 🆕 FASE 4 - Campos de unidades
      unit_ids:
        data.unit_ids && data.unit_ids.length > 0 ? data.unit_ids : undefined,
      primary_unit_id: data.primary_unit_id || undefined,
    };
  },
);

// 📝 Schema de entrada para UPDATE (aceita strings formatadas E full_name)
export const updateStaffFormInputSchema = z
  .object({
    // Aceita full_name OU first_name/last_name separados
    full_name: z.string().optional(),
    first_name: baseStaffFieldsSchema.shape.first_name.optional(),
    last_name: baseStaffFieldsSchema.shape.last_name.optional(),
    display_name: baseStaffFieldsSchema.shape.display_name.optional(),
    phone: baseStaffFieldsSchema.shape.phone.optional(),
    avatar_url: baseStaffFieldsSchema.shape.avatar_url.optional(), // 📸 Avatar URL
    role_in_shop: baseStaffFieldsSchema.shape.role_in_shop.optional(),
    status: baseStaffFieldsSchema.shape.status.optional(),
    is_available: baseStaffFieldsSchema.shape.is_available.optional(),
    internal_notes: baseStaffFieldsSchema.shape.internal_notes.optional(),
    // Campos formatados como string no frontend
    salary: z.string().optional(),
    commission_rate: z.string().optional(),
    hire_date: z.string().optional(),
    // 🆕 FASE 4 - Campos de unidades
    unit_ids: z.array(z.string()).optional(),
    primary_unit_id: z.string().optional(),
  })
  .partial()
  .refine(
    (data) => {
      // Se primary_unit_id foi definido, deve estar em unit_ids
      if (data.primary_unit_id && data.unit_ids && data.unit_ids.length > 0) {
        return data.unit_ids.includes(data.primary_unit_id);
      }
      return true;
    },
    {
      message: "Unidade principal deve estar na lista de unidades selecionadas",
      path: ["primary_unit_id"],
    },
  );

// 📝 Form schema for updating staff (com transformação)
// NOTA: CPF e email são imutáveis
export const updateStaffFormSchema = updateStaffFormInputSchema.transform(
  (data) => {
    // 🔄 Transformação 1: Dividir full_name em first_name e last_name (se full_name existir)
    let first_name = data.first_name;
    let last_name = data.last_name;

    if (data.full_name) {
      const nameParts = data.full_name.trim().split(/\s+/);
      first_name = nameParts[0];
      last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    }

    // 🔄 Transformação 2: Converter strings formatadas para números (apenas se preenchidos)
    const salary =
      data.salary && data.salary.trim()
        ? currencyToNumber(data.salary)
        : undefined;
    const commission_rate =
      data.commission_rate && data.commission_rate.trim()
        ? percentageToNumber(data.commission_rate)
        : undefined;

    // 🔄 Transformação 3: Converter data DD/MM/YYYY para ISO datetime
    const hire_date =
      data.hire_date && data.hire_date.trim()
        ? dateToISODatetime(data.hire_date) || undefined
        : undefined;

    return {
      first_name,
      last_name,
      display_name: data.display_name,
      phone: data.phone,
      avatar_url: data.avatar_url || undefined, // 📸 Avatar URL (empty string → undefined)
      role_in_shop: data.role_in_shop,
      status: data.status,
      is_available: data.is_available,
      internal_notes: data.internal_notes,
      // Campos convertidos
      salary,
      commission_rate,
      hire_date,
      // 🆕 FASE 4 - Campos de unidades
      unit_ids:
        data.unit_ids && data.unit_ids.length > 0 ? data.unit_ids : undefined,
      primary_unit_id: data.primary_unit_id || undefined,
    };
  },
);

// 📝 Schema inverso: API → Form (para edição/visualização)
// Converte dados da API de volta para formato do formulário
// Usa os mesmos tipos do schema base para garantir consistência
export const staffApiToFormSchema = z
  .object({
    first_name: baseStaffFieldsSchema.shape.first_name,
    last_name: baseStaffFieldsSchema.shape.last_name.nullable().optional(),
    phone: baseStaffFieldsSchema.shape.phone.nullable().optional(),
    status: baseStaffFieldsSchema.shape.status,
    internal_notes: baseStaffFieldsSchema.shape.internal_notes
      .nullable()
      .optional(),
    // Campos financeiros e de data vêm como number/datetime do backend
    salary: z.number().nullable().optional(),
    commission_rate: z.number().nullable().optional(),
    hire_date: z.string().datetime().nullable().optional(),
    user: z
      .object({
        cpf: baseStaffFieldsSchema.shape.cpf.nullable().optional(),
        email: baseStaffFieldsSchema.shape.email.optional(),
        avatar_url: baseStaffFieldsSchema.shape.avatar_url
          .nullable()
          .optional(), // 📸 Avatar URL (aceita null da API)
      })
      .optional(),
    // 🆕 FASE 4 - Unidades vêm da API como array
    units: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          city: z.string(),
          state: z.string(),
          is_primary: z.boolean(),
        }),
      )
      .optional(),
  })
  .transform((data): Partial<z.infer<typeof createStaffFormInputSchema>> => {
    // 🔄 Extrair unit_ids e primary_unit_id do array units
    const unit_ids = data.units?.map((u) => u.id) || [];
    const primary_unit_id = data.units?.find((u) => u.is_primary)?.id;

    return {
      // ✅ Retorna no formato dos campos base (form format)
      // Garante type-safety referenciando o schema de input
      full_name: [data.first_name, data.last_name].filter(Boolean).join(" "),
      cpf: data.user?.cpf || "",
      email: data.user?.email || "",
      phone: data.phone || "",
      avatar_url: data.user?.avatar_url || "", // 📸 Avatar URL
      status: data.status,
      internal_notes: data.internal_notes || "",

      // 🔄 Converte dados do backend (number/datetime) → frontend (string formatada)
      salary: data.salary ? numberToCurrency(data.salary) : "",
      commission_rate: data.commission_rate
        ? numberToPercentage(data.commission_rate)
        : "",
      hire_date: data.hire_date ? isoToDate(data.hire_date) : "",

      // 🆕 FASE 4 - Unidades
      unit_ids,
      primary_unit_id,
    };
  });

// 📋 Schemas por step (para validação granular)
export const basicDataStepSchema = createStaffFormInputSchema.pick({
  full_name: true,
  cpf: true,
  phone: true,
  internal_notes: true,
});

export const admissionInfoStepSchema = createStaffFormInputSchema
  .pick({
    status: true,
    hire_date: true,
    // terminated_date: true, // TEMPORARIAMENTE COMENTADO
    salary: true,
    commission_rate: true,
  })
  .extend({
    // Ajusta campos opcionais (salary e commission_rate já são strings no createStaffFormInputSchema)
    hire_date: baseStaffFieldsSchema.shape.hire_date.optional(),
    // terminated_date: baseStaffFieldsSchema.shape.terminated_date.optional(), // TEMPORARIAMENTE COMENTADO
  });
// VALIDAÇÕES TEMPORARIAMENTE COMENTADAS
// .refine(
//   (data) => {
//     // Se status é TERMINATED, terminated_date é obrigatório
//     if (data.status === "TERMINATED") {
//       return !!data.terminated_date;
//     }
//     return true;
//   },
//   {
//     message: "Data de demissão é obrigatória quando o status é 'Demitido'",
//     path: ["terminated_date"],
//   },
// )
// .refine(
//   (data) => {
//     // Se ambas as datas existem, terminated_date deve ser maior que hire_date
//     if (data.hire_date && data.terminated_date) {
//       const hireDate = new Date(data.hire_date);
//       const terminatedDate = new Date(data.terminated_date);
//       return terminatedDate > hireDate;
//     }
//     return true;
//   },
//   {
//     message: "Data de demissão deve ser posterior à data de admissão",
//     path: ["terminated_date"],
//   },
// );

export const userAccessStepSchema = createStaffFormInputSchema.pick({
  email: true,
});

// 🔍 Filters schema for staff queries
// Usa campos do schema base para filtros
export const staffFiltersSchema = z.object({
  // Basic filters
  status: baseStaffFieldsSchema.shape.status.optional(),
  is_available: baseStaffFieldsSchema.shape.is_available.optional(),
  barbershop_id: z.string().optional(),
  role_in_shop: baseStaffFieldsSchema.shape.role_in_shop.optional(),

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
// ✅ Define valores padrão em um único lugar
export const getStaffFormDefaults = (): Partial<CreateStaffFormInput> => {
  // Retorna valores padrão sem validação (para formulário vazio)
  // Estrutura baseada nos campos do createStaffFormInputSchema
  return {
    full_name: "",
    cpf: "",
    email: "",
    phone: "",
    avatar_url: "", // 📸 Avatar URL (vazio por padrão)
    status: "ACTIVE", // Default do schema
    internal_notes: "",
  } satisfies Partial<CreateStaffFormInput>; // ✅ Type-safe
};
