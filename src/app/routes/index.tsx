import { useAuthStatus } from "@features/auth/hooks/useAuth";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { isAuthenticated } = useAuthStatus();

  // Redirect based on auth status
  return <Navigate to={isAuthenticated ? "/home" : "/auth/login"} replace />;
}
