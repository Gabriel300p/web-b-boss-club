// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
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

// Common entity types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User role types (global)
export type UserRole = "admin" | "user" | "moderator";

// Common form types
export interface FormState {
  isLoading: boolean;
  isSubmitted: boolean;
  errors: Record<string, string>;
}
