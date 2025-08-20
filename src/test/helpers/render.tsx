/**
 * 🔧 Test Render Helpers - Utilitários para renderização em testes
 */

import { ErrorBoundary } from "@shared/components/errors/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { createTestQueryClient } from "@/test/utils/test-utils";

/**
 * Configurações customizadas para renderização de testes
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

/**
 * Render customizado com providers automáticos
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </QueryClientProvider>
    );
  }

  return render(ui, {
    wrapper: TestWrapper,
    ...renderOptions,
  });
}

/**
 * Helpers para queries comuns
 */
export const testQueries = {
  // Buscar por aria-label ou texto
  getByTextOrLabel: (text: string) =>
    `[aria-label*="${text}"], *:contains("${text}")`,

  // Buscar botões de ação
  getActionButton: (action: "edit" | "delete" | "create" | "cancel") => {
    const labels = {
      edit: "Editar",
      delete: "Excluir",
      create: "Criar",
      cancel: "Cancelar",
    };
    return `[aria-label*="${labels[action]}"], button:contains("${labels[action]}")`;
  },
};

/**
 * Setup helpers para mocks comuns
 */
export const setupMocks = {
  matchMedia: () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    });
  },
};
