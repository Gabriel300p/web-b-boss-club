import { z } from "zod";
import { userRoleSchema, userStatusSchema } from "../schemas/auth.schema";

// Tipos derivados dos schemas Zod
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;

// Auth types para o novo fluxo backend
export interface LoginCredentials {
  credential: string; // email ou CPF
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// Resposta do login que pode requerer verificação
export interface LoginResponse {
  mfaRequired: boolean;
  tempToken?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    displayName?: string;
  };
}

// Resposta da verificação de código
export interface MfaVerificationResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    displayName?: string;
    mfaVerified: boolean;
  };
  isFirstLogin: boolean;
}

// Resposta de autenticação completa (após verificação)
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  access_token: string;
  refresh_token?: string;
  isFirstLogin?: boolean; // Flag para indicar se é primeiro login
}

export interface AuthError extends Error {
  code:
    | "invalid_credentials"
    | "user_not_found"
    | "account_locked"
    | "network_error"
    | "unauthorized"
    | "server_error"
    | "validation_error"
    | "mfa_required"
    | "mfa_invalid"
    | "mfa_expired"
    | "duplicate_cpf"
    | "duplicate_email"
    | "invalid_cpf"
    | "invalid_email";
  message: string;
}

// Forgot password credentials
export interface ForgotPasswordCredentials {
  email: string;
}

// Credenciais de verificação de código (apenas código)
export interface MfaVerificationCredentials {
  code: string; // código de 6 dígitos
}

// Change password credentials
export interface ChangePasswordCredentials {
  newPassword: string;
  confirmPassword: string;
}

export interface AuthContextType {
  // State
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentLoginEmail: string | null;
  mfaRequired: boolean;
  tempToken: string | null;

  // Actions
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  forgotPassword: (credentials: ForgotPasswordCredentials) => void;
  verifyMfa: (credentials: MfaVerificationCredentials) => void;
  resetPassword: (credentials: ChangePasswordCredentials) => void;
  resendMfaCode: () => void;
  clearError: () => void;
  checkAuth: () => Promise<{ user: AuthResponse["user"] }>;
  setMfaRequired: (required: boolean, tempToken?: string) => void;

  // Mutation states - Login
  isLoginPending: boolean;
  loginError: AuthError | null;

  // Mutation states - Logout
  isLogoutPending: boolean;
  logoutError: AuthError | null;

  // Mutation states - Forgot Password
  isForgotPasswordPending: boolean;
  forgotPasswordError: AuthError | null;

  // Mutation states - Verification
  isMfaVerificationPending: boolean;
  mfaVerificationError: AuthError | null;
  isResendMfaCodePending: boolean;
  resendMfaCodeError: AuthError | null;

  // Mutation states - Reset Password
  isResetPasswordPending: boolean;
  resetPasswordError: AuthError | null;
}
