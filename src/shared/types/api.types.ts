// Tipos base para todas as APIs
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

// Tipos para paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para configurações genéricas
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  environment: "development" | "staging" | "production";
  features: Record<string, boolean>;
}

// Tipos para logs e auditoria genéricos
export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Tipos para uploads de arquivos genéricos
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Tipos para webhooks genéricos
export interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
  lastTriggeredAt?: string;
}

// Tipos para integrações externas genéricas
export interface ExternalIntegration {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}
