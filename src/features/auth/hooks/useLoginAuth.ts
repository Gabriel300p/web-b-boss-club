import type { LoginCredentials } from "../types/auth";
import { useAuthActions, useAuthErrors, useAuthLoadingStates } from "./useAuth";

/**
 * Hook específico para login functionality
 * Usa o AuthContext consolidado como fonte única da verdade
 * Substitui o antigo useLogin hook
 */
export function useLoginAuth() {
  const { login } = useAuthActions();
  const { isLoginPending } = useAuthLoadingStates();
  const { loginError } = useAuthErrors();

  return {
    // Actions
    login: (credentials: LoginCredentials) => login(credentials),

    // States
    isLoading: isLoginPending,
    error: loginError,
  };
}
