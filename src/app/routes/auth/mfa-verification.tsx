import { AuthGuard } from "@features/auth/components/AuthGuard";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 🚀 Code Splitting: Lazy load MfaVerificationPage
const MfaVerificationPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.MfaVerificationPage,
  })),
);

export const Route = createFileRoute("/auth/mfa-verification")({
  component: () => (
    <AuthGuard requireAuth={false}>
      <MfaVerificationPage />
    </AuthGuard>
  ),
});
