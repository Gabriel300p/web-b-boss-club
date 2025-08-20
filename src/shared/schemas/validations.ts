import z from "zod";

export const strongPasswordSchema = z
  .string()
  .min(10, "Senha deve ter pelo menos 10 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(
    /[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9]/,
    "Senha deve conter pelo menos 6 números",
  )
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial");

// Email validation (50 chars max)
export const emailSchema = z
  .string()
  .email("Email inválido")
  .max(50, "Email não pode exceder 50 caracteres")
  .toLowerCase();
