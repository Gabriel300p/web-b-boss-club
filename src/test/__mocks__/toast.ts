// Test mock for toast context (no React components to satisfy react-refresh rule)
export const mockToast = {
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
  showToast: () => {},
};

export const useToast = () => mockToast;

export function MockToastProvider({ children }: { children: unknown }) {
  return children as object as any;
}
