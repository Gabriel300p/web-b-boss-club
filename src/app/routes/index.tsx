import { AnimationSystemDemo } from "@shared/components/animations/AnimationSystemDemo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  // Temporary demo mode for testing new toast features
  const isDemoMode = process.env.NODE_ENV === "development";

  if (isDemoMode) {
    return <AnimationSystemDemo />;
  }

  return <Navigate to="/login" />;
}
