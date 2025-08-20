import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 🚀 Code Splitting: Lazy load EsqueciSenhaPage
const EsqueciSenhaPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.EsqueciSenhaPage,
  })),
);

export const Route = createFileRoute("/auth/esqueci-senha")({
  // Sem nada dentro dos parênteses
  component: () => <EsqueciSenhaPage />,
});
