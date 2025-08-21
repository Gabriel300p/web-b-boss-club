import { useContext } from "react";
import { AuthContext } from "../contexts/authContextDefinition";
import type { AuthContextType } from "../types/auth";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Hook for getting current user email globally
export function useCurrentUserEmail(): string | null {
  const { user, currentLoginEmail } = useAuth();
  return user?.email || currentLoginEmail;
}

// Hook for auth status checking
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isLoggedIn: isAuthenticated && !!user,
    isGuest: !isAuthenticated && !isLoading,
  };
}

// Hook for auth actions
export function useAuthActions() {
  const { login, logout, clearError, checkAuth } = useAuth();

  return {
    login,
    logout,
    clearError,
    checkAuth,
  };
}
