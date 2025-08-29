import { z } from "zod";

// Schema para roles do usuário baseado no Prisma
export const userRoleSchema = z.enum([
  "SUPER_ADMIN",
  "BARBERSHOP_OWNER",
  "BARBER",
  "CLIENT",
  "PENDING",
]);

export const userStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "TERMINATED",
  "PENDING",
]);

// Schema para login com credential (email ou CPF)
export const loginSchema = z.object({
  credential: z
    .string()
    .min(1, "Email ou CPF é obrigatório")
    .max(100, "Email ou CPF deve ter no máximo 100 caracteres"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .max(50, "Senha deve ter no máximo 50 caracteres"),
});

// Schema para verificação MFA (6 dígitos numéricos)
export const mfaVerificationSchema = z.object({
  code: z
    .string()
    .min(6, "Código deve ter 6 dígitos")
    .max(6, "Código deve ter 6 dígitos")
    .regex(/^\d{6}$/, "Código deve conter apenas 6 dígitos numéricos"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(100, "Email deve ter no máximo 100 caracteres"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres"),
    confirmPassword: z
      .string()
      .min(1, "Confirmar senha é obrigatório")
      .min(8, "Confirmar senha deve ter pelo menos 8 caracteres")
      .max(50, "Confirmar senha deve ter no máximo 50 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema para mudança de senha com validação forte
export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Nova senha é obrigatória")
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "Senha deve conter pelo menos um caractere especial",
      ),
    confirmPassword: z.string().min(1, "Confirmar senha é obrigatório"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido")
      .max(100, "Email deve ter no máximo 100 caracteres"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres"),
    confirmPassword: z
      .string()
      .min(1, "Confirmar senha é obrigatório")
      .min(8, "Confirmar senha deve ter pelo menos 8 caracteres")
      .max(50, "Confirmar senha deve ter no máximo 50 caracteres"),
    terms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type MfaVerificationFormData = z.infer<typeof mfaVerificationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
