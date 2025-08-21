import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../../app/store/auth";
import { useToast } from "../../../shared/hooks/useToast";
import { authService } from "../services/auth.service";
import type {
  AuthContextType,
  AuthError,
  AuthResponse,
  ForgotPasswordCredentials,
  LoginCredentials,
  MfaVerificationCredentials,
} from "../types/auth";
import { AuthContext } from "./authContextDefinition";

export function AuthProvider({ children }: PropsWithChildren) {
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

  // Login mutation with enhanced error handling
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      setError(null);
      return authService.login(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Store user and token
      storeLogin(data.user);
      localStorage.setItem("access_token", data.access_token);

      // Success toast with animation
      showToast({
        type: "success",
        title: "Login realizado com sucesso!",
        message: `Bem-vindo de volta, ${data.user.name}!`,
        expandable: true,
        duration: 3000,
      });

      // Navigate with slight delay for animation
      setTimeout(() => {
        navigate({ to: "/home" });
      }, 300);
    },
    onError: (error: AuthError, variables: LoginCredentials) => {
      setError(error.message);
      handleAuthError(error, "login", variables.email);
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

      showToast({
        type: "info",
        title: "Logout realizado",
        message: "Você foi desconectado com sucesso.",
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
        title: "Email de recuperação enviado!",
        message:
          "Verifique sua caixa de entrada para instruções de reset de senha.",
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
        title: "Verificação MFA concluída!",
        message: `Código validado com sucesso. Bem-vindo, ${data.user.name}!`,
        expandable: true,
        duration: 3000,
      });

      setTimeout(() => {
        navigate({ to: "/home" });
      }, 300);
    },
    onError: (error: AuthError, variables: MfaVerificationCredentials) => {
      setError(error.message);
      handleAuthError(error, "mfa-verification", variables.email);
    },
  });

  // Resend MFA code mutation
  const resendMfaCodeMutation = useMutation({
    mutationFn: authService.resendMfaCode,
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Código reenviado!",
        message: "Um novo código de verificação foi enviado para seu email.",
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
    let userMessage = "Ocorreu um erro inesperado.";
    let title = "Erro de Autenticação";

    switch (error.code) {
      case "invalid_credentials":
        userMessage = `Credenciais inválidas${errorContext}. Verifique seu email e senha ou clique em "Redefinir Senha" para receber um novo código de verificação.`;
        title = "Login Inválido";
        break;
      case "user_not_found":
        userMessage = `Usuário não encontrado${errorContext}.`;
        title = "Usuário Não Encontrado";
        break;
      case "account_locked":
        userMessage = `Conta temporariamente bloqueada${errorContext} por segurança.`;
        title = "Conta Bloqueada";
        break;
      case "network_error":
        userMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
        title = "Erro de Conexão";
        break;
      default:
        userMessage = error.message || userMessage;
    }

    // Strategy 2: Contextual actions (will be handled by individual toast actions)
    const getRetryAction = () => {
      switch (error.code) {
        case "invalid_credentials":
          return {
            label: "Redefinir Senha",
            onClick: () => navigate({ to: "/auth/forgot-password" }),
          };
        case "network_error":
          return {
            label: "Recarregar",
            onClick: () => window.location.reload(),
          };
        default:
          return {
            label: "Tentar Novamente",
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

    // For invalid credentials, also show forgot password option
    // if (error.code === "invalid_credentials") {
    //   setTimeout(() => {
    //     showToast({
    //       type: "info",
    //       title: "Esqueceu sua senha?",
    //       message: "Clique aqui para redefinir sua senha",
    //       duration: 5000,
    //       action: {
    //         label: "Redefinir Senha",
    //         onClick: () => navigate({ to: "/auth/forgot-password" }),
    //       },
    //     });
    //   }, 1000);
    // }

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

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    verifyMfa: mfaVerificationMutation.mutate,
    resendMfaCode: resendMfaCodeMutation.mutate,
    clearError,
    checkAuth: () => authService.checkAuth(),

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
