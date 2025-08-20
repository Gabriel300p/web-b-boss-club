import {
  ModernCalendar,
  Filter,
  FilterToolbar,
  TextFilter,
  type FilterOption,
} from "@shared/components/filters";
import { CalendarIcon, FilterIcon, TagIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecordFilters } from "../../hooks/useRecordFilters";

interface RecordsToolbarProps {
  autores: string[];
  totalCount?: number;
}

export function RecordsToolbar({ autores, totalCount }: RecordsToolbarProps) {
  const {
    filters,
    hasActiveFilters,
    resetFilters,
    setSearch,
    setTipo,
    setAutor,
    setDateRange,
  } = useRecordFilters();
  const { t } = useTranslation("records");

  // 🎯 Tipo options with icons
  const tipoOptions: FilterOption[] = useMemo(
    () => [
      {
        label: t("form.types.comunicado"),
        value: "Comunicado",
        icon: <FilterIcon className="h-4 w-4 text-blue-500" />,
      },
      {
        label: t("form.types.aviso"),
        value: "Aviso",
        icon: <FilterIcon className="h-4 w-4 text-yellow-500" />,
      },
      {
        label: t("form.types.noticia"),
        value: "Notícia",
        icon: <FilterIcon className="h-4 w-4 text-green-500" />,
      },
    ],
    [t],
  );

  // 🎯 Autor options from data
  const autorOptions: FilterOption[] = useMemo(
    () =>
      autores.map((autor) => ({
        label: autor,
        value: autor,
        icon: <UserIcon className="h-4 w-4 text-gray-500" />,
      })),
    [autores],
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center justify-between">
        <TextFilter
          value={filters.search}
          onChange={setSearch}
          placeholder={t("filters.searchPlaceholder")}
          className="max-w-sm"
        />

        {totalCount && (
          <div className="text-muted-foreground text-sm">
            {t("filters.count", { count: totalCount })}
          </div>
        )}
      </div>

      {/* Filter toolbar */}
      <FilterToolbar hasActiveFilters={hasActiveFilters} onReset={resetFilters}>
        {/* Tipo filter */}
        <Filter
          title={t("filters.type")}
          options={tipoOptions}
          icon={<TagIcon className="h-4 w-4" />}
          value={filters.tipo}
          onChange={(values: (string | boolean)[]) =>
            setTipo(values as string[])
          }
        />

        {/* Autor filter */}
        {autorOptions.length > 0 && (
          <Filter
            title={t("filters.author")}
            options={autorOptions}
            icon={<UserIcon className="h-4 w-4" />}
            value={filters.autor ? [filters.autor] : []}
            onChange={(values: (string | boolean)[]) =>
              setAutor((values[0] as string) || "")
            }
            placeholder={t("filters.authorPlaceholder")}
          />
        )}

        {/* Modern Date range filter */}
        <ModernCalendar
          title={t("filters.createdAt")}
          value={filters.dateRange}
          onChange={setDateRange}
          icon={<CalendarIcon className="h-4 w-4" />}
          variant="default"
          showPresets={true}
          showClearButton={true}
        />
      </FilterToolbar>
    </div>
  );
}
