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
  LoginCredentials,
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
      setLoading(true);
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
        navigate({ to: "/comunicacoes" });
      }, 300);
    },
    onError: (error: AuthError, variables: LoginCredentials) => {
      setError(error.message);
      handleAuthError(error, "login", variables.email);
    },
    onSettled: () => {
      setLoading(false);
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

  // Enhanced error handling with 4 strategies
  const handleAuthError = (
    error: AuthError,
    context: "login" | "logout" | "check" | "refresh",
    email?: string,
  ) => {
    const errorContext = email ? ` para ${email}` : "";

    // Strategy 1: User-friendly messages
    let userMessage = "Ocorreu um erro inesperado.";
    let title = "Erro de Autenticação";

    switch (error.code) {
      case "invalid_credentials":
        userMessage = `Credenciais inválidas${errorContext}. Verifique seu email e senha.`;
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
            label: "Tentar Novamente",
            onClick: () => clearError(),
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
    if (error.code === "invalid_credentials") {
      setTimeout(() => {
        showToast({
          type: "info",
          title: "Esqueceu sua senha?",
          message: "Clique aqui para redefinir sua senha",
          duration: 5000,
          action: {
            label: "Redefinir Senha",
            onClick: () => navigate({ to: "/auth/forgot-password" }),
          },
        });
      }, 1000);
    }

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
  useEffect(() => {
    setLoading(
      isCheckingAuth || loginMutation.isPending || logoutMutation.isPending,
    );
  }, [
    isCheckingAuth,
    loginMutation.isPending,
    logoutMutation.isPending,
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
    clearError,
    checkAuth: () => authService.checkAuth(),

    // Mutation states
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
