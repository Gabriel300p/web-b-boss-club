/**
 * 🔑 TokenManager - Gerenciamento Centralizado de Tokens
 *
 * Resolve problemas de sincronização entre Zustand store e localStorage
 * Fornece interface única para gerenciamento de todos os tokens
 */

import { useAuthStore } from "../../app/store/auth";

// 🎯 Tipos para tokens
export interface TokenData {
  token: string;
  expiresAt?: Date;
  issuedAt: Date;
}

export interface TokenManagerConfig {
  enableDebugLogging: boolean;
  autoRefreshThreshold: number; // minutos antes da expiração
  maxRetryAttempts: number;
}

// 🎯 Configuração padrão
const DEFAULT_CONFIG: TokenManagerConfig = {
  enableDebugLogging: process.env.NODE_ENV === "development",
  autoRefreshThreshold: 5, // 5 minutos antes da expiração
  maxRetryAttempts: 3,
};

class TokenManager {
  private static instance: TokenManager;
  private config: TokenManagerConfig;
  // private refreshPromise: Promise<string> | null = null; // Para implementação futura

  private constructor(config: Partial<TokenManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupEventListeners();
  }

  /**
   * 🏭 Singleton pattern
   */
  public static getInstance(
    config?: Partial<TokenManagerConfig>,
  ): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager(config);
    }
    return TokenManager.instance;
  }

  /**
   * 🔧 Configura listeners para sincronização
   */
  private setupEventListeners(): void {
    // Listener para mudanças no localStorage de outras abas
    window.addEventListener("storage", this.handleStorageChange.bind(this));

    // Listener para mudanças no store Zustand
    if (typeof window !== "undefined") {
      useAuthStore.subscribe(this.handleStoreChange.bind(this));
    }
  }

  /**
   * 📡 Handler para mudanças no localStorage
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === "access_token" || event.key === "temp_token") {
      this.log("Storage change detected", {
        key: event.key,
        newValue: event.newValue,
      });
      this.syncWithStore();
    }
  }

  /**
   * 📡 Handler para mudanças no store Zustand
   */
  private handleStoreChange(
    state: { isAuthenticated: boolean },
    prevState: { isAuthenticated: boolean },
  ): void {
    // Se usuário foi deslogado, limpa tokens
    if (prevState.isAuthenticated && !state.isAuthenticated) {
      this.log("User logged out, clearing tokens");
      this.clearAllTokens();
    }
  }

  /**
   * 🔑 Define access token
   */
  public setAccessToken(token: string, expiresIn?: number): void {
    try {
      const tokenData: TokenData = {
        token,
        expiresAt: expiresIn
          ? new Date(Date.now() + expiresIn * 1000)
          : undefined,
        issuedAt: new Date(),
      };

      localStorage.setItem("access_token", JSON.stringify(tokenData));
      this.log("Access token set", {
        token: token.substring(0, 10) + "...",
        expiresAt: tokenData.expiresAt?.toISOString(),
      });

      this.syncWithStore();
    } catch (error) {
      this.log("Error setting access token", error);
      throw new Error("Failed to set access token");
    }
  }

  /**
   * 🔑 Obtém access token
   */
  public getAccessToken(): string | null {
    try {
      const tokenDataStr = localStorage.getItem("access_token");
      if (!tokenDataStr) return null;

      const tokenData: TokenData = JSON.parse(tokenDataStr);

      // Verifica se token expirou
      if (tokenData.expiresAt && new Date() > tokenData.expiresAt) {
        this.log("Access token expired", { expiresAt: tokenData.expiresAt });
        this.clearAccessToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      this.log("Error getting access token", error);
      return null;
    }
  }

  /**
   * 🔑 Define temp token
   */
  public setTempToken(token: string): void {
    try {
      localStorage.setItem("temp_token", token);
      this.log("Temp token set", { token: token.substring(0, 10) + "..." });
    } catch (error) {
      this.log("Error setting temp token", error);
      throw new Error("Failed to set temp token");
    }
  }

  /**
   * 🔑 Obtém temp token
   */
  public getTempToken(): string | null {
    try {
      return localStorage.getItem("temp_token");
    } catch (error) {
      this.log("Error getting temp token", error);
      return null;
    }
  }

  /**
   * 🗑️ Limpa todos os tokens
   */
  public clearAllTokens(): void {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("temp_token");
      this.log("All tokens cleared");
      this.syncWithStore();
    } catch (error) {
      this.log("Error clearing tokens", error);
    }
  }

  /**
   * 🧹 Limpa todos os dados de autenticação (tokens + fluxos especiais)
   */
  public clearAllAuthData(): void {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("temp_token");
      localStorage.removeItem("forgot_password_email");
      this.log("All auth data cleared");
      this.syncWithStore();
    } catch (error) {
      this.log("Error clearing all auth data", error);
    }
  }

  /**
   * 🗑️ Limpa apenas access token
   */
  public clearAccessToken(): void {
    try {
      localStorage.removeItem("access_token");
      this.log("Access token cleared");
      this.syncWithStore();
    } catch (error) {
      this.log("Error clearing access token", error);
    }
  }

  /**
   * 🗑️ Limpa apenas temp token
   */
  public clearTempToken(): void {
    try {
      localStorage.removeItem("temp_token");
      this.log("Temp token cleared");
    } catch (error) {
      this.log("Error clearing temp token", error);
    }
  }

  /**
   * 📧 Define email para fluxo de forgot password
   */
  public setForgotPasswordEmail(email: string): void {
    try {
      localStorage.setItem("forgot_password_email", email);
      this.log("Forgot password email set", { email });
    } catch (error) {
      this.log("Error setting forgot password email", error);
      throw new Error("Failed to set forgot password email");
    }
  }

  /**
   * 📧 Obtém email para fluxo de forgot password
   */
  public getForgotPasswordEmail(): string | null {
    try {
      return localStorage.getItem("forgot_password_email");
    } catch (error) {
      this.log("Error getting forgot password email", error);
      return null;
    }
  }

  /**
   * 🗑️ Limpa email de forgot password
   */
  public clearForgotPasswordEmail(): void {
    try {
      localStorage.removeItem("forgot_password_email");
      this.log("Forgot password email cleared");
    } catch (error) {
      this.log("Error clearing forgot password email", error);
    }
  }

  /**
   * 🔄 Sincroniza com Zustand store
   */
  public syncWithStore(): void {
    try {
      const accessToken = this.getAccessToken();
      const isAuthenticated = !!accessToken;

      // Atualiza store apenas se necessário
      const currentState = useAuthStore.getState();
      if (currentState.isAuthenticated !== isAuthenticated) {
        if (isAuthenticated) {
          // Token válido - mantém usuário logado
          this.log("Syncing: User authenticated");
        } else {
          // Token inválido - desloga usuário
          this.log("Syncing: User not authenticated, logging out");
          useAuthStore.getState().logout();
        }
      }
    } catch (error) {
      this.log("Error syncing with store", error);
    }
  }

  /**
   * ✅ Verifica se token é válido
   */
  public isTokenValid(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  /**
   * ⏰ Obtém data de expiração do token
   */
  public getTokenExpiration(): Date | null {
    try {
      const tokenDataStr = localStorage.getItem("access_token");
      if (!tokenDataStr) return null;

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      return tokenData.expiresAt || null;
    } catch (error) {
      this.log("Error getting token expiration", error);
      return null;
    }
  }

  /**
   * 🔄 Verifica se token precisa ser renovado
   */
  public needsRefresh(): boolean {
    const expiresAt = this.getTokenExpiration();
    if (!expiresAt) return false;

    const now = new Date();
    const threshold = new Date(
      now.getTime() + this.config.autoRefreshThreshold * 60 * 1000,
    );

    return expiresAt <= threshold;
  }

  /**
   * 📝 Sistema de logging
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableDebugLogging) {
      console.log(`[TokenManager] ${message}`, data || "");
    }
  }

  /**
   * 🔧 Atualiza configuração
   */
  public updateConfig(newConfig: Partial<TokenManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log("Config updated", this.config);
  }

  /**
   * 📊 Obtém status dos tokens
   */
  public getTokenStatus(): {
    hasAccessToken: boolean;
    hasTempToken: boolean;
    isAccessTokenValid: boolean;
    expiresAt: Date | null;
    needsRefresh: boolean;
  } {
    return {
      hasAccessToken: !!this.getAccessToken(),
      hasTempToken: !!this.getTempToken(),
      isAccessTokenValid: this.isTokenValid(),
      expiresAt: this.getTokenExpiration(),
      needsRefresh: this.needsRefresh(),
    };
  }

  /**
   * 🔍 Verifica se há fluxos especiais ativos
   */
  public hasActiveSpecialFlows(): {
    hasForgotPasswordFlow: boolean;
    hasMfaFlow: boolean;
    hasAnySpecialFlow: boolean;
  } {
    const hasForgotPasswordFlow = !!this.getForgotPasswordEmail();
    const hasMfaFlow = !!this.getTempToken();

    return {
      hasForgotPasswordFlow,
      hasMfaFlow,
      hasAnySpecialFlow: hasForgotPasswordFlow || hasMfaFlow,
    };
  }
}

// 🎯 Exporta instância singleton
export const tokenManager = TokenManager.getInstance();

// 🎯 Exporta classe para testes
export { TokenManager };
