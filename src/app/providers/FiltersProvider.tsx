import { NuqsAdapter } from "nuqs/adapters/react";
import { type ReactNode } from "react";

interface FiltersProviderProps {
  children: ReactNode;
}

export function FiltersProvider({ children }: FiltersProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
