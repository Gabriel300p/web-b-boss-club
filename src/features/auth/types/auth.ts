// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "moderator";
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  access_token: string;
  refresh_token?: string;
}

export interface AuthError extends Error {
  code:
    | "invalid_credentials"
    | "user_not_found"
    | "account_locked"
    | "network_error"
    | "unauthorized"
    | "server_error"
    | "validation_error";
  message: string;
}

// Forgot password credentials
export interface ForgotPasswordCredentials {
  email: string;
}

// MFA verification credentials
export interface MfaVerificationCredentials {
  email: string;
  code: string;
}

export interface AuthContextType {
  // State
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentLoginEmail: string | null;

  // Actions
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  forgotPassword: (credentials: ForgotPasswordCredentials) => void;
  verifyMfa: (credentials: MfaVerificationCredentials) => void;
  resendMfaCode: () => void;
  clearError: () => void;
  checkAuth: () => Promise<{ user: AuthResponse["user"] }>;

  // Mutation states - Login
  isLoginPending: boolean;
  loginError: AuthError | null;

  // Mutation states - Logout
  isLogoutPending: boolean;
  logoutError: AuthError | null;

  // Mutation states - Forgot Password
  isForgotPasswordPending: boolean;
  forgotPasswordError: AuthError | null;

  // Mutation states - MFA
  isMfaVerificationPending: boolean;
  mfaVerificationError: AuthError | null;
  isResendMfaCodePending: boolean;
  resendMfaCodeError: AuthError | null;
}
