import { z } from "zod";

// Schema para informações da barbearia (Etapa 1) - APENAS OBRIGATÓRIOS
export const barbershopInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da barbearia é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
});

// Schema para informações do usuário (Etapa 2) - APENAS OBRIGATÓRIOS
export const userInfoSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(100, "Email deve ter no máximo 100 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 caracteres")
    .regex(/^[0-9.-]+$/, "CPF deve conter apenas números, pontos e hífens"),
  isforeigner: z.boolean(),
  terms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
});

// Schema completo para criação da barbearia
export const createBarbershopSchema = z.object({
  barbershop: barbershopInfoSchema,
  owner: userInfoSchema,
});

// Types inferidos dos schemas
export type BarbershopInfoFormData = z.infer<typeof barbershopInfoSchema>;
export type UserInfoFormData = z.infer<typeof userInfoSchema>;
export type CreateBarbershopFormData = z.infer<typeof createBarbershopSchema>;
