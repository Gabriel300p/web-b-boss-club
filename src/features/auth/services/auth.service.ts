// src/features/auth/services/auth.service.ts
import axios from "axios";
import type { AuthError, AuthResponse, LoginCredentials } from "../types/auth";

// Create custom auth error
function createAuthError(code: AuthError["code"], message: string): AuthError {
  const error = new Error(message) as AuthError;
  error.code = code;
  return error;
}

export async function loginRequest(
  values: LoginCredentials,
): Promise<AuthResponse> {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
        },
      },
    );

    return data;
  } catch (error: unknown) {
    interface AxiosError {
      response?: { status: number };
      code?: string;
      message?: string;
    }
    const axiosError = error as AxiosError;
    // Enhanced error handling
    if (axiosError.response?.status === 401) {
      throw createAuthError("invalid_credentials", "Email ou senha incorretos");
    }
    if (axiosError.response?.status === 404) {
      throw createAuthError("user_not_found", "Usuário não encontrado");
    }
    if (axiosError.response?.status === 423) {
      throw createAuthError(
        "account_locked",
        "Conta temporariamente bloqueada",
      );
    }
    if (!navigator.onLine || axiosError.code === "NETWORK_ERROR") {
      throw createAuthError("network_error", "Erro de conexão com o servidor");
    }

    throw createAuthError(
      "server_error",
      axiosError.message || "Erro interno do servidor",
    );
  }
}

export async function checkAuthRequest(): Promise<{
  user: AuthResponse["user"] | null;
}> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { user: null }; // Return null instead of throwing error
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
        },
      },
    );

    return { user: data.user };
  } catch (error: unknown) {
    interface AxiosError {
      response?: { status: number };
      message?: string;
    }
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      localStorage.removeItem("access_token");
    }

    // Return null instead of throwing error for failed auth checks
    return { user: null };
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      await axios.post(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          },
        },
      );
    }
  } catch (error) {
    // Silent fail for logout - we'll clear local storage anyway
    console.warn("Logout request failed:", error);
  }
}

export const authService = {
  login: loginRequest,
  checkAuth: checkAuthRequest,
  logout: logoutRequest,
};

export async function forgotPasswordRequest(values: { email: string }) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SUPABASE_URL}/auth/reset-password`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    },
  );

  return data;
}

export async function mfaVerificationRequest(values: { email: string }) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SUPABASE_URL}/auth/verify-mfa`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    },
  );

  return data;
}
