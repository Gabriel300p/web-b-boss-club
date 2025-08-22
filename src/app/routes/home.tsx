import { AuthGuard } from "@features/auth/components/AuthGuard";
import { MainLayout } from "@shared/components/layout/MainLayout";
import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { useLoadingConfig } from "@shared/hooks/useLoadingConfig";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// 🚀 Lazy loading da página de records
const LazyHomePage = lazy(() =>
  import("@features/home").then((module) => ({
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
  const HomePage = lazy(() =>
    import("@features/home").then((m) => ({ default: m.HomePage })),
  );
  return <HomePage />;
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
