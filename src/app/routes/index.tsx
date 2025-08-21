import { AnimatedBox } from "@/shared/components/animations/motion";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useAuthStatus } from "@features/auth/hooks/useAuth";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <AnimatedBox variant="fadeIn" className="min-h-screen">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
          <div className="space-y-4 text-center">
            <LoadingSpinner size="lg" className="mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-neutral-700">
                Carregando B-Boss Club...
              </p>
              <p className="text-sm text-neutral-500">
                Preparando sua experiência
              </p>
            </div>
          </div>
        </div>
      </AnimatedBox>
    );
  }

  // Redirect based on auth status
  return <Navigate to={isAuthenticated ? "/home" : "/auth/login"} replace />;
}
