import type { ReactNode } from "react";

const noop = () => {
  /* test noop */
};

export function MockToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const useToast = () => ({
  success: noop,
  error: noop,
  warning: noop,
  info: noop,
  showToast: noop,
});
