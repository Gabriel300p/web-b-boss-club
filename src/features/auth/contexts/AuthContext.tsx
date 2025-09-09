import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth";
import { useToast } from "../../../shared/hooks/useToast";
import { getUserFriendlyMessage } from "../../../shared/utils/api.utils";
import { authService } from "../services/auth.service";
import type {
  AuthContextType,
  AuthError,
  AuthResponse,
  ChangePasswordCredentials,
  ForgotPasswordCredentials,
  LoginCredentials,
  LoginResponse,
  MfaVerificationCredentials,
} from "../types/auth";
import { AuthContext } from "./authContextDefinition";

// ðŸŽ¯ Constantes centralizadas
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
  const queryClient = useQueryClient();

  // ðŸ” Hook para gerenciamento centralizado de tokens
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

  // ðŸ§­ NavegaÃ§Ã£o padronizada
  const navigateWithDelay = (to: string, delay = NAVIGATION_DELAY) => {
    setTimeout(() => navigate({ to }), delay);
  };

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
        // MFA Ã© necessÃ¡rio - salva token temporÃ¡rio e redireciona para MFA
        setTempToken(data.tempToken);

        // Extrai email do credential para usar na pÃ¡gina MFA
        const email = data.user?.email || variables.credential;

        showToast({
          type: "info",
          title: t("toasts.info.mfaRequiredTitle"),
          message: `Um código de 6 dígitos foi enviado para ${email}`,
          expandable: false,
          duration: TOAST_DURATIONS.INFO,
        });

        // Redireciona para verificaÃ§Ã£o MFA
        navigateWithDelay("/auth/mfa-verification");
        return;
      }

      // Login direto sem MFA
      if (data.token && data.user) {
        // ConstrÃ³i usuÃ¡rio no formato esperado pelo store
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
        showToast({
          type: "success",
          title: t("toasts.success.loginTitle"),
          message: t("toasts.success.loginMessage", {
            name: data.user.displayName || data.user.email,
          }),
          expandable: false,
          duration: TOAST_DURATIONS.SUCCESS,
        });

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
    onSuccess: async () => {
      storeLogout();
      clearAllTokens();

      await queryClient.clear();
      queryClient.cancelQueries();
      showToast({
        type: "info",
        title: t("toasts.success.logoutTitle"),
        message: t("toasts.success.logoutMessage"),
        expandable: false,
        duration: TOAST_DURATIONS.INFO,
      });
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
    onSuccess: (data, variables) => {
      showToast({
        type: "success",
        title: t("toasts.success.forgotPasswordTitle"),
        message: t("toasts.success.forgotPasswordMessage"),
        expandable: false,
        duration: TOAST_DURATIONS.SUCCESS,
      });

      // Salva o email para usar na verificação MFA
      localStorage.setItem("forgot_password_email", variables.email);

      // Se o backend retornar tempToken, salva no localStorage (para forgot password flow)
      if (
        data &&
        typeof data === "object" &&
        "tempToken" in data &&
        data.tempToken
      ) {
        localStorage.setItem("temp_token", data.tempToken as string);
      }

      // Navigate to MFA verification para reset de senha
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
      // Verificar se Ã© um fluxo de reset de senha (forgot password)
      const isForgotPasswordFlow = localStorage.getItem(
        "forgot_password_email",
      );

      if (isForgotPasswordFlow) {
        // Remove o flag de forgot password
        localStorage.removeItem("forgot_password_email");
        // NÃO remove temp_token - será usado para AuthGuard e change-password

        showToast({
          type: "success",
          title: t("toasts.success.mfaTitle"),
          message: t("toasts.info.resetPasswordRedirect"),
          expandable: false,
          duration: TOAST_DURATIONS.SUCCESS,
        });

        // Redireciona para reset-password com contexto forgot-password
        navigate({
          to: "/auth/reset-password",
          search: { context: "forgot-password" },
        });
        return;
      }

      // Store user (fluxo de login normal)
      storeLogin(data.user);

      // Salva access_token se disponível (tanto para primeiro login quanto login normal)
      if (data.access_token) {
        setAuthToken(data.access_token);
      }

      // Primeiro login: mantém temp_token para reset password
      if (data.isFirstLogin) {
        // Mantém o temp_token atual para usar no reset password
        const currentTempToken = localStorage.getItem("temp_token");
        if (currentTempToken) {
          // Token já está salvo, não precisa fazer nada
        }
        showToast({
          type: "info",
          title: t("toasts.info.firstLoginTitle"),
          message: t("toasts.info.firstLoginMessage"),
          expandable: false,
          duration: TOAST_DURATIONS.INFO,
        });

        navigate({
          to: "/auth/reset-password",
          search: { context: "first-login" },
        });
        return;
      }

      // MFA verificado com sucesso: sempre navega para home
      // (independente de ter access_token ou nÃ£o - o useQuery cuida do resto)
      if (data.access_token) {
        setAuthToken(data.access_token);
      }

      showToast({
        type: "success",
        title: t("toasts.success.mfaTitle"),
        message: t("toasts.success.mfaMessage", { name: data.user.name }),
        expandable: false,
        duration: TOAST_DURATIONS.SUCCESS,
      });

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
      showToast({
        type: "success",
        title: t("toasts.success.mfaCodeResentTitle"),
        message: t("toasts.success.mfaCodeResentMessage"),
        expandable: false,
        duration: TOAST_DURATIONS.SUCCESS,
      });
    },
    onError: (error: AuthError) => {
      handleAuthError(error);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (credentials: ChangePasswordCredentials) => {
      setError(null);
      return authService.resetPassword(credentials);
    },
    onSuccess: () => {
      // Limpa temp_token após sucesso do reset-password
      localStorage.removeItem("temp_token");

      showToast({
        type: "success",
        title: t("toasts.success.passwordChangedTitle"),
        message: t("toasts.success.passwordChangedMessage"),
        expandable: false,
        duration: TOAST_DURATIONS.SUCCESS,
      });

      // Redireciona para home após sucesso
      navigateWithDelay("/home");
    },
    onError: (error: AuthError) => {
      setError(error.message);
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
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled:
      !isAuthenticated &&
      !mfaVerificationMutation.isPending &&
      !resetPasswordMutation.isPending &&
      !localStorage.getItem("temp_token"), // Não executa se tem temp_token (forgot-password flow)
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
      case "duplicate_cpf":
        userMessage = t("toasts.errors.messages.duplicateCpf");
        title = t("toasts.errors.titles.dataConflict");
        break;
      case "duplicate_email":
        userMessage = t("toasts.errors.messages.duplicateEmail");
        title = t("toasts.errors.titles.dataConflict");
        break;
      case "invalid_cpf":
        userMessage = t("toasts.errors.messages.invalidCpf");
        title = t("toasts.errors.titles.dataConflict");
        break;
      case "invalid_email":
        userMessage = t("toasts.errors.messages.invalidEmail");
        title = t("toasts.errors.titles.dataConflict");
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
        userMessage = getUserFriendlyMessage(error) || userMessage;
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
        resendMfaCodeMutation.isPending ||
        resetPasswordMutation.isPending,
    );
  }, [
    isCheckingAuth,
    logoutMutation.isPending,
    forgotPasswordMutation.isPending,
    mfaVerificationMutation.isPending,
    resendMfaCodeMutation.isPending,
    resetPasswordMutation.isPending,
    setLoading,
  ]);

  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isCheckingAuth,
    error,
    currentLoginEmail,
    mfaRequired: false, // SerÃ¡ gerenciado pelo estado do login
    tempToken: null, // SerÃ¡ gerenciado pelo estado do login

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    verifyMfa: mfaVerificationMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    resendMfaCode: resendMfaCodeMutation.mutate,
    clearError,
    checkAuth: () => authService.checkAuth(),
    setMfaRequired: () => {}, // Implementar se necessÃ¡rio

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

    // Mutation states - Reset Password
    isResetPasswordPending: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
