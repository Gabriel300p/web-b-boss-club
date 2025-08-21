import { useContext } from "react";
import { AuthContext } from "../contexts/authContextDefinition";
import type { AuthContextType } from "../types/auth";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Hook for getting current user email globally
export function useCurrentUserEmail(): string | null {
  const { user, currentLoginEmail } = useAuth();
  return user?.email || currentLoginEmail;
}

// Hook for auth status checking
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isLoggedIn: isAuthenticated && !!user,
    isGuest: !isAuthenticated && !isLoading,
  };
}

// Hook for auth actions
export function useAuthActions() {
  const {
    login,
    logout,
    forgotPassword,
    verifyMfa,
    resendMfaCode,
    clearError,
    checkAuth,
  } = useAuth();

  return {
    login,
    logout,
    forgotPassword,
    verifyMfa,
    resendMfaCode,
    clearError,
    checkAuth,
  };
}

// Hook for loading states
export function useAuthLoadingStates() {
  const {
    isLoading,
    isLoginPending,
    isLogoutPending,
    isForgotPasswordPending,
    isMfaVerificationPending,
    isResendMfaCodePending,
  } = useAuth();

  return {
    isLoading,
    isLoginPending,
    isLogoutPending,
    isForgotPasswordPending,
    isMfaVerificationPending,
    isResendMfaCodePending,
    // Convenience computed states
    isAnyActionPending:
      isLoginPending ||
      isLogoutPending ||
      isForgotPasswordPending ||
      isMfaVerificationPending ||
      isResendMfaCodePending,
  };
}

// Hook for error states
export function useAuthErrors() {
  const {
    error,
    loginError,
    logoutError,
    forgotPasswordError,
    mfaVerificationError,
    resendMfaCodeError,
  } = useAuth();

  return {
    error,
    loginError,
    logoutError,
    forgotPasswordError,
    mfaVerificationError,
    resendMfaCodeError,
    // Convenience computed state
    hasAnyError: !!(
      error ||
      loginError ||
      logoutError ||
      forgotPasswordError ||
      mfaVerificationError ||
      resendMfaCodeError
    ),
  };
}
