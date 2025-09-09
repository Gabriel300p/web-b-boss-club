import type { ApiError } from "../types/api.types.js";

/**
 * 🔍 Verifica se um erro é uma instância de ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    error !== undefined &&
    typeof error === "object" &&
    "status" in error &&
    "error" in error &&
    "message" in error &&
    "timestamp" in error
  );
}

/**
 * 📝 Formata erro para exibição ao usuário
 */
export function formatErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Erro desconhecido ocorreu";
}

/**
 * 🔢 Obtém código de status HTTP do erro
 */
export function getErrorStatus(error: unknown): number {
  if (isApiError(error)) {
    return error.status;
  }

  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    if (response?.status) {
      return response.status;
    }
  }

  return 500;
}

/**
 * 🚫 Verifica se erro é de autenticação (401)
 */
export function isAuthError(error: unknown): boolean {
  return getErrorStatus(error) === 401;
}

/**
 * 🚫 Verifica se erro é de autorização (403)
 */
export function isForbiddenError(error: unknown): boolean {
  return getErrorStatus(error) === 403;
}

/**
 * 🔍 Verifica se erro é de validação (400)
 */
export function isValidationError(error: unknown): boolean {
  return getErrorStatus(error) === 400;
}

/**
 * 🔍 Verifica se erro é de não encontrado (404)
 */
export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404;
}

/**
 * ⚡ Verifica se erro é de rate limit (429)
 */
export function isRateLimitError(error: unknown): boolean {
  return getErrorStatus(error) === 429;
}

/**
 * 💥 Verifica se erro é do servidor (5xx)
 */
export function isServerError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status >= 500 && status < 600;
}

/**
 * 🔄 Verifica se erro é de rede/conexão
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const errorObj = error as { code?: string; message?: string };
    return !!(
      errorObj.code === "NETWORK_ERROR" ||
      errorObj.message?.includes("Network Error") ||
      errorObj.message?.includes("timeout") ||
      errorObj.message?.includes("connection")
    );
  }
  return false;
}

/**
 * ⏰ Verifica se erro é de timeout
 */
export function isTimeoutError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const errorObj = error as { code?: string; message?: string };
    return !!(
      errorObj.code === "ECONNABORTED" ||
      errorObj.message?.includes("timeout") ||
      errorObj.message?.includes("timed out")
    );
  }
  return false;
}

/**
 * 🔑 Verifica se erro é de token expirado
 */
export function isTokenExpiredError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const errorObj = error as { message?: string };
    return !!(
      isAuthError(error) &&
      (errorObj.message?.includes("expired") ||
        errorObj.message?.includes("invalid") ||
        errorObj.message?.includes("token"))
    );
  }
  return false;
}

/**
 * 📊 Obtém detalhes do erro para logging
 */
export function getErrorDetails(error: unknown): {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
} {
  if (isApiError(error)) {
    return {
      status: error.status,
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
    };
  }

  return {
    status: getErrorStatus(error),
    message: formatErrorMessage(error),
    timestamp: new Date().toISOString(),
  };
}

/**
 * 🎯 Obtém mensagem de erro amigável para o usuário
 */
export function getUserFriendlyMessage(error: unknown): string {
  // Prioridade 1: Se tem userMessage específico do backend, usar ele
  if (error && typeof error === "object" && "userMessage" in error) {
    const userMessage = (error as { userMessage: string }).userMessage;
    if (userMessage && userMessage.trim()) {
      return userMessage;
    }
  }

  // Prioridade 2: Se tem message específico do backend, usar ele
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: string }).message;
    if (
      message &&
      message.trim() &&
      message !== "Request failed with status code 401" &&
      message !== "Request failed with status code 422" &&
      message !== "Request failed with status code 500" &&
      message !== "Token de autenticação inválido ou expirado"
    ) {
      return message;
    }
  }

  // Prioridade 3: Fallback para mensagens genéricas por status
  const status = getErrorStatus(error);

  switch (status) {
    case 400:
      return "Dados inválidos fornecidos. Verifique as informações e tente novamente.";

    case 401:
      return "Sessão expirada. Faça login novamente para continuar.";

    case 403:
      return "Acesso negado. Você não tem permissão para esta ação.";

    case 404:
      return "Recurso não encontrado. Verifique se o endereço está correto.";

    case 409:
      return "Conflito detectado. Os dados fornecidos já existem no sistema.";

    case 422:
      return "Dados inválidos. Verifique o formato das informações.";

    case 429:
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";

    case 500:
      return "Erro interno do servidor. Tente novamente em alguns minutos.";

    case 503:
      return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";

    default:
      if (isNetworkError(error)) {
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      }

      if (isTimeoutError(error)) {
        return "Tempo limite excedido. Tente novamente.";
      }

      return "Ocorreu um erro inesperado. Tente novamente.";
  }
}

/**
 * 🔄 Verifica se deve tentar novamente a requisição
 */
export function shouldRetry(error: unknown, attempt: number): boolean {
  const maxRetries = 3;

  if (attempt >= maxRetries) {
    return false;
  }

  // Retry para erros de servidor (5xx)
  if (isServerError(error)) {
    return true;
  }

  // Retry para erros de rede
  if (isNetworkError(error)) {
    return true;
  }

  // Retry para timeouts
  if (isTimeoutError(error)) {
    return true;
  }

  // Retry para rate limit (com delay)
  if (isRateLimitError(error)) {
    return true;
  }

  return false;
}

/**
 * ⏱️ Calcula delay para retry baseado no número de tentativa
 */
export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  const baseDelay = 1000;
  const maxDelay = 10000;

  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

  // Adiciona jitter para evitar thundering herd
  const jitter = Math.random() * 1000;

  return delay + jitter;
}

/**
 * 📝 Loga erro para debugging
 */
export function logError(error: unknown, context?: string): void {
  const details = getErrorDetails(error);
  const userMessage = getUserFriendlyMessage(error);

  console.error("🚨 API Error:", {
    context,
    ...details,
    userMessage,
    originalError: error,
  });
}

/**
 * 🎯 Cria objeto de erro padronizado
 */
export function createApiError(
  status: number,
  message: string,
  code?: string,
  details?: unknown,
): ApiError {
  return {
    status,
    error: getErrorType(status),
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 🏷️ Obtém tipo de erro baseado no status HTTP
 */
function getErrorType(status: number): string {
  if (status >= 400 && status < 500) {
    return "Client Error";
  }

  if (status >= 500 && status < 600) {
    return "Server Error";
  }

  return "Unknown Error";
}
