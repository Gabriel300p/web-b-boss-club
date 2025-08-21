import { useAuthStore } from "@app/store/auth";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

interface AuthGuardProps extends PropsWithChildren {
  requireAuth?: boolean; // true = need to be logged in, false = need to be logged out
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If requires auth but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      navigate({ to: "/auth/login" });
      return;
    }

    // If requires NOT auth (like login page) but user is authenticated
    if (!requireAuth && isAuthenticated) {
      navigate({ to: "/comunicacoes" });
      return;
    }
  }, [isAuthenticated, requireAuth, navigate]);

  // If requireAuth and user is not authenticated, don't render
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  // If !requireAuth and user is authenticated, don't render
  if (!requireAuth && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return <>{children}</>;
}
