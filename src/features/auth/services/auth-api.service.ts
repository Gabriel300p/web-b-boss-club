import type { ApiResponse } from "../../../shared/services/api.service.js";
import { apiService } from "../../../shared/services/api.service.js";
import type { UserRole } from "../types/auth.js";

// Tipos para as APIs de autenticação
export interface LoginRequest {
  credential: string; // email ou CPF
  password: string;
}

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

export interface VerifyMfaRequest {
  code: string; // código de 6 dígitos
}

export interface VerifyMfaResponse {
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
  access_token?: string; // Token do Supabase para autenticação
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  displayName?: string;
  avatarUrl?: string;
  cpf?: string;
  passport?: string;
  isforeigner: boolean;
  ownedBarbershops?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

export interface ProfileUpdateRequest {
  displayName?: string;
  avatarUrl?: string;
}

export interface ProfileUpdateResponse {
  user: UserProfile;
  ownedBarbershops?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

/**
 * 🔐 Serviço para APIs de autenticação e perfil do usuário
 * Usa o serviço HTTP base com interceptors configurados
 */
export class AuthApiService {
  private readonly baseUrl = "/auth";

  /**
   * 🔑 Faz login do usuário
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      `${this.baseUrl}/login`,
      credentials,
    );

    // Se login for bem-sucedido e não precisar de verificação, salva o token
    if (response.data.token) {
      apiService.setAuthToken(response.data.token);
    }

    // Se precisar de verificação, salva o token temporário
    if (response.data.tempToken) {
      apiService.setTempToken(response.data.tempToken);
    }

    return response;
  }

  /**
   * 🔐 Verifica código de verificação
   */
  async verifyMfa(code: string): Promise<ApiResponse<VerifyMfaResponse>> {
    const tempToken = apiService.getTempToken();

    if (!tempToken) {
      throw new Error("Token temporário de verificação não encontrado");
    }

    const response = await apiService.post<VerifyMfaResponse>(
      `${this.baseUrl}/verify-mfa`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      },
    );

    return response;
  }

  /**
   * 👤 Obtém perfil do usuário autenticado
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    // Tenta primeiro com o token de autenticação normal
    const authToken = this.getAuthToken();

    if (authToken) {
      return await apiService.get<UserProfile>(`${this.baseUrl}/profile`);
    }

    // Se não tiver token normal, tenta com o token temporário de verificação
    const tempToken = apiService.getTempToken();

    if (tempToken) {
      const response = await apiService.get<UserProfile>(
        `${this.baseUrl}/profile`,
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        },
      );

      // Se conseguir buscar o perfil com token temporário, remove ele
      if (response.data) {
        localStorage.removeItem("temp_token");
      }

      return response;
    }

    throw new Error("Nenhum token de autenticação encontrado");
  }

  /**
   * ✏️ Atualiza perfil do usuário
   */
  async updateProfile(
    profileData: ProfileUpdateRequest,
  ): Promise<ApiResponse<ProfileUpdateResponse>> {
    return await apiService.patch<ProfileUpdateResponse>(
      `${this.baseUrl}/profile`,
      profileData,
    );
  }

  /**
   * 🔄 Solicita reset de senha
   */
  async resetPassword(
    email: string,
  ): Promise<
    ApiResponse<{ message: string; success: boolean; tempToken?: string }>
  > {
    return await apiService.post<{
      message: string;
      success: boolean;
      tempToken?: string;
    }>(`${this.baseUrl}/reset-password`, { email });
  }

  /**
   * ✅ Confirma email com token
   */
  async confirmEmail(
    token: string,
    email: string,
  ): Promise<ApiResponse<{ message: string; success: boolean }>> {
    return await apiService.post<{ message: string; success: boolean }>(
      `${this.baseUrl}/confirm-email`,
      { token, email },
    );
  }

  /**
   * 🚪 Faz logout do usuário
   */
  logout(): void {
    apiService.clearTokens();
    // NÃO redireciona aqui - o redirecionamento é feito pelo AuthContext
    // window.location.href = "/auth/login";
  }

  /**
   * 🔍 Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  /**
   * 🔑 Obtém token de autenticação atual
   */
  getAuthToken(): string | null {
    return localStorage.getItem("access_token");
  }

  /**
   * 🔑 Obtém token temporário de verificação
   */
  getTempToken(): string | null {
    return apiService.getTempToken();
  }

  /**
   * 🔄 Renova token de autenticação (se implementado no backend)
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return await apiService.post<{ token: string }>(
      `${this.baseUrl}/refresh-token`,
    );
  }

  /**
   * 🔄 Reenvia código de verificação
   */
  async resendMfaCode(): Promise<
    ApiResponse<{ message: string; success: boolean }>
  > {
    const tempToken = apiService.getTempToken();

    if (!tempToken) {
      throw new Error("Token temporário de verificação não encontrado");
    }

    return await apiService.post<{ message: string; success: boolean }>(
      `${this.baseUrl}/resend-mfa`,
      {},
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      },
    );
  }

  /**
   * 🔑 Altera senha do usuário autenticado
   */
  async changePassword(
    newPassword: string,
    confirmPassword: string,
  ): Promise<ApiResponse<{ message: string; success: boolean }>> {
    // Para change-password, priorizar temp_token (primeiro login) sobre access_token
    const authToken = this.getAuthToken();
    const tempToken = this.getTempToken();
    const token = tempToken || authToken; // ← Invertido: temp_token primeiro!

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    return await apiService.post<{ message: string; success: boolean }>(
      `${this.baseUrl}/change-password`,
      { newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}

// Instância singleton do serviço de autenticação
export const authApiService = new AuthApiService();
