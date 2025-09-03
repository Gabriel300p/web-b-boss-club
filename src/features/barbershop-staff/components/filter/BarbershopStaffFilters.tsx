import { useRecordFilters } from "@/features/records/hooks/useRecordFilters";
import {
  Filter,
  FilterToolbar,
  TextFilter,
  type FilterOption,
} from "@shared/components/filters";
import { FilterIcon, TagIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface RecordsToolbarProps {
  autores: string[];
  totalCount?: number;
}

export function BarbershopStaffFilters({ autores }: RecordsToolbarProps) {
  const {
    filters,
    hasActiveFilters,
    resetFilters,
    setSearch,
    setTipo,
    setAutor,
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
        icon: <UserIcon className="h-4 w-4 text-neutral-500" />,
      })),
    [autores],
  );

  return (
    <div className="flex gap-2">
      {/* Search bar */}

      <TextFilter
        value={filters.search}
        onChange={setSearch}
        placeholder="Pesquisar..."
        className="max-w-md"
        size="lg"
      />

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
      </FilterToolbar>
    </div>
  );
}
