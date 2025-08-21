import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 🚀 Code Splitting: Lazy load LoginPage
const LoginPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.LoginPage,
  })),
);

export const Route = createFileRoute("/auth/login")({
  component: () => <LoginPage />,
});
