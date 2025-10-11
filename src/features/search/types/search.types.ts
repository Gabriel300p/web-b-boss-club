/**
 * 🔍 Search Types
 * Type definitions for the global search system
 */

import type {
  BarbershopStaff,
  StaffStatus,
} from "@features/barbershop-staff/schemas/barbershop-staff.schemas";
import type { IconProps } from "@phosphor-icons/react";

/**
 * 📦 Tipos de entidades que podem ser pesquisadas
 */
export type SearchableEntity =
  | "page"
  | "staff"
  | "service"
  | "unit"
  | "appointment";

/**
 * 👥 Roles de usuário do sistema (sync com backend)
 */
export type UserRole = "SUPER_ADMIN" | "BARBERSHOP_OWNER" | "BARBER" | "CLIENT";

/**
 * 🎯 Interface base para todos os resultados de busca
 */
export interface BaseSearchResult {
  id: string;
  type: SearchableEntity;
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  score: number; // Relevância (0-100)
  metadata?: Record<string, unknown>;
}

/**
 * 📄 Resultado de busca de página
 */
export interface PageSearchResult extends BaseSearchResult {
  type: "page";
  href: string;
  shortcut?: string; // Ex: "Ctrl+Shift+P"
  requiredRoles: UserRole[];
  section: "principal" | "outros"; // Para agrupamento visual
}

/**
 * 👤 Resultado de busca de funcionário (staff)
 */
export interface StaffSearchResult extends BaseSearchResult {
  type: "staff";
  staff: BarbershopStaff;
  status: StaffStatus;
  avatarUrl?: string;
}

/**
 * 🔮 Tipos futuros (placeholder para extensibilidade)
 */
export interface ServiceSearchResult extends BaseSearchResult {
  type: "service";
  // TODO: Adicionar quando backend de serviços existir
}

export interface UnitSearchResult extends BaseSearchResult {
  type: "unit";
  // TODO: Adicionar quando backend de unidades existir
}

/**
 * 🎯 Union type de todos os resultados possíveis
 */
export type SearchResult =
  | PageSearchResult
  | StaffSearchResult
  | ServiceSearchResult
  | UnitSearchResult;

/**
 * 📊 Categoria de busca com contador
 */
export interface SearchCategory {
  id: SearchableEntity | "all";
  label: string;
  icon: React.ComponentType<IconProps>;
  count: number;
}

/**
 * 🎛️ Estado global da busca
 */
export interface SearchState {
  query: string;
  results: SearchResult[];
  categories: SearchCategory[];
  selectedCategory: SearchableEntity | "all";
  isLoading: boolean;
  recentSearches: SearchResult[];
}

/**
 * 🎯 Opções de configuração da busca
 */
export interface SearchOptions {
  maxResults?: number; // Máximo de resultados por categoria
  minQueryLength?: number; // Mínimo de caracteres para buscar
  debounceMs?: number; // Delay do debounce em ms
  includeRecent?: boolean; // Mostrar pesquisas recentes
  filterByRole?: boolean; // Filtrar por role do usuário
}

/**
 * 📝 Item de histórico de busca
 */
export type SearchHistoryItem = SearchResult & {
  searchedAt: Date;
  clickCount: number; // Quantas vezes foi clicado (para ordenação)
};

/**
 * ⚙️ Configuração padrão da busca
 */
export const DEFAULT_SEARCH_OPTIONS: Required<SearchOptions> = {
  maxResults: 5,
  minQueryLength: 2,
  debounceMs: 300,
  includeRecent: true,
  filterByRole: true,
} as const;

/**
 * 🎨 Configurações de limite para "Ver mais"
 */
export const SEARCH_LIMITS = {
  INITIAL: 5, // Mostrar inicialmente
  EXPANDED: 20, // Mostrar ao clicar "Ver mais"
  MAX_HISTORY: 10, // Máximo no histórico
} as const;
