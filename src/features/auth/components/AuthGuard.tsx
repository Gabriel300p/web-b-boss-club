import { AnimatedBox } from "@/shared/components/animations/motion";
import { RouteSkeleton } from "@/shared/components/skeletons/RouteSkeleton";
import { useDelayedLoading } from "@/shared/hooks/useDelayedLoading";
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

  // Só mostra skeleton se loading demorar mais que 200ms
  const shouldShowSkeleton = useDelayedLoading(isLoading, 200);

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
      navigate({ to: redirectTo || "/home" });
      return;
    }
  }, [isAuthenticated, requireAuth, navigate, redirectTo, isLoading]);

  // Show loading ONLY while checking initial auth status AND se passou do delay mínimo
  // Isso previne o skeleton de "piscar" em carregamentos rápidos
  if (shouldShowSkeleton) {
    return fallback || <RouteSkeleton />;
  }

  // If we're on a page that requires auth but user is not authenticated,
  // or if we're on login page but user is authenticated, we'll be redirected
  // but we don't need to show skeleton during this process
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    // Return null or a simple loading state instead of full skeleton
    // This prevents the jarring skeleton flash during redirects
    return null;
  }

  // Render children with fade-in animation
  return <AnimatedBox variant="fadeIn">{children}</AnimatedBox>;
}
