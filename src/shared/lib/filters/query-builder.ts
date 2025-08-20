/**
 * 🔍 Filter Query Builder
 * Applies filter definitions to data arrays
 */
import type {
  FilterDefinitions,
  FilterResult,
  FilterState,
  FilterValue,
} from "./types";

/**
 * Applies a single filter to a data array
 */
function applyFilter<T>(
  data: T[],
  field: string,
  operator: string,
  value: FilterValue,
): T[] {
  if (value === null || value === undefined || value === "") {
    return data;
  }

  return data.filter((item: T) => {
    const fieldValue = (item as Record<string, unknown>)[field];

    switch (operator) {
      case "equals":
        return fieldValue === value;

      case "contains":
        return String(fieldValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());

      case "startsWith":
        return String(fieldValue)
          .toLowerCase()
          .startsWith(String(value).toLowerCase());

      case "endsWith":
        return String(fieldValue)
          .toLowerCase()
          .endsWith(String(value).toLowerCase());

      case "greaterThan":
        return Number(fieldValue) > Number(value);

      case "lessThan":
        return Number(fieldValue) < Number(value);

      case "between":
        if (Array.isArray(value) && value.length === 2) {
          const [min, max] = value;
          const numValue = Number(fieldValue);
          return numValue >= Number(min) && numValue <= Number(max);
        }
        return true;

      case "in":
        if (Array.isArray(value)) {
          return value.includes(fieldValue as string | number);
        }
        return fieldValue === value;

      case "notIn":
        if (Array.isArray(value)) {
          return !value.includes(fieldValue as string | number);
        }
        return fieldValue !== value;

      default:
        return true;
    }
  });
}

/**
 * Builds and applies filter query to data array
 */
export function buildFilterQuery<T>(
  data: T[],
  filterState: FilterState,
  definitions: FilterDefinitions,
): FilterResult<T> {
  let filteredData = [...data];
  let activeFiltersCount = 0;

  // Apply each active filter
  Object.entries(filterState).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      const definition = definitions[key];
      if (definition) {
        filteredData = applyFilter(
          filteredData,
          definition.field,
          definition.operator,
          value,
        );
        activeFiltersCount++;
      }
    }
  });

  return {
    filteredData,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
  };
}

/**
 * Validates filter value against definition
 */
export function validateFilterValue(
  value: FilterValue,
  definition: FilterDefinitions[string],
): boolean {
  if (value === null || value === undefined) {
    return true; // Null values are valid (means no filter)
  }

  switch (definition.type) {
    case "text":
      return typeof value === "string";

    case "select":
      if (definition.multiple) {
        return (
          Array.isArray(value) &&
          value.every((v) => definition.options.some((opt) => opt.value === v))
        );
      }
      return definition.options.some((opt) => opt.value === value);

    case "number":
      if (definition.operator === "between" && Array.isArray(value)) {
        return value.length === 2 && value.every((v) => typeof v === "number");
      }
      return typeof value === "number";

    case "date":
    case "dateRange":
      if (definition.operator === "between" && Array.isArray(value)) {
        return (
          value.length === 2 &&
          value.every(
            (v) =>
              (v as Date | string) instanceof Date || typeof v === "string",
          )
        );
      }
      return (
        (value as Date | string | unknown) instanceof Date ||
        typeof value === "string"
      );

    case "boolean":
      return typeof value === "boolean";

    default:
      return true;
  }
}
