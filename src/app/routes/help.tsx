import { MainLayout } from "@/shared/components/layout/MainLayout";
import { AuthGuard } from "@features/auth/components/AuthGuard";
import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { useLoadingConfig } from "@shared/hooks/useLoadingConfig";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { HelpPage as DirectHelpPage } from "@features/help/_index";

const LazyHelpPage = lazy(() =>
  import("@features/help/_index.ts").then((module) => ({
    default: module.HelpPage,
  })),
);

function HelpPageLoader() {
  const config = useLoadingConfig();

  // Lazy loading com RouteSkeleton
  if (config.useLazyLoading && config.useRouteSkeleton) {
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <LazyHelpPage />
      </Suspense>
    );
  }

  // Lazy loading sem skeleton (fallback transparente)
  if (config.useLazyLoading && !config.useRouteSkeleton) {
    return (
      <Suspense fallback={<div />}>
        <LazyHelpPage />
      </Suspense>
    );
  }

  // Loading direto sem lazy loading (importação estática)
  return <DirectHelpPage />;
}

export const Route = createFileRoute("/help")({
  component: () => (
    <AuthGuard requireAuth={true}>
      <MainLayout>
        <HelpPageLoader />
      </MainLayout>
    </AuthGuard>
  ),
});
