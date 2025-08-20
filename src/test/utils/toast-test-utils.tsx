/**
 * 🧪 Test Component for Toast System
 * React components for testing toast functionality
 */
import { ToastProvider } from "@/app/providers/ToastProvider";
import type { ReactElement } from "react";

// Wrapper component that provides toast context for tests
export function TestToastProvider({ children }: { children: ReactElement }) {
  return <ToastProvider>{children}</ToastProvider>;
}
