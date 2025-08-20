/**
 * 🔍 Filter DSL Type Definitions
 * Declarative filter system with type safety
 */

// Base filter operators
export type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "between"
  | "in"
  | "notIn";

// Filter value types
export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | (string | number)[]
  | null;

// Base filter definition
export interface BaseFilterDefinition {
  field: string;
  operator: FilterOperator;
  label?: string;
  placeholder?: string;
}

// Specific filter types
export interface TextFilterDefinition extends BaseFilterDefinition {
  type: "text";
  operator: "equals" | "contains" | "startsWith" | "endsWith";
}

export interface SelectFilterDefinition extends BaseFilterDefinition {
  type: "select";
  operator: "equals" | "in";
  options: Array<{ value: string | number; label: string }>;
  multiple?: boolean;
}

export interface NumberFilterDefinition extends BaseFilterDefinition {
  type: "number";
  operator: "equals" | "greaterThan" | "lessThan" | "between";
  min?: number;
  max?: number;
}

export interface DateFilterDefinition extends BaseFilterDefinition {
  type: "date" | "dateRange";
  operator: "equals" | "greaterThan" | "lessThan" | "between";
}

export interface BooleanFilterDefinition extends BaseFilterDefinition {
  type: "boolean";
  operator: "equals";
}

// Union type for all filter definitions
export type FilterDefinition =
  | TextFilterDefinition
  | SelectFilterDefinition
  | NumberFilterDefinition
  | DateFilterDefinition
  | BooleanFilterDefinition;

// Filter definitions record
export type FilterDefinitions = Record<string, FilterDefinition>;

// Filter state
export type FilterState = Record<string, FilterValue>;

// Filter result
export interface FilterResult<T> {
  filteredData: T[];
  activeFiltersCount: number;
  hasActiveFilters: boolean;
}

// Filter context
export interface FilterContext<T extends FilterDefinitions> {
  definitions: T;
  state: FilterState;
  setFilter: (key: keyof T, value: FilterValue) => void;
  clearFilter: (key: keyof T) => void;
  clearAllFilters: () => void;
  applyFilters: <D>(data: D[]) => FilterResult<D>;
}
