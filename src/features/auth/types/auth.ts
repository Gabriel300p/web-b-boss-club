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
  clearError: () => void;
  checkAuth: () => Promise<{ user: AuthResponse["user"] }>;

  // Mutation states
  isLoginPending: boolean;
  isLogoutPending: boolean;
  loginError: AuthError | null;
  logoutError: AuthError | null;
}
