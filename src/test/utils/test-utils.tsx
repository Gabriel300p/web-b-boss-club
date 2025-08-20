/**
 * 🧪 Test utilities and custom render functions
 *
 * Provides configured providers and utilities for testing
 */
/* eslint-disable react-refresh/only-export-components */
import { ErrorBoundary } from "@/shared/components/ui/toast/_index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

// Create a new QueryClient for each test to avoid cache pollution
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed requests in tests
        gcTime: 0, // Disable cache
      },
    },
  });

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

function TestProviders({ children, queryClient }: TestProvidersProps) {
  const client = queryClient || createTestQueryClient();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ErrorBoundary>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

// Custom render function that includes all providers
const customRender = (
  ui: ReactElement,
  { queryClient, ...renderOptions }: CustomRenderOptions = {},
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient}>{children}</TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock data generators
export const mockComunicacao = (overrides = {}) => ({
  id: "1",
  titulo: "Test Communication",
  autor: "Test Author",
  tipo: "Comunicado" as const,
  descricao: "Test description",
  dataCriacao: new Date("2024-01-01"),
  dataAtualizacao: new Date("2024-01-01"),
  ...overrides,
});

export const mockComunicacoes = (count = 3) =>
  Array.from({ length: count }, (_, index) =>
    mockComunicacao({
      id: `${index + 1}`,
      titulo: `Communication ${index + 1}`,
      autor: `Author ${index + 1}`,
    }),
  );

// Re-export everything
export * from "@testing-library/react";
export { createTestQueryClient, customRender as render };
