/**
 * 🔍 Search Feature
 * Sistema de busca global do sistema
 */

// Componentes
export { HighlightedText } from "./components/HighlightedText";
export { RecentSearches } from "./components/RecentSearches";
export { SearchInput } from "./components/SearchInput";
export { SearchModal } from "./components/SearchModal";
export { SearchResultItem } from "./components/SearchResultItem";
export { SearchResults } from "./components/SearchResults";

// Hooks
export { useDebouncedValue } from "./hooks/useDebouncedValue";
export { useGlobalSearch } from "./hooks/useGlobalSearch";
export { useSearchHistory } from "./hooks/useSearchHistory";
export { useSearchKeyboard } from "./hooks/useSearchKeyboard";
export { useSearchPages } from "./hooks/useSearchPages";
export { useSearchStaff } from "./hooks/useSearchStaff";

// Services
export { searchHistoryService } from "./services/search-history.service";

// Utils
export {
  extractSnippet,
  highlightMatches,
  truncateText,
} from "./utils/search-highlighter";
export {
  calculateRelevanceScore,
  filterByMinScore,
  scoreAndSort,
  sortByRelevance,
} from "./utils/search-scorer";

// Types
export type {
  BaseSearchResult,
  PageSearchResult,
  SearchableEntity,
  SearchCategory,
  SearchHistoryItem,
  SearchOptions,
  SearchResult,
  SearchState,
  StaffSearchResult,
  UserRole,
} from "./types/search.types";

export { DEFAULT_SEARCH_OPTIONS, SEARCH_LIMITS } from "./types/search.types";
