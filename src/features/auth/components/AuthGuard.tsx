import { AnimatedBox } from "@/shared/components/animations/motion";
import { useDelayedLoading } from "@/shared/hooks/useDelayedLoading";
import { tokenManager } from "@/shared/services/token-manager";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useAuthStatus } from "../hooks/useAuth";

interface AuthGuardProps extends PropsWithChildren {
  requireAuth?: boolean; // true = need to be logged in, false = need to be logged out
  redirectTo?: string; // custom redirect path
  fallback?: React.ReactNode; // custom loading component
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  // Só mostra skeleton se loading demorar mais que 200ms
  const shouldShowSkeleton = useDelayedLoading(isLoading, 200);

  // Verifica se tem temp_token (para forgot-password flow)
  const hasTempToken = tokenManager.getTempToken();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // Se estamos na rota reset-password, permitir acesso se:
    // 1. Usuário autenticado (first-login) OU
    // 2. Usuário não autenticado mas com temp_token (forgot-password)
    if (location.pathname === "/auth/reset-password") {
      if (isAuthenticated || hasTempToken) {
        return; // Permite acesso
      } else {
        navigate({ to: "/auth/login" });
        return;
      }
    }

    // If requires auth but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      navigate({ to: redirectTo || "/auth/login" });
      return;
    }

    // If requires NOT auth (like login page) but user is authenticated
    if (!requireAuth && isAuthenticated) {
      navigate({ to: redirectTo || "/home" });
      return;
    }
  }, [
    isAuthenticated,
    requireAuth,
    navigate,
    redirectTo,
    isLoading,
    location.pathname,
    hasTempToken,
  ]);

  // Para telas de auth (requireAuth=false), nunca mostrar skeleton
  // Para outras telas, mostrar skeleton apenas se explicitamente solicitado via fallback
  if (shouldShowSkeleton && requireAuth) {
    return fallback || null; // Remove RouteSkeleton padrão
  }

  // Caso especial: rota reset-password permite acesso com temp_token
  if (location.pathname === "/auth/reset-password") {
    if (isAuthenticated || hasTempToken) {
      // Permite acesso - renderiza children
      return <AnimatedBox variant="fadeIn">{children}</AnimatedBox>;
    } else {
      // Redireciona para login - mostra skeleton durante redirect
      return (
        fallback || (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        )
      );
    }
  }

  // If we're on a page that requires auth but user is not authenticated,
  // or if we're on login page but user is authenticated, we'll be redirected
  // Show skeleton during redirect to prevent blank page
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    // Show skeleton during redirect to prevent blank page
    return (
      fallback || (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      )
    );
  }

  // Render children with fade-in animation
  return <AnimatedBox variant="fadeIn">{children}</AnimatedBox>;
}
