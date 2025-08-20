import { z } from "zod";

// Common field schemas
export const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email deve ter um formato válido");

export const passwordSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .min(6, "Senha deve ter pelo menos 6 caracteres")
  .max(100, "Senha deve ter no máximo 100 caracteres");

export const nameSchema = z
  .string()
  .min(1, "Nome é obrigatório")
  .max(100, "Nome deve ter no máximo 100 caracteres")
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços");

export const idSchema = z.string().uuid("ID deve ser um UUID válido");

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
