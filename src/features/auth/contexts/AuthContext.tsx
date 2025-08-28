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

// 🎯 Constantes centralizadas
const NAVIGATION_DELAY = 300;
const TOAST_DURATIONS = {
  SUCCESS: 3000,
  INFO: 5000,
  ERROR: 8000,
} as const;

export function AuthProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 🔐 Hook para gerenciamento centralizado de tokens
  const useTokenManager = () => {
    const setAuthToken = (token: string) => {
      localStorage.setItem("access_token", token);
    };

    const setTempToken = (token: string) => {
      localStorage.setItem("temp_token", token);
    };

    const clearAllTokens = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("temp_token");
    };

    return { setAuthToken, setTempToken, clearAllTokens };
  };

  const { setAuthToken, setTempToken, clearAllTokens } = useTokenManager();

  // 🧭 Navegação padronizada
  const navigateWithDelay = (to: string, delay = NAVIGATION_DELAY) => {
    setTimeout(() => navigate({ to }), delay);
  };

  // 🎨 Hook para toasts padronizados
  const useAuthToasts = () => {
    const showSuccessToast = (
      title: string,
      message: string,
      duration = TOAST_DURATIONS.SUCCESS,
    ) => {
      showToast({
        type: "success",
        title,
        message,
        expandable: true,
        duration,
      });
    };

    const showInfoToast = (
      title: string,
      message: string,
      duration = TOAST_DURATIONS.INFO,
    ) => {
      showToast({
        type: "info",
        title,
        message,
        expandable: true,
        duration,
      });
    };

    const showErrorToast = (
      title: string,
      message: string,
      duration = TOAST_DURATIONS.ERROR,
    ) => {
      showToast({
        type: "error",
        title,
        message,
        expandable: true,
        duration,
      });
    };

    return { showSuccessToast, showInfoToast, showErrorToast };
  };

  const { showSuccessToast, showInfoToast } = useAuthToasts();

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

  // Login mutation with enhanced error handling and MFA support
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      setError(null);
      return authService.login(credentials);
    },
    onSuccess: (data: LoginResponse, variables: LoginCredentials) => {
      if (data.mfaRequired && data.tempToken) {
        // MFA é necessário - salva token temporário e redireciona para MFA
        setTempToken(data.tempToken);

        // Extrai email do credential para usar na página MFA
        const email = data.user?.email || variables.credential;

        showInfoToast(
          t("toasts.info.mfaRequiredTitle"),
          `Um código de 6 dígitos foi enviado para ${email}`,
        );

        // Redireciona para verificação MFA
        navigateWithDelay("/auth/mfa-verification");
        return;
      }

      // Login direto sem MFA
      if (data.token && data.user) {
        // Constrói usuário no formato esperado pelo store
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.displayName || data.user.email,
          role: data.user.role,
          avatar: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store user and token
        storeLogin(user);
        setAuthToken(data.token);

        // Success toast
        showSuccessToast(
          t("toasts.success.loginTitle"),
          t("toasts.success.loginMessage", {
            name: data.user.displayName || data.user.email,
          }),
        );

        // Navigate to home
        navigateWithDelay("/home");
      }
    },
    onError: (error: AuthError, variables: LoginCredentials) => {
      setError(error.message);
      handleAuthError(error, variables.credential);
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
      clearAllTokens();

      showInfoToast(
        t("toasts.success.logoutTitle"),
        t("toasts.success.logoutMessage"),
      );

      navigate({ to: "/auth/login" });
    },
    onError: (error: AuthError) => {
      handleAuthError(error);
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) => {
      setError(null);
      return authService.forgotPassword(credentials);
    },
    onSuccess: () => {
      showSuccessToast(
        t("toasts.success.forgotPasswordTitle"),
        t("toasts.success.forgotPasswordMessage"),
      );

      // Navigate to MFA verification if needed
      navigateWithDelay("/auth/mfa-verification");
    },
    onError: (error: AuthError, variables: ForgotPasswordCredentials) => {
      setError(error.message);
      handleAuthError(error, variables.email);
    },
  });

  // MFA verification mutation
  const mfaVerificationMutation = useMutation({
    mutationFn: (credentials: MfaVerificationCredentials) => {
      setError(null);
      return authService.verifyMfa(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Store user
      storeLogin(data.user);

      // Primeiro login: redireciona para definir nova senha
      if (data.isFirstLogin) {
        showInfoToast(
          t("toasts.info.firstLoginTitle"),
          t("toasts.info.firstLoginMessage"),
        );

        navigate({ to: "/auth/first-login" });
        return;
      }

      // MFA verificado com sucesso: sempre navega para home
      // (independente de ter access_token ou não - o useQuery cuida do resto)
      if (data.access_token) {
        setAuthToken(data.access_token);
      }

      showSuccessToast(
        t("toasts.success.mfaTitle"),
        t("toasts.success.mfaMessage", { name: data.user.name }),
      );

      navigate({ to: "/home" });
    },
    onError: (error: AuthError) => {
      setError(error.message);
      handleAuthError(error);
    },
  });

  // Resend MFA code mutation
  const resendMfaCodeMutation = useMutation({
    mutationFn: authService.resendMfaCode,
    onSuccess: () => {
      showSuccessToast(
        t("toasts.success.mfaCodeResentTitle"),
        t("toasts.success.mfaCodeResentMessage"),
      );
    },
    onError: (error: AuthError) => {
      handleAuthError(error);
    },
  });

  // Auto-check authentication on mount
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: authService.checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Não refaz query ao montar componente
    refetchOnReconnect: false, // Não refaz query ao reconectar
    enabled: !isAuthenticated && !mfaVerificationMutation.isPending, // Não executa durante MFA
  });

  // Enhanced error handling with 4 strategies
  const handleAuthError = (error: AuthError, email?: string) => {
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
        userMessage = t("toasts.mfa.messages.required");
        title = t("toasts.mfa.titles.required");
        break;
      case "mfa_invalid":
        userMessage = t("toasts.mfa.messages.invalid");
        title = t("toasts.mfa.titles.invalid");
        break;
      case "mfa_expired":
        userMessage = t("toasts.mfa.messages.expired");
        title = t("toasts.mfa.titles.expired");
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
            label: t("toasts.mfa.actions.resendCode"),
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
      duration: TOAST_DURATIONS.ERROR,
      action: getRetryAction(),
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
