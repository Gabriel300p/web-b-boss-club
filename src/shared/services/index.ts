// Exporta todos os serviços HTTP
export { ApiService, apiService } from "./api.service.js";
export { AuthApiService, authApiService } from "./auth-api.service.js";

// Exporta tipos relacionados
export type { ApiError, ApiResponse } from "./api.service.js";

// Exporta tipos de autenticação (mantidos no auth-api.service.ts)
export type {
  LoginRequest,
  LoginResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  UserProfile,
  VerifyMfaRequest,
  VerifyMfaResponse,
} from "./auth-api.service.js";
