import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 🚀 Code Splitting: Lazy load LoginPage
const LoginPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.LoginPage,
  })),
);

const AuthGuard = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.AuthGuard,
  })),
);

export const Route = createFileRoute("/auth/login")({
  component: () => (
    <AuthGuard requireAuth={false}>
      <LoginPage />
    </AuthGuard>
  ),
});
