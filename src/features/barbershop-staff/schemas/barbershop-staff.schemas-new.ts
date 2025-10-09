/**
 *  Barbershop Staff Schema Definitions
 * Validation schemas for barbershop staff management
 */
import { emailSchema, nameSchema } from "@shared/schemas/common";
import { cleanCPF, validateCPF } from "@shared/utils/cpf.utils";
import { z } from "zod";

//  Enum definitions matching backend
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

//  SCHEMA BASE - Define TODOS os campos UMA ÚNICA VEZ com validações completas
// Todos os outros schemas derivam deste usando .pick(), .omit(), .extend(), .partial()
const baseStaffFieldsSchema = z.object({
  //  Campos de identificação e nome
  full_name: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  
  first_name: nameSchema,
  last_name: z.string(),
  display_name: z.string(),
  
  //  Campos de contato e documentação
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
  
  //  Campos de status e função
  status: staffStatusEnum,
  role_in_shop: userRoleEnum,
  is_available: z.boolean(),
  
  //  Campos financeiros
  salary: z.number().positive("Salário deve ser positivo"),
  commission_rate: z
    .number()
    .min(0)
    .max(100, "Comissão deve estar entre 0 e 100%"),
  
  //  Campos de datas e notas
  hire_date: z.string().datetime(),
  internal_notes: z.string(),
});

//  Schema para criação de staff (formulário)
// Deriva do schema base, apenas selecionando campos necessários + ajustando opcionalidade
export const createStaffFormInputSchema = baseStaffFieldsSchema
  .pick({
    full_name: true,
    cpf: true,
    email: true,
    phone: true,
    status: true,
    internal_notes: true,
    salary: true,
    commission_rate: true,
    hire_date: true,
  })
  .extend({
    // Ajusta campos opcionais com defaults
    phone: baseStaffFieldsSchema.shape.phone.optional(),
    status: baseStaffFieldsSchema.shape.status.default("ACTIVE").optional(),
    internal_notes: baseStaffFieldsSchema.shape.internal_notes.optional(),
    salary: baseStaffFieldsSchema.shape.salary.optional(),
    commission_rate: baseStaffFieldsSchema.shape.commission_rate.optional(),
    hire_date: baseStaffFieldsSchema.shape.hire_date.optional(),
  });
