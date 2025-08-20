/**
 * 🔍 Filter State Management Hook
 * Local filter state with type safety (URL sync can be added later)
 */
import { useCallback, useState } from "react";
import { buildFilterQuery } from "./query-builder";
import type {
  FilterContext,
  FilterDefinitions,
  FilterState,
  FilterValue,
} from "./types";

/**
 * Hook for managing filter state (local state version)
 */
export function useFilterState<T extends FilterDefinitions>(
  definitions: T,
): FilterContext<T> {
  const [state, setState] = useState<FilterState>({});

  // Set a single filter
  const setFilter = useCallback((key: keyof T, value: FilterValue) => {
    setState((prev) => {
      if (value === null || value === undefined || value === "") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key as string]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  // Clear a single filter
  const clearFilter = useCallback((key: keyof T) => {
    setState((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key as string]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setState({});
  }, []);

  // Apply filters to data
  const applyFilters = useCallback(
    <D>(data: D[]) => {
      return buildFilterQuery(data, state, definitions);
    },
    [state, definitions],
  );

  return {
    definitions,
    state,
    setFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
  };
}
