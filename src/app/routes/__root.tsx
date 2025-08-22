import { AuthProvider } from "@/features/auth/_index";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </AuthProvider>
  ),
});
