import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 🚀 Code Splitting: Lazy load ForgotPasswordPage
const ForgotPasswordPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);

export const Route = createFileRoute("/auth/forgot-password")({
  // Sem nada dentro dos parênteses
  component: () => <ForgotPasswordPage />,
});
