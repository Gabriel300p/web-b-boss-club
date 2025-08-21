import { useAuthStore } from "@app/store/auth";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <Navigate to="/comunicacoes" />
  ) : (
    <Navigate to="/auth/login" />
  );
}
