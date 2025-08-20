/**
 * 🎯 Error taxonomy and handling strategy
 * Centralized error classification and handling patterns
 */

export const ErrorTypes = {
  // Network/API related
  NETWORK: "NETWORK",
  API_ERROR: "API_ERROR",
  TIMEOUT: "TIMEOUT",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",

  // Validation/Input related
  VALIDATION: "VALIDATION",
  FORM_ERROR: "FORM_ERROR",

  // Application logic
  BUSINESS_RULE: "BUSINESS_RULE",
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",

  // System/Technical
  RUNTIME: "RUNTIME",
  CONFIGURATION: "CONFIGURATION",

  // Unknown/Unexpected
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorType = (typeof ErrorTypes)[keyof typeof ErrorTypes];

export interface AppError {
  type: ErrorType;
  code: string;
  message: string;
  details?: unknown;
  context?: Record<string, unknown>;
  timestamp?: Date;
  recoverable?: boolean;
}

export interface ErrorHandlingStrategy {
  showToast?: boolean;
  logError?: boolean;
  reportError?: boolean;
  retryable?: boolean;
  fallbackAction?: () => void;
}

// Error classification helpers
export function classifyHttpError(status: number): ErrorType {
  if (status >= 500) return ErrorTypes.API_ERROR;
  if (status === 404) return ErrorTypes.NOT_FOUND;
  if (status === 401) return ErrorTypes.UNAUTHORIZED;
  if (status === 403) return ErrorTypes.FORBIDDEN;
  if (status >= 400) return ErrorTypes.VALIDATION;
  return ErrorTypes.UNKNOWN;
}

export function createAppError(
  type: ErrorType,
  code: string,
  message: string,
  options: Partial<AppError> = {},
): AppError {
  return {
    type,
    code,
    message,
    timestamp: new Date(),
    recoverable: true,
    ...options,
  };
}

// Standard error handling strategies by type
export const errorStrategies: Record<ErrorType, ErrorHandlingStrategy> = {
  [ErrorTypes.NETWORK]: {
    showToast: true,
    logError: true,
    retryable: true,
  },
  [ErrorTypes.API_ERROR]: {
    showToast: true,
    logError: true,
    reportError: true,
    retryable: false,
  },
  [ErrorTypes.TIMEOUT]: {
    showToast: true,
    logError: true,
    retryable: true,
  },
  [ErrorTypes.UNAUTHORIZED]: {
    showToast: true,
    logError: true,
    retryable: false,
  },
  [ErrorTypes.FORBIDDEN]: {
    showToast: true,
    logError: true,
    retryable: false,
  },
  [ErrorTypes.NOT_FOUND]: {
    showToast: true,
    logError: false,
    retryable: false,
  },
  [ErrorTypes.VALIDATION]: {
    showToast: false, // Usually shown in form context
    logError: false,
    retryable: false,
  },
  [ErrorTypes.FORM_ERROR]: {
    showToast: false,
    logError: false,
    retryable: false,
  },
  [ErrorTypes.BUSINESS_RULE]: {
    showToast: true,
    logError: true,
    retryable: false,
  },
  [ErrorTypes.RESOURCE_CONFLICT]: {
    showToast: true,
    logError: true,
    retryable: false,
  },
  [ErrorTypes.RUNTIME]: {
    showToast: true,
    logError: true,
    reportError: true,
    retryable: false,
  },
  [ErrorTypes.CONFIGURATION]: {
    showToast: true,
    logError: true,
    reportError: true,
    retryable: false,
  },
  [ErrorTypes.UNKNOWN]: {
    showToast: true,
    logError: true,
    reportError: true,
    retryable: false,
  },
};
