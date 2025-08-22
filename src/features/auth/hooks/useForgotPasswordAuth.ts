import type { ForgotPasswordCredentials } from "../types/auth";
import { useAuthActions, useAuthErrors, useAuthLoadingStates } from "./useAuth";

/**
 * Hook específico para forgot password functionality
 * Usa o AuthContext consolidado como fonte única da verdade
 */
export function useForgotPasswordAuth() {
  const { forgotPassword } = useAuthActions();
  const { isForgotPasswordPending } = useAuthLoadingStates();
  const { forgotPasswordError } = useAuthErrors();

  return {
    // Actions
    forgotPassword: (credentials: ForgotPasswordCredentials) =>
      forgotPassword(credentials),

    // States
    isLoading: isForgotPasswordPending,
    error: forgotPasswordError,
  };
}

