import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

// Tipos para as respostas da API
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

import { CURRENT_API_URL } from "../config/environment.js";
import { logError } from "../utils/api.utils.js";

// Configuração base do axios - URL direta do arquivo de configuração
const API_BASE_URL = CURRENT_API_URL;

/**
 * 🚀 Serviço HTTP base para comunicação com o backend
 * Configurado com interceptors para tokens e tratamento de erros
 */
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * 🔧 Configura interceptors para requests e responses
   */
  private setupInterceptors(): void {
    // Request interceptor - adiciona token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - trata erros e tokens expirados
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`📥 Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        logError(error, "API Service");

        if (error.response?.status === 401) {
          // Token expirado ou inválido
          this.handleUnauthorized();
        }
        return Promise.reject(this.formatError(error));
      },
    );
  }

  /**
   * 🔑 Obtém token de autenticação do localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("access_token");
  }

  /**
   * 🚫 Trata erro de autenticação (401)
   */
  private handleUnauthorized(): void {
    // Remove token expirado
    localStorage.removeItem("access_token");
    localStorage.removeItem("temp_token");

    // Redireciona para login se não estiver na página de login
    if (window.location.pathname !== "/auth/login") {
      window.location.href = "/auth/login";
    }
  }

  /**
   * 📝 Formata erro da API para uso interno
   */
  private formatError(error: AxiosError<ApiError>): ApiError {
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      status: error.response?.status || 500,
      error: "Network Error",
      message: error.message || "Erro de conexão com o servidor",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 📤 Faz requisição GET
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.get<T>(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * 📤 Faz requisição POST
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * 📤 Faz requisição PUT
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * 📤 Faz requisição PATCH
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.patch<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * 📤 Faz requisição DELETE
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.delete<T>(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * 🔑 Define token de autenticação
   */
  setAuthToken(token: string): void {
    localStorage.setItem("access_token", token);
  }

  /**
   * 🔑 Define token temporário para MFA
   */
  setTempToken(token: string): void {
    localStorage.setItem("temp_token", token);
  }

  /**
   * 🔑 Obtém token temporário para MFA
   */
  getTempToken(): string | null {
    return localStorage.getItem("temp_token");
  }

  /**
   * 🧹 Remove todos os tokens
   */
  clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("temp_token");
  }

  /**
   * 🔍 Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();
