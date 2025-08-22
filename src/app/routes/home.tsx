import { AuthGuard } from "@features/auth/components/AuthGuard";
import { MainLayout } from "@shared/components/layout/MainLayout";
import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { useLoadingConfig } from "@shared/hooks/useLoadingConfig";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// 🚀 Import direto para quando lazy loading está desabilitado
import { HomePage as DirectHomePage } from "@/features/home/_index";

// 🚀 Lazy loading da página de home
const LazyHomePage = lazy(() =>
  import("@/features/home/_index").then((module) => ({
    default: module.HomePage,
  })),
);

// 🎯 Componente que escolhe a estratégia de loading baseado na config
function HomePageLoader() {
  const config = useLoadingConfig();

  // Lazy loading com RouteSkeleton
  if (config.useLazyLoading && config.useRouteSkeleton) {
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <LazyHomePage />
      </Suspense>
    );
  }

  // Lazy loading sem skeleton (fallback transparente)
  if (config.useLazyLoading && !config.useRouteSkeleton) {
    return (
      <Suspense fallback={<div />}>
        <LazyHomePage />
      </Suspense>
    );
  }

  // Loading direto sem lazy loading (importação estática)
  return <DirectHomePage />;
}

export const Route = createFileRoute("/home")({
  component: () => (
    <AuthGuard requireAuth={true}>
      <MainLayout>
        <HomePageLoader />
      </MainLayout>
    </AuthGuard>
  ),
});
