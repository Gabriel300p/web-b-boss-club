import { AuthGuard } from "@features/auth/components/AuthGuard";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 🚀 Code Splitting: Lazy load ForgotPasswordPage
const ResetPasswordPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);

export const Route = createFileRoute("/auth/reset-password")({
  component: () => (
    <AuthGuard requireAuth={false}>
      <ResetPasswordPage />
    </AuthGuard>
  ),
});
