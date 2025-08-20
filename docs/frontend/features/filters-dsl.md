# Filters DSL Implementation

## Overview

Declarative filter system with URL state synchronization for consistent filtering across the application.

## Architecture

### Filter Definition DSL

```typescript
// Filter configuration with declarative syntax
const recordFilters = {
  search: {
    type: "text",
    field: "titulo",
    operator: "contains",
    placeholder: "Search records...",
  },
  type: {
    type: "select",
    field: "tipo",
    options: [
      { value: "Comunicado", label: "Comunicado" },
      { value: "Aviso", label: "Aviso" },
      { value: "Notícia", label: "Notícia" },
    ],
    placeholder: "Select type...",
  },
  author: {
    type: "text",
    field: "autor",
    operator: "equals",
    placeholder: "Filter by author...",
  },
  dateRange: {
    type: "dateRange",
    field: "dataCriacao",
    operator: "between",
  },
} as const;
```

### URL State Management

```typescript
// Automatic URL sync with query parameters
const filterState = useFilterState(recordFilters);

// Results in URLs like:
// /records?search=welcome&type=Comunicado&author=admin
```

### Filter Types

- **Text Filters**: `contains`, `equals`, `startsWith`, `endsWith`
- **Select Filters**: Single and multi-select options
- **Date Filters**: Range, before, after, exact
- **Number Filters**: Range, greater than, less than, equals
- **Boolean Filters**: True/false toggles

### Implementation Components

#### Filter State Hook

```typescript
export function useFilterState<T extends Record<string, FilterDefinition>>(
  filterDefinitions: T,
) {
  // URL state synchronization
  // Filter value management
  // Apply/clear filter actions
  // Return filtered data
}
```

#### Filter Toolbar Component

```typescript
export function FilterToolbar<T>({
  filters,
  onFiltersChange,
  resetFilters,
}: FilterToolbarProps<T>) {
  // Render filter controls based on type
  // Handle filter state changes
  // Provide clear/reset functionality
}
```

#### Filter Query Builder

```typescript
export function buildFilterQuery<T>(
  data: T[],
  filters: FilterState,
  definitions: FilterDefinitions,
): T[] {
  // Apply filters to data array
  // Support complex filter combinations
  // Type-safe filtering operations
}
```

## Features

- **Type Safety**: Full TypeScript support with generic constraints
- **URL Persistence**: Filter state synced with browser URL
- **Performance**: Optimized filtering with memoization
- **Internationalization**: Filter labels support i18n
- **Extensibility**: Easy to add new filter types
- **Accessibility**: Full keyboard and screen reader support

## Usage Examples

### Basic Filter Setup

```typescript
function RecordsPage() {
  const { filteredData, filterState, setFilter, clearFilters } =
    useFilterState(recordFilters);

  return (
    <div>
      <FilterToolbar
        filters={recordFilters}
        state={filterState}
        onFiltersChange={setFilter}
        onReset={clearFilters}
      />
      <DataTable data={filteredData} />
    </div>
  );
}
```

### Custom Filter Types

```typescript
// Extend with custom filter type
const customFilters = {
  priority: {
    type: "priority" as const,
    field: "priority",
    options: ["low", "medium", "high"],
    renderFilter: PriorityFilterComponent,
  },
};
```

## Integration Points

- React Query for server-side filtering
- React Router for URL state management
- i18next for internationalized labels
- React Hook Form for filter form state
- Tailwind CSS for responsive filter layouts

## Future Enhancements

- Server-side filter processing
- Saved filter presets
- Advanced filter combinations (AND/OR)
- Filter analytics and usage tracking
- Real-time filter suggestions
