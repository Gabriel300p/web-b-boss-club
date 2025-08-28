import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth";
import { useToast } from "../../../shared/hooks/useToast";
import { authService } from "../services/auth.service";
import type {
  AuthContextType,
  AuthError,
  AuthResponse,
  ForgotPasswordCredentials,
  LoginCredentials,
  LoginResponse,
  MfaVerificationCredentials,
} from "../types/auth";
import { AuthContext } from "./authContextDefinition";

export function AuthProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Zustand store integration
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setLoading,
    setError,
    login: storeLogin,
    logout: storeLogout,
    clearError,
  } = useAuthStore();

  // Current login attempt email for global access
  const currentLoginEmail = useAuthStore((state) =>
    state.error ? null : state.user?.email || null,
  );

  // Auto-check authentication on mount
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: authService.checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Login mutation with enhanced error handling and MFA support
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      setError(null);
      return authService.login(credentials);
    },
    onSuccess: (data: LoginResponse, variables: LoginCredentials) => {
      if (data.mfaRequired && data.tempToken) {
        // MFA é necessário - salva token temporário e redireciona para MFA
        localStorage.setItem("temp_token", data.tempToken);

        // Extrai email do credential para usar na página MFA
        const email = data.user?.email || variables.credential;

        showToast({
          type: "info",
          title: "Verificação MFA necessária",
          message: `Um código de 6 dígitos foi enviado para ${email}`,
          expandable: true,
          duration: 5000,
        });

        // Redireciona para verificação MFA
        setTimeout(() => {
          navigate({ to: "/auth/mfa-verification" });
        }, 300);

        return;
      }

      // Login direto sem MFA
      if (data.token && data.user) {
        // Constrói usuário no formato esperado pelo store
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.displayName || data.user.email,
          role: data.user.role as "admin" | "user" | "moderator",
          avatar: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store user and token
        storeLogin(user);
        localStorage.setItem("access_token", data.token);

        // Success toast with animation
        showToast({
          type: "success",
          title: t("toasts.success.loginTitle"),
          message: t("toasts.success.loginMessage", {
            name: data.user.displayName || data.user.email,
          }),
          expandable: true,
          duration: 3000,
        });

        // Navigate with slight delay for animation
        setTimeout(() => {
          navigate({ to: "/home" });
        }, 300);
      }
    },
    onError: (error: AuthError, variables: LoginCredentials) => {
      setError(error.message);
      handleAuthError(error, "login", variables.credential);
    },
    onSettled: () => {
      // Loading state is now handled by loginMutation.isPending directly
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      storeLogout();
      localStorage.removeItem("access_token");
      localStorage.removeItem("temp_token");

      showToast({
        type: "info",
        title: t("toasts.success.logoutTitle"),
        message: t("toasts.success.logoutMessage"),
        duration: 2000,
      });

      navigate({ to: "/auth/login" });
    },
    onError: (error: AuthError) => {
      handleAuthError(error, "logout");
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) => {
      setError(null);
      return authService.forgotPassword(credentials);
    },
    onSuccess: () => {
      showToast({
        type: "success",
        title: t("toasts.success.forgotPasswordTitle"),
        message: t("toasts.success.forgotPasswordMessage"),
        expandable: true,
        duration: 5000,
      });

      // Navigate to MFA verification if needed
      setTimeout(() => {
        navigate({ to: "/auth/mfa-verification" });
      }, 300);
    },
    onError: (error: AuthError, variables: ForgotPasswordCredentials) => {
      setError(error.message);
      handleAuthError(error, "forgot-password", variables.email);
    },
  });

  // MFA verification mutation
  const mfaVerificationMutation = useMutation({
    mutationFn: (credentials: MfaVerificationCredentials) => {
      setError(null);
      return authService.verifyMfa(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Store user and token
      storeLogin(data.user);
      localStorage.setItem("access_token", data.access_token);

      showToast({
        type: "success",
        title: t("toasts.success.mfaTitle"),
        message: t("toasts.success.mfaMessage", { name: data.user.name }),
        expandable: true,
        duration: 3000,
      });

      setTimeout(() => {
        navigate({ to: "/home" });
      }, 300);
    },
    onError: (error: AuthError) => {
      setError(error.message);
      handleAuthError(error, "mfa-verification");
    },
  });

  // Resend MFA code mutation
  const resendMfaCodeMutation = useMutation({
    mutationFn: authService.resendMfaCode,
    onSuccess: () => {
      showToast({
        type: "success",
        title: t("toasts.success.mfaCodeResentTitle"),
        message: t("toasts.success.mfaCodeResentMessage"),
        duration: 3000,
      });
    },
    onError: (error: AuthError) => {
      handleAuthError(error, "resend-mfa");
    },
  });

  // Enhanced error handling with 4 strategies
  const handleAuthError = (
    error: AuthError,
    context:
      | "login"
      | "logout"
      | "check"
      | "refresh"
      | "forgot-password"
      | "mfa-verification"
      | "resend-mfa",
    email?: string,
  ) => {
    const errorContext = email ? ` para ${email}` : "";

    // Strategy 1: User-friendly messages
    let userMessage = t("toasts.errors.messages.unexpectedError");
    let title = t("toasts.errors.titles.authError");

    switch (error.code) {
      case "invalid_credentials":
        userMessage = t("toasts.errors.messages.invalidCredentials", {
          context: errorContext,
        });
        title = t("toasts.errors.titles.invalidLogin");
        break;
      case "user_not_found":
        userMessage = t("toasts.errors.messages.userNotFound", {
          context: errorContext,
        });
        title = t("toasts.errors.titles.userNotFound");
        break;
      case "account_locked":
        userMessage = t("toasts.errors.messages.accountLocked", {
          context: errorContext,
        });
        title = t("toasts.errors.titles.accountLocked");
        break;
      case "mfa_required":
        userMessage = "Verificação MFA é necessária para continuar";
        title = "Verificação MFA Necessária";
        break;
      case "mfa_invalid":
        userMessage = "Código MFA inválido ou expirado";
        title = "Código MFA Inválido";
        break;
      case "mfa_expired":
        userMessage = "Código MFA expirado. Solicite um novo código";
        title = "Código MFA Expirado";
        break;
      case "network_error":
        userMessage = t("toasts.errors.messages.networkError");
        title = t("toasts.errors.titles.connectionError");
        break;
      default:
        userMessage = error.message || userMessage;
    }

    // Strategy 2: Contextual actions (will be handled by individual toast actions)
    const getRetryAction = () => {
      switch (error.code) {
        case "invalid_credentials":
          return {
            label: t("toasts.errors.actions.resetPassword"),
            onClick: () => navigate({ to: "/auth/forgot-password" }),
          };
        case "network_error":
          return {
            label: t("toasts.errors.actions.reload"),
            onClick: () => window.location.reload(),
          };
        case "mfa_invalid":
        case "mfa_expired":
          return {
            label: "Reenviar Código",
            onClick: () => resendMfaCodeMutation.mutate(),
          };
        default:
          return {
            label: t("toasts.errors.actions.tryAgain"),
            onClick: () => clearError(),
          };
      }
    };

    // Strategy 3 & 4: Toast notification with progressive disclosure
    showToast({
      type: "error",
      title,
      message: userMessage,
      expandable: true,
      duration: 8000,

      action: getRetryAction(),
    });

    // Additional console logging for development
    console.error(`Auth Error [${context}]:`, {
      code: error.code,
      message: error.message,
      email,
      timestamp: new Date().toISOString(),
    });
  };

  // Auto-authentication check
  useEffect(() => {
    if (authData?.user && !isAuthenticated) {
      storeLogin(authData.user);
    }
  }, [authData, isAuthenticated, storeLogin]);

  // Update loading state based on queries
  // Note: loginMutation.isPending is NOT included here to prevent AuthGuard from showing skeleton during login errors
  useEffect(() => {
    setLoading(
      isCheckingAuth ||
        logoutMutation.isPending ||
        forgotPasswordMutation.isPending ||
        mfaVerificationMutation.isPending ||
        resendMfaCodeMutation.isPending,
    );
  }, [
    isCheckingAuth,
    logoutMutation.isPending,
    forgotPasswordMutation.isPending,
    mfaVerificationMutation.isPending,
    resendMfaCodeMutation.isPending,
    setLoading,
  ]);

  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isCheckingAuth,
    error,
    currentLoginEmail,
    mfaRequired: false, // Será gerenciado pelo estado do login
    tempToken: null, // Será gerenciado pelo estado do login

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    verifyMfa: mfaVerificationMutation.mutate,
    resendMfaCode: resendMfaCodeMutation.mutate,
    clearError,
    checkAuth: () => authService.checkAuth(),
    setMfaRequired: () => {}, // Implementar se necessário

    // Mutation states - Login
    isLoginPending: loginMutation.isPending,
    loginError: loginMutation.error,

    // Mutation states - Logout
    isLogoutPending: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // Mutation states - Forgot Password
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    // Mutation states - MFA
    isMfaVerificationPending: mfaVerificationMutation.isPending,
    mfaVerificationError: mfaVerificationMutation.error,
    isResendMfaCodePending: resendMfaCodeMutation.isPending,
    resendMfaCodeError: resendMfaCodeMutation.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
