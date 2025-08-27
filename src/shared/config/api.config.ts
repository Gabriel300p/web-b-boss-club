/**
 * ⚙️ Configurações genéricas para APIs
 */

export const API_CONFIG = {
  // URL base da API
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3002",

  // Timeout das requisições (em ms)
  TIMEOUT: 10000,

  // Headers padrão
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  // Configurações de retry
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000,
    MAX_DELAY: 10000,
  },

  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Configurações de cache
  CACHE: {
    // Tempo de vida do cache (em ms) - 5 minutos
    TTL: 5 * 60 * 1000,

    // Tamanho máximo do cache
    MAX_SIZE: 100,
  },
} as const;

/**
 * 🔧 Função para obter URL completa de um endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * 🔧 Função para obter endpoint com parâmetros
 */
export function getEndpointWithParams(
  endpoint: string,
  params: Record<string, string | number>,
): string {
  let result = endpoint;

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }

  return result;
}

/**
 * 🔧 Função para obter headers de autenticação
 */
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    ...API_CONFIG.DEFAULT_HEADERS,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 🔧 Função para obter configuração de timeout
 */
export function getTimeoutConfig(customTimeout?: number): number {
  return customTimeout || API_CONFIG.TIMEOUT;
}
