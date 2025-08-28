import "@/app/i18n/init"; // i18n initialization side-effect
import { ErrorBoundary } from "@/shared/components/errors/ErrorBoundary";
import { SidebarProvider } from "@/shared/contexts/SidebarContext";
import type { PropsWithChildren } from "react";
import { FiltersProvider } from "./FiltersProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultMode="dark" enableSystem={true}>
        <QueryProvider>
          <FiltersProvider>
            <SidebarProvider>
              <ToastProvider>{children}</ToastProvider>
            </SidebarProvider>
          </FiltersProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
