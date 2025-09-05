import { z } from "zod";

/**
 * 🔐 Centralized Password Validation Schema (Frontend)
 * Uses backend configuration when available, falls back to defaults
 */

// Default configuration (matches backend defaults)
const DEFAULT_PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 50,
  strongMinLength: 10,
} as const;

// Factory function to create password schemas with configurable length
export const createPasswordSchema = (
  minLength: number = DEFAULT_PASSWORD_CONFIG.minLength,
) =>
  z
    .string()
    .min(1, "Senha é obrigatória")
    .min(minLength, `Senha deve ter pelo menos ${minLength} caracteres`)
    .max(
      DEFAULT_PASSWORD_CONFIG.maxLength,
      `Senha deve ter no máximo ${DEFAULT_PASSWORD_CONFIG.maxLength} caracteres`,
    );

// Standard password schema (8 chars minimum)
export const passwordSchema = createPasswordSchema();

// Strong password schema for registration (10 chars minimum + complexity)
export const strongPasswordSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .min(
    DEFAULT_PASSWORD_CONFIG.strongMinLength,
    `Senha deve ter pelo menos ${DEFAULT_PASSWORD_CONFIG.strongMinLength} caracteres`,
  )
  .max(
    DEFAULT_PASSWORD_CONFIG.maxLength,
    `Senha deve ter no máximo ${DEFAULT_PASSWORD_CONFIG.maxLength} caracteres`,
  )
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial");

// Change password schema (8 chars minimum + complexity)
export const changePasswordSchema = z
  .string()
  .min(1, "Nova senha é obrigatória")
  .min(
    DEFAULT_PASSWORD_CONFIG.minLength,
    `Senha deve ter pelo menos ${DEFAULT_PASSWORD_CONFIG.minLength} caracteres`,
  )
  .max(
    DEFAULT_PASSWORD_CONFIG.maxLength,
    `Senha deve ter no máximo ${DEFAULT_PASSWORD_CONFIG.maxLength} caracteres`,
  )
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial");

// Export configuration
export const passwordConfig = DEFAULT_PASSWORD_CONFIG;
