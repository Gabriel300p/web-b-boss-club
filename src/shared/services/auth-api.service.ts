import type { ApiResponse } from "./api.service.js";
import { apiService } from "./api.service.js";

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
    role: string;
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
    role: string;
    displayName?: string;
    mfaVerified: boolean;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
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

    // Se login for bem-sucedido e não precisar de MFA, salva o token
    if (response.data.token) {
      apiService.setAuthToken(response.data.token);
    }

    // Se precisar de MFA, salva o token temporário
    if (response.data.tempToken) {
      apiService.setTempToken(response.data.tempToken);
    }

    return response;
  }

  /**
   * 🔐 Verifica código MFA
   */
  async verifyMfa(code: string): Promise<ApiResponse<VerifyMfaResponse>> {
    const tempToken = apiService.getTempToken();

    if (!tempToken) {
      throw new Error("Token temporário MFA não encontrado");
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

    // Remove token temporário após verificação bem-sucedida
    if (response.data.success) {
      localStorage.removeItem("temp_token");
    }

    return response;
  }

  /**
   * 👤 Obtém perfil do usuário autenticado
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return await apiService.get<UserProfile>(`${this.baseUrl}/profile`);
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
  ): Promise<ApiResponse<{ message: string; success: boolean }>> {
    return await apiService.post<{ message: string; success: boolean }>(
      `${this.baseUrl}/reset-password`,
      { email },
    );
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
    // Redireciona para login
    window.location.href = "/login";
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
   * 🔑 Obtém token temporário MFA
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
}

// Instância singleton do serviço de autenticação
export const authApiService = new AuthApiService();
