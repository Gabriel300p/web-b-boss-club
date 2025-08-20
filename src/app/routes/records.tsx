import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { MainLayout } from "@shared/components/layout/MainLayout";
import { useLoadingConfig } from "@shared/hooks/useLoadingConfig";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// 🚀 Lazy loading da página de records
const LazyRecordsPage = lazy(() =>
  import("@features/records").then((module) => ({
    default: module.RecordsPage,
  })),
);

// 🎯 Componente que escolhe a estratégia de loading baseado na config
function RecordsPageLoader() {
  const config = useLoadingConfig();

  // Lazy loading com RouteSkeleton
  if (config.useLazyLoading && config.useRouteSkeleton) {
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <LazyRecordsPage />
      </Suspense>
    );
  }

  // Lazy loading sem skeleton (fallback transparente)
  if (config.useLazyLoading && !config.useRouteSkeleton) {
    return (
      <Suspense fallback={<div />}>
        <LazyRecordsPage />
      </Suspense>
    );
  }

  // Loading direto sem lazy loading (importação estática)
  const RecordsPage = lazy(() => import("@features/records").then(m => ({ default: m.RecordsPage })));
  return <RecordsPage />;
}

export const Route = createFileRoute("/records")({
  component: () => (
    <MainLayout>
      <RecordsPageLoader />
    </MainLayout>
  ),
});
