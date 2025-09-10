import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth";
import { useToast } from "../../../shared/hooks/useToast";
import { tokenManager } from "../../../shared/services/token-manager";
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
  const queryClient = useQueryClient();

  // 🎯 Usa TokenManager centralizado
  const setAuthToken = (token: string, expiresIn?: number) => {
    tokenManager.setAccessToken(token, expiresIn);
  };

  const setTempToken = (token: string) => {
    tokenManager.setTempToken(token);
  };

  const clearAllTokens = () => {
    tokenManager.clearAllTokens();
  };

  const clearAllAuthData = () => {
    tokenManager.clearAllAuthData();
  };

  // 🎯 Navegação padronizada
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

  // Login mutation with enhanced error handling and verification support
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      setError(null);
      return authService.login(credentials);
    },
    onSuccess: (data: LoginResponse, variables: LoginCredentials) => {
      if (data.mfaRequired && data.tempToken) {
        // Verificação é necessária - salva token temporário e redireciona para verificação
        setTempToken(data.tempToken);

        // Extrai email do credential para usar na página de verificação
        const email = data.user?.email || variables.credential;

        showToast({
          type: "info",
          title: t("toasts.info.mfaRequiredTitle"),
          message: `Um código de 6 dígitos foi enviado para ${email}`,
          expandable: false,
          duration: TOAST_DURATIONS.INFO,
        });

        // Redireciona para verificação de código
        navigateWithDelay("/auth/mfa-verification");
        return;
      }

      // Login direto sem verificação
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
      setError(getUserFriendlyMessage(error));
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
      clearAllAuthData(); // Limpa todos os dados de auth, incluindo fluxos especiais

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

      // Salva o email para usar na verificação de código
      tokenManager.setForgotPasswordEmail(variables.email);

      // Se o backend retornar tempToken, salva usando TokenManager
      if (
        data &&
        typeof data === "object" &&
        "tempToken" in data &&
        data.tempToken
      ) {
        setTempToken(data.tempToken as string);
      }

      // Navigate to code verification para reset de senha
      navigateWithDelay("/auth/mfa-verification");
    },
    onError: (error: AuthError, variables: ForgotPasswordCredentials) => {
      setError(error.message);
      handleAuthError(error, variables.email);
    },
  });

  // Code verification mutation
  const mfaVerificationMutation = useMutation({
    mutationFn: (credentials: MfaVerificationCredentials) => {
      setError(null);
      return authService.verifyMfa(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Verificar se é um fluxo de reset de senha (forgot password)
      const isForgotPasswordFlow = tokenManager.getForgotPasswordEmail();

      if (isForgotPasswordFlow) {
        // Remove o flag de forgot password
        tokenManager.clearForgotPasswordEmail();
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
        const currentTempToken = tokenManager.getTempToken();
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

      // Código verificado com sucesso: sempre navega para home
      // (independente de ter access_token ou não - o useQuery cuida do resto)
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

  // Resend verification code mutation
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
      tokenManager.clearTempToken();

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

  // Auto-check authentication on mount - OTIMIZADO
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: authService.checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 15, // 15 minutos (aumentado de 5)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled:
      !isAuthenticated &&
      !mfaVerificationMutation.isPending &&
      !resetPasswordMutation.isPending &&
      !tokenManager.getTempToken(), // Usa TokenManager
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
        userMessage = t("toasts.verification.messages.required");
        title = t("toasts.verification.titles.required");
        break;
      case "mfa_invalid":
        userMessage = t("toasts.verification.messages.invalid");
        title = t("toasts.verification.titles.invalid");
        break;
      case "mfa_expired":
        userMessage = t("toasts.verification.messages.expired");
        title = t("toasts.verification.titles.expired");
        break;
      case "validation_error":
        userMessage = t("toasts.errors.messages.validationError");
        title = t("toasts.errors.titles.validationError");
        break;
      case "unauthorized":
        userMessage = t("toasts.errors.messages.unauthorized");
        title = t("toasts.errors.titles.unauthorized");
        break;
      case "server_error":
        userMessage = t("toasts.errors.messages.serverError");
        title = t("toasts.errors.titles.serverError");
        break;
      default:
        userMessage = t("toasts.errors.messages.unexpectedError");
        title = t("toasts.errors.titles.authError");
    }

    // Strategy 2: Show toast with user-friendly message
    showToast({
      type: "error",
      title,
      message: userMessage,
      expandable: true,
      duration: TOAST_DURATIONS.ERROR,
    });

    // Strategy 3: Handle specific error cases
    if (error.code === "unauthorized") {
      // Token expirado - limpa tokens e redireciona
      clearAllTokens();
      storeLogout();
      navigate({ to: "/auth/login" });
    }

    // Strategy 4: Log error for debugging
    console.error("Auth Error:", {
      code: error.code,
      message: error.message,
      context: errorContext,
      timestamp: new Date().toISOString(),
    });
  };

  // Auto-login effect - OTIMIZADO
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
    mfaRequired: false, // Será gerenciado pelo estado do login
    tempToken: null, // Será gerenciado pelo estado do login

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    verifyMfa: mfaVerificationMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
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

    // Mutation states - MFA Verification
    isMfaVerificationPending: mfaVerificationMutation.isPending,
    mfaVerificationError: mfaVerificationMutation.error,

    // Mutation states - Reset Password
    isResetPasswordPending: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // Mutation states - Resend MFA Code
    isResendMfaCodePending: resendMfaCodeMutation.isPending,
    resendMfaCodeError: resendMfaCodeMutation.error,

    // Query states - removido authCheckError que não existe no tipo
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
