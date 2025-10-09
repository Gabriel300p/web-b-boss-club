import { MainLayout } from "@/shared/components/layout/MainLayout";
import { AuthGuard } from "@features/auth/components/AuthGuard";
import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { useLoadingConfig } from "@shared/hooks/useLoadingConfig";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { SettingsPage as DirectSettingsPage } from "@features/settings/_index";

const LazySettingsPage = lazy(() =>
  import("@features/settings/_index.ts").then((module) => ({
    default: module.SettingsPage,
  })),
);

function SettingsPageLoader() {
  const config = useLoadingConfig();

  // Lazy loading com RouteSkeleton
  if (config.useLazyLoading && config.useRouteSkeleton) {
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <LazySettingsPage />
      </Suspense>
    );
  }

  // Lazy loading sem skeleton (fallback transparente)
  if (config.useLazyLoading && !config.useRouteSkeleton) {
    return (
      <Suspense fallback={<div />}>
        <LazySettingsPage />
      </Suspense>
    );
  }

  // Loading direto sem lazy loading (importação estática)
  return <DirectSettingsPage />;
}

export const Route = createFileRoute("/settings")({
  component: () => (
    <AuthGuard requireAuth={true}>
      <MainLayout>
        <SettingsPageLoader />
      </MainLayout>
    </AuthGuard>
  ),
});
