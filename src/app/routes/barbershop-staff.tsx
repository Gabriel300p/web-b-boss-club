import { MainLayout } from "@/shared/components/layout/MainLayout";
import { AuthGuard } from "@features/auth/components/AuthGuard";
import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { useLoadingConfig } from "@shared/hooks/useLoadingConfig";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { BarbershopStaffPage as DirectBarbershopStaffPage } from "@features/barbershop-staff/_index";

const LazyBarbershopStaffPage = lazy(() =>
  import("@features/barbershop-staff/_index.ts").then((module) => ({
    default: module.BarbershopStaffPage,
  })),
);

function BarbershopStaffPageLoader() {
  const config = useLoadingConfig();

  // Lazy loading com RouteSkeleton
  if (config.useLazyLoading && config.useRouteSkeleton) {
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <LazyBarbershopStaffPage />
      </Suspense>
    );
  }

  // Lazy loading sem skeleton (fallback transparente)
  if (config.useLazyLoading && !config.useRouteSkeleton) {
    return (
      <Suspense fallback={<div />}>
        <LazyBarbershopStaffPage />
      </Suspense>
    );
  }

  // Loading direto sem lazy loading (importação estática)
  return <DirectBarbershopStaffPage />;
}

export const Route = createFileRoute("/barbershop-staff")({
  component: () => (
    <AuthGuard requireAuth={true}>
      <MainLayout>
        <BarbershopStaffPageLoader />
      </MainLayout>
    </AuthGuard>
  ),
});
