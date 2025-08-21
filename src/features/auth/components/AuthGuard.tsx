import { AnimatedBox } from "@/shared/components/animations/motion";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useNavigate } from "@tanstack/react-router";
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

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If requires auth but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      navigate({ to: redirectTo || "/auth/login" });
      return;
    }

    // If requires NOT auth (like login page) but user is authenticated
    if (!requireAuth && isAuthenticated) {
      navigate({ to: redirectTo || "/comunicacoes" });
      return;
    }
  }, [isAuthenticated, requireAuth, navigate, redirectTo, isLoading]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      fallback || (
        <AnimatedBox variant="fadeIn" className="min-h-screen">
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" className="mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-slate-700">
                  Verificando autenticação...
                </p>
                <p className="text-sm text-slate-500">
                  Aguarde enquanto validamos seu acesso
                </p>
              </div>
            </div>
          </div>
        </AnimatedBox>
      )
    );
  }

  // If requireAuth and user is not authenticated, show loading until redirect
  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <AnimatedBox variant="slideIn" className="min-h-screen">
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" className="mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-red-700">
                  Acesso não autorizado
                </p>
                <p className="text-sm text-red-500">
                  Redirecionando para o login...
                </p>
              </div>
            </div>
          </div>
        </AnimatedBox>
      )
    );
  }

  // If !requireAuth and user is authenticated, show loading until redirect
  if (!requireAuth && isAuthenticated) {
    return (
      fallback || (
        <AnimatedBox variant="scaleIn" className="min-h-screen">
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" className="mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-green-700">
                  Você já está conectado
                </p>
                <p className="text-sm text-green-500">
                  Redirecionando para o painel...
                </p>
              </div>
            </div>
          </div>
        </AnimatedBox>
      )
    );
  }

  // Render children with fade-in animation
  return <AnimatedBox variant="fadeIn">{children}</AnimatedBox>;
}
