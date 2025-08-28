// Test mock for toast context (no React components to satisfy react-refresh rule)
export { useToast } from "./toast-hook.js";

export const mockToast = {
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
  showToast: () => {},
};

export function MockToastProvider({ children }: { children: unknown }) {
  return children as object as unknown;
}
