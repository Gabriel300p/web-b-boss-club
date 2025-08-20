// 🎯 Public API for Auth Feature
// Main exports for clean imports
// Updated: Sistema novo de documentação (teste final)

// Types (most commonly used)
export type { AuthStore as AuthState, User } from "@app/store/auth";
export type { LoginCredentials, RegisterCredentials } from "./types/auth";

// Pages
export { LoginPage } from "./pages/LoginPage";

// Schemas (for external validation)
export {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "./schemas/auth.schemas";

// Main hook (if needed externally)
// Note: Other hooks should be imported directly for better tree-shaking
// Example: import { useSpecificHook } from '@features/auth/hooks/useSpecificHook';
