import { RouteSkeleton } from "@shared/components/skeletons/_index";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// 🚀 Code Splitting: Lazy load LoginPage  
const LoginPage = lazy(() =>
  import("@features/auth/_index").then((module) => ({
    default: module.LoginPage,
  })),
);

export const Route = createFileRoute("/login")({
  component: () => (
    <Suspense fallback={<RouteSkeleton />}>
      <LoginPage />
    </Suspense>
  ),
});
