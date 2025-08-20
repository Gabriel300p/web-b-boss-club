import {
  DatePickerImproved,
  FilterSimple,
  FilterToolbar,
  TextFilter,
  type FilterOption,
} from "@shared/components/filters";
import { CalendarIcon, FilterIcon, TagIcon, UserIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFilters } from "../../hooks/useFilters";

interface ComunicacoesToolbarProps {
  autores: string[];
  totalCount?: number;
}

// 🎯 Filter configuration - single source of truth
const FILTER_CONFIG = {
  search: {
    key: "search" as const,
    searchableFields: ["titulo", "autor", "tipo", "descricao"] as const,
  },
  tipo: {
    key: "tipo" as const,
    field: "tipo" as const,
    options: [
      {
        value: "Comunicado",
        translationKey: "form.types.comunicado",
        color: "blue",
      },
      { value: "Aviso", translationKey: "form.types.aviso", color: "yellow" },
    ],
  },
  autor: {
    key: "autor" as const,
    field: "autor" as const,
  },
  dateRange: {
    startKey: "startDate" as const,
    endKey: "endDate" as const,
    field: "dataCriacao" as const,
  },
} as const;

export const ComunicacoesToolbar = memo(function ComunicacoesToolbar({
  autores = [],
}: ComunicacoesToolbarProps) {
  const { 
    filters, 
    hasActiveFilters, 
    resetFilters,
    setSearch,
    setTipo, 
    setAutor,
    setDateRange 
  } = useFilters();
  const { t } = useTranslation("records");

  // 🎯 Memoized filter options
  const filterOptions = useMemo(
    () => ({
      tipo: FILTER_CONFIG.tipo.options.map((option) => ({
        label: t(option.translationKey),
        value: option.value,
        icon: <FilterIcon className={`h-4 w-4 text-${option.color}-500`} />,
      })) as FilterOption[],

      autor: autores.map((autor) => ({
        label: autor,
        value: autor,
        icon: <UserIcon className="h-4 w-4 text-gray-500" />,
      })) as FilterOption[],
    }),
    [t, autores],
  );

  // 🎯 Optimized filter handlers
  const handleFilterChange = useMemo(
    () => ({
      search: (search: string) => setSearch(search),
      tipo: (values: string[]) => setTipo(values),
      autor: (values: string[]) => setAutor(values),
      dateRange: (dateRange: {
        startDate: Date | null;
        endDate: Date | null;
      }) => setDateRange(dateRange),
    }),
    [setSearch, setTipo, setAutor, setDateRange],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {/* Search */}
        <TextFilter
          value={filters.search}
          onChange={handleFilterChange.search}
          placeholder={t("filters.searchPlaceholder")}
          className="w-full max-w-sm"
        />

        {/* Filters */}
        <FilterToolbar
          hasActiveFilters={hasActiveFilters}
          onReset={resetFilters}
        >
          {/* Tipo */}
          <FilterSimple
            title={t("filters.type")}
            options={filterOptions.tipo}
            icon={<TagIcon className="h-4 w-4" />}
            value={Array.isArray(filters.tipo) ? filters.tipo : []}
            onChange={(values) => handleFilterChange.tipo(values as string[])}
          />

          {/* Autor */}
          {filterOptions.autor.length > 0 && (
            <FilterSimple
              title={t("filters.author")}
              options={filterOptions.autor}
              icon={<UserIcon className="h-4 w-4" />}
              value={Array.isArray(filters.autor) ? filters.autor : []}
              onChange={(values) => handleFilterChange.autor(values as string[])}
              placeholder={t("filters.authorPlaceholder")}
            />
          )}

          {/* Date Range */}
          <DatePickerImproved
            title={t("filters.createdAt")}
            value={{
              startDate: filters.dateRange.startDate,
              endDate: filters.dateRange.endDate,
            }}
            onChange={handleFilterChange.dateRange}
            icon={<CalendarIcon className="h-4 w-4" />}
          />
        </FilterToolbar>
      </div>
    </div>
  );
});
