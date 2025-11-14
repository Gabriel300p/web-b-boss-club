import type { ChangePasswordCredentials } from "../types/auth";
import { useAuthActions, useAuthErrors, useAuthLoadingStates } from "./useAuth";

/**
 * Hook específico para reset password functionality
 * Usa o AuthContext consolidado como fonte única da verdade
 * Integra com sistema de toast e navegação centralizado
 */
export function useResetPasswordAuth() {
  const { resetPassword } = useAuthActions();
  const { isResetPasswordPending } = useAuthLoadingStates();
  const { resetPasswordError } = useAuthErrors();

  return {
    // Actions
    resetPassword: (credentials: ChangePasswordCredentials) =>
      resetPassword(credentials),

    // States
    isLoading: isResetPasswordPending,
    error: resetPasswordError,
  };
}
