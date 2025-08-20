// 🎯 Comunicacoes Hooks - Public API
// Centralized exports for all comunicacoes-related hooks

// Data fetching & mutations
export { useComunicacoes } from "./useComunicacoes";

// Cache management & optimization
export { useComunicacoesCache, useQueryState } from "./useComunicacoesCache";

// UI state management
export { useModals } from "./useModals";

// Search & filtering
export { useFilters } from "./useFilters";
export { useSearch } from "./useSearch";

/**
 * 📝 Usage Examples:
 *
 * // Basic data operations
 * import { useComunicacoes } from '@features/comunicacoes/hooks';
 *
 * // Advanced cache management
 * import { useComunicacoesCache } from '@features/comunicacoes/hooks';
 *
 * // Search functionality
 * import { useSearch } from '@features/comunicacoes/hooks';
 */
