import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { MainLayout } from "@shared/components/layout/MainLayout";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// 🚀 Lazy loading da página de comunicações
const ComunicacoesPage = lazy(() =>
  import("@features/comunicacoes").then((module) => ({
    default: module.ComunicacoesPage,
  })),
);

export const Route = createFileRoute("/comunicacoes")({
  component: () => (
    <MainLayout>
      <Suspense fallback={<RouteSkeleton />}>
        <ComunicacoesPage />
      </Suspense>
    </MainLayout>
  ),
});
