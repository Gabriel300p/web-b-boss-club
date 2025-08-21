import { useAuthStore } from "@app/store/auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { authService } from "../services/auth.service";

export function SimpleAuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
  } = useAuthStore();

  // Check if user is authenticated
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: authService.checkAuth,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Update auth state based on check
  useEffect(() => {
    if (authData?.user && !isAuthenticated) {
      storeLogin(authData.user);
    } else if (authData?.user === null && isAuthenticated) {
      storeLogout();
    }
  }, [authData, isAuthenticated, storeLogin, storeLogout]);

  // Smart redirect logic
  useEffect(() => {
    if (isCheckingAuth) return; // Don't redirect while checking

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
  }, [isAuthenticated, isCheckingAuth, location.pathname, navigate]);

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return <>{children}</>;
}
