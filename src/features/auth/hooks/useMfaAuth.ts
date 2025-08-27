import type { MfaVerificationCredentials } from "../types/auth";
import { useAuthActions, useAuthErrors, useAuthLoadingStates } from "./useAuth";

/**
 * Hook específico para MFA functionality
 * Usa o AuthContext consolidado como fonte única da verdade
 */
export function useMfaAuth() {
  const { verifyMfa, resendMfaCode } = useAuthActions();
  const { isMfaVerificationPending, isResendMfaCodePending } =
    useAuthLoadingStates();
  const { mfaVerificationError, resendMfaCodeError } = useAuthErrors();

  return {
    // Actions
    verifyMfa: (credentials: MfaVerificationCredentials) =>
      verifyMfa(credentials),
    resendMfaCode: () => resendMfaCode(),

    // States
    isVerifying: isMfaVerificationPending,
    isResending: isResendMfaCodePending,
    verificationError: mfaVerificationError,
    resendError: resendMfaCodeError,

    // Convenience states
    isLoading: isMfaVerificationPending || isResendMfaCodePending,
    hasError: !!(mfaVerificationError || resendMfaCodeError),
  };
}


