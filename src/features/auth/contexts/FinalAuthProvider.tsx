import { useAuthStore } from "@app/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useToast } from "../../../shared/hooks";
import { authService } from "../services/auth.service";
import type { AuthContextType, LoginCredentials } from "../types/auth";
import { AuthContext } from "./authContextDefinition";

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
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
  const currentLoginEmail = user?.email || null;

  // Auto-check authentication on mount
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: authService.checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      const result = await authService.login(credentials);
      return result;
    },
    onSuccess: (data) => {
      storeLogin(data.user);
      localStorage.setItem("access_token", data.access_token);

      showToast({
        type: "success",
        title: "Login realizado com sucesso!",
        message: `Bem-vindo de volta, ${data.user.name}!`,
        duration: 3000,
      });

      setTimeout(() => {
        navigate({ to: "/comunicacoes" });
      }, 300);
    },
    onError: (error: any) => {
      setError(error.message || "Erro ao fazer login");
      showToast({
        type: "error",
        title: "Erro no login",
        message: error.message || "Credenciais inválidas",
        duration: 4000,
      });
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
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Erro no logout",
        message: error.message || "Erro ao desconectar",
        duration: 3000,
      });
    },
  });

  // Auto-authentication check
  useEffect(() => {
    if (authData?.user && !isAuthenticated) {
      storeLogin(authData.user);
    } else if (authData?.user === null && isAuthenticated) {
      storeLogout();
    }
  }, [authData, isAuthenticated, storeLogin, storeLogout]);

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

  // 🎯 Intelligent Auto-Redirect Logic
  useEffect(() => {
    // Don't redirect while still checking auth status
    if (isCheckingAuth || isLoading) return;

    const currentPath = location.pathname;
    const isAuthRoute = currentPath.startsWith("/auth/");
    const isPublicRoute = currentPath === "/" || currentPath === "/home";

    // If user is authenticated and on auth pages, redirect to app
    if (isAuthenticated && isAuthRoute) {
      navigate({ to: "/comunicacoes" });
      return;
    }

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
      navigate({ to: "/auth/login" });
      return;
    }

    // If user is not authenticated and on root, redirect to login
    if (!isAuthenticated && currentPath === "/") {
      navigate({ to: "/auth/login" });
      return;
    }
  }, [isAuthenticated, isCheckingAuth, isLoading, location.pathname, navigate]);

  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isCheckingAuth,
    error,
    currentLoginEmail,

    // Actions
    login: async (credentials: LoginCredentials) => {
      return loginMutation.mutateAsync(credentials);
    },
    logout: async () => {
      return logoutMutation.mutateAsync();
    },
    checkAuth: () => authService.checkAuth(),
    clearError,
  };

  // Show loading while checking auth on initial load
  if (isCheckingAuth && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
