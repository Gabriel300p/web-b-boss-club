import { AuthGuard } from "@features/auth/components/AuthGuard";
import { MainLayout } from "@shared/components/layout/MainLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/barbers")({
  component: () => (
    <AuthGuard requireAuth={true}>
      <MainLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <span className="text-center text-4xl">👥</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
              Barbeiros
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Página em desenvolvimento
            </p>
          </div>
          <div className="max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Esta funcionalidade está sendo desenvolvida e estará disponível em
              breve.
            </p>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  ),
});
