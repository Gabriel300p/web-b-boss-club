import { emailSchema, passwordSchema } from "@shared/schemas/common";
import { z } from "zod";

export const loginSchema = z.object({
  email: emailSchema.max(100, "Email deve ter no máximo 100 caracteres"),
  password: passwordSchema.max(50, "Senha deve ter no máximo 50 caracteres"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema.max(100, "Email deve ter no máximo 100 caracteres"),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema.max(50, "Senha deve ter no máximo 50 caracteres"),
    confirmPassword: passwordSchema.max(
      50,
      "Confirmar senha deve ter no máximo 50 caracteres",
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export const mfaVerificationSchema = z.object({
  email: emailSchema.max(100, "Email deve ter no máximo 100 caracteres"),
  code: z
    .string()
    .min(8, "Código deve ter 8 caracteres")
    .max(8, "Código deve ter 8 caracteres"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    email: emailSchema.max(100, "Email deve ter no máximo 100 caracteres"),
    password: passwordSchema.max(50, "Senha deve ter no máximo 50 caracteres"),
    confirmPassword: passwordSchema.max(
      50,
      "Confirmar senha deve ter no máximo 50 caracteres",
    ),
    terms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
