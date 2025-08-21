// 🎯 Public API for Auth Feature
// Main exports for clean imports
// Updated: Sistema novo de documentação com AuthContext

// Types (most commonly used)
export type { AuthStore as AuthState, User } from "@app/store/auth";
export type {
  AuthContextType,
  AuthError,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "./types/auth";

// Context and Hooks
export { AuthProvider } from "./contexts/AuthContext";
export {
  useAuth,
  useAuthActions,
  useAuthStatus,
  useCurrentUserEmail,
} from "./hooks/useAuth";

// Pages
export { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
export { LoginPage } from "./pages/LoginPage";
export { MfaVerificationPage } from "./pages/MfaVerificationPage";

// Animation Components
export {
  AuthButton,
  AuthError as AuthErrorMessage,
  AuthForm,
  AuthPageWrapper,
  AuthSuccess as AuthSuccessMessage,
} from "./components/AuthAnimations";

// Schemas (for external validation)
export {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "./schemas/auth.schema";

// Services (if needed externally)
export { authService } from "./services/auth.service";

// Main hook (if needed externally)
// Note: Other hooks should be imported directly for better tree-shaking
// Example: import { useSpecificHook } from '@features/auth/hooks/useSpecificHook';
