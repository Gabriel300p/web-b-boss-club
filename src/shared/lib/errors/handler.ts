/**
 * 🚨 Centralized error handler
 */
import { useToast } from "@shared/hooks";
import type { AppError, ErrorType } from "./taxonomy";
import { errorStrategies, ErrorTypes } from "./taxonomy";

export class ErrorHandler {
  private static instance: ErrorHandler;

  private toastHook?: ReturnType<typeof useToast>;

  private constructor(toastHook?: ReturnType<typeof useToast>) {
    this.toastHook = toastHook;
  }

  static getInstance(toastHook?: ReturnType<typeof useToast>): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(toastHook);
    }
    if (toastHook && !ErrorHandler.instance.toastHook) {
      ErrorHandler.instance.toastHook = toastHook;
    }
    return ErrorHandler.instance;
  }

  handle(error: AppError): void {
    const strategy = errorStrategies[error.type];

    // Log error if strategy dictates (preserved for production debugging)
    if (strategy.logError) {
      console.error(`[${error.type}] ${error.code}: ${error.message}`, {
        error,
        context: error.context,
        timestamp: error.timestamp,
      });
    }

    // Show toast notification if strategy dictates
    if (strategy.showToast && this.toastHook) {
      const toastType = this.getToastType(error.type);
      this.toastHook[toastType](
        error.message,
        `Error ${error.code}`,
        error.details as string,
      );
    }

    // Report error to external service if strategy dictates
    if (strategy.reportError) {
      this.reportError(error);
    }

    // Execute fallback action if available
    if (strategy.fallbackAction) {
      strategy.fallbackAction();
    }
  }

  private getToastType(errorType: ErrorType): "error" | "warning" | "info" {
    switch (errorType) {
      case ErrorTypes.VALIDATION:
      case ErrorTypes.FORM_ERROR:
      case ErrorTypes.BUSINESS_RULE:
        return "warning";
      case ErrorTypes.NOT_FOUND:
        return "info";
      default:
        return "error";
    }
  }

  private reportError(error: AppError): void {
    // Placeholder for external error reporting service
    // Could integrate with Sentry, LogRocket, etc.
    console.warn("Error reported:", error);
  }
}

// Convenience hook for using error handler
export function useErrorHandler() {
  const toast = useToast();
  return ErrorHandler.getInstance(toast);
}
