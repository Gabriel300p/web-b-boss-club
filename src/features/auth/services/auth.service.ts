// src/features/auth/services/auth.service.ts
import type {
  AuthError,
  AuthResponse,
  LoginCredentials,
  LoginResponse,
  MfaVerificationCredentials,
} from "../types/auth";
import { authApiService } from "./auth-api.service.js";

// Create custom auth error
function createAuthError(code: AuthError["code"], message: string): AuthError {
  const error = new Error(message) as AuthError;
  error.code = code;
  return error;
}

export async function loginRequest(
  values: LoginCredentials,
): Promise<LoginResponse> {
  try {
    const response = await authApiService.login(values);

    // Se login for bem-sucedido e não precisar de MFA, retorna diretamente
    if (!response.data.mfaRequired && response.data.token) {
      return response.data;
    }

    // Se precisar de MFA, retorna com flag
    if (response.data.mfaRequired) {
      return response.data;
    }

    throw createAuthError("server_error", "Resposta inválida do servidor");
  } catch (error: unknown) {
    // Trata erros do authApiService
    if (error instanceof Error) {
      // Mapeia códigos de erro do backend para códigos locais
      if (
        error.message.includes("credenciais") ||
        error.message.includes("senha")
      ) {
        throw createAuthError(
          "invalid_credentials",
          "Email/CPF ou senha incorretos",
        );
      }
      if (error.message.includes("não encontrado")) {
        throw createAuthError("user_not_found", "Usuário não encontrado");
      }
      if (
        error.message.includes("bloqueada") ||
        error.message.includes("suspensa")
      ) {
        throw createAuthError(
          "account_locked",
          "Conta temporariamente bloqueada",
        );
      }
      if (error.message.includes("rede") || error.message.includes("conexão")) {
        throw createAuthError(
          "network_error",
          "Erro de conexão com o servidor",
        );
      }

      throw createAuthError(
        "server_error",
        error.message || "Erro interno do servidor",
      );
    }

    throw createAuthError("server_error", "Erro desconhecido durante o login");
  }
}

export async function checkAuthRequest(): Promise<{
  user: AuthResponse["user"];
}> {
  try {
    const response = await authApiService.getProfile();

    // Mapeia UserProfile para o formato esperado
    const user: AuthResponse["user"] = {
      id: response.data.id,
      email: response.data.email,
      name: response.data.displayName || response.data.email,
      role: response.data.role, // Agora é UserRole validado pelo Zod
      avatar: response.data.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return { user };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message.includes("não autorizado") ||
        error.message.includes("expirado")
      ) {
        localStorage.removeItem("access_token");
        throw createAuthError("unauthorized", "Sessão expirada");
      }
      throw createAuthError("server_error", "Erro ao verificar autenticação");
    }
    throw createAuthError(
      "server_error",
      "Erro desconhecido ao verificar autenticação",
    );
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    await authApiService.logout();
  } catch {
    // Silent fail for logout - we'll clear local storage anyway
  }
}

export async function forgotPasswordRequest(values: {
  email: string;
}): Promise<{ message: string }> {
  try {
    const response = await authApiService.resetPassword(values.email);
    return { message: response.data.message };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("não encontrado")) {
        throw createAuthError("user_not_found", "Email não encontrado");
      }
      if (error.message.includes("rede") || error.message.includes("conexão")) {
        throw createAuthError(
          "network_error",
          "Erro de conexão com o servidor",
        );
      }
      throw createAuthError(
        "server_error",
        error.message || "Erro ao solicitar reset de senha",
      );
    }
    throw createAuthError(
      "server_error",
      "Erro desconhecido ao solicitar reset de senha",
    );
  }
}

export async function mfaVerificationRequest(
  values: MfaVerificationCredentials,
): Promise<AuthResponse> {
  try {
    const response = await authApiService.verifyMfa(values.code);

    if (response.data.success) {
      // Usa os dados retornados pela verificação MFA diretamente
      const result = {
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.displayName || response.data.user.email,
          role: response.data.user.role,
          avatar: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        access_token: "",
        isFirstLogin: response.data.isFirstLogin,
      };

      return result;
    }

    throw createAuthError("mfa_invalid", "Código MFA inválido");
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message.includes("inválido") ||
        error.message.includes("expirado")
      ) {
        throw createAuthError("mfa_invalid", "Código MFA inválido ou expirado");
      }
      if (error.message.includes("não encontrado")) {
        throw createAuthError("user_not_found", "Usuário não encontrado");
      }
      if (error.message.includes("rede") || error.message.includes("conexão")) {
        throw createAuthError(
          "network_error",
          "Erro de conexão com o servidor",
        );
      }
      throw createAuthError(
        "server_error",
        error.message || "Erro ao verificar código MFA",
      );
    }
    throw createAuthError(
      "server_error",
      "Erro desconhecido ao verificar código MFA",
    );
  }
}

export async function resendMfaCodeRequest(): Promise<{ message: string }> {
  try {
    // Simulate API call for now - implementar quando backend suportar
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Código reenviado com sucesso" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("rede") || error.message.includes("conexão")) {
        throw createAuthError(
          "network_error",
          "Erro de conexão com o servidor",
        );
      }
      throw createAuthError(
        "server_error",
        error.message || "Erro ao reenviar código MFA",
      );
    }
    throw createAuthError(
      "server_error",
      "Erro desconhecido ao reenviar código MFA",
    );
  }
}

export async function resetPasswordRequest(values: {
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  try {
    const response = await authApiService.changePassword(
      values.newPassword,
      values.confirmPassword,
    );
    return { message: response.data.message };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message.includes("não autorizado") ||
        error.message.includes("expirado")
      ) {
        throw createAuthError("unauthorized", "Sessão expirada");
      }
      if (error.message.includes("rede") || error.message.includes("conexão")) {
        throw createAuthError(
          "network_error",
          "Erro de conexão com o servidor",
        );
      }
      throw createAuthError(
        "server_error",
        error.message || "Erro ao alterar senha",
      );
    }
    throw createAuthError("server_error", "Erro desconhecido ao alterar senha");
  }
}

export const authService = {
  login: loginRequest,
  checkAuth: checkAuthRequest,
  logout: logoutRequest,
  forgotPassword: forgotPasswordRequest,
  verifyMfa: mfaVerificationRequest,
  resendMfaCode: resendMfaCodeRequest,
  resetPassword: resetPasswordRequest,
};
