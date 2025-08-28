import { Button } from "@shared/components/ui/button";

interface FallbackProps {
  error?: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({ error, resetError }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-neutral-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-100 sm:text-5xl">
                Oops! Algo deu errado
              </h1>
              <p className="mt-1 text-base text-neutral-400">
                Ocorreu um erro inesperado na aplicação.
              </p>
              {error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-neutral-300">
                    Detalhes do erro
                  </summary>
                  <pre className="mt-2 text-xs whitespace-pre-wrap text-red-500">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Button
                onClick={resetError}
                variant="default"
                className="text-black"
              >
                Tentar novamente
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Recarregar página
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
