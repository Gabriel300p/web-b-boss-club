import type { BaseRecord } from "@features/records/schemas/record.schemas";
import type { DateRange } from "@shared/components/filters";
import {
  parseAsArrayOf,
  parseAsIsoDate,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useMemo } from "react";

export interface RecordFilters {
  search: string;
  tipo: string[];
  autor: string;
  dateRange: DateRange;
}

// 🎯 Query parsers for URL persistence
const searchParser = parseAsString.withDefault("");
const tipoParser = parseAsArrayOf(parseAsString).withDefault([]);
const autorParser = parseAsString.withDefault("");
const startDateParser = parseAsIsoDate;
const endDateParser = parseAsIsoDate;

export function useRecordFilters() {
  const [filters, setFilters] = useQueryStates({
    search: searchParser,
    tipo: tipoParser,
    autor: autorParser,
    startDate: startDateParser,
    endDate: endDateParser,
  });

  // 🎯 Transform filters to more usable format
  const activeFilters = useMemo<RecordFilters>(
    () => ({
      search: filters.search,
      tipo: filters.tipo,
      autor: filters.autor,
      dateRange: {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
      },
    }),
    [filters],
  );

  // 🎯 Check if any filters are active
  const hasActiveFilters = useMemo(
    () =>
      filters.search !== "" ||
      filters.tipo.length > 0 ||
      filters.autor !== "" ||
      filters.startDate !== null ||
      filters.endDate !== null,
    [filters],
  );

  // 🎯 Filter function for records
  const filterRecords = useMemo(() => {
    return (records: BaseRecord[]): BaseRecord[] => {
      return records.filter((record) => {
        // Search filter (título, autor, tipo, descrição)
        if (activeFilters.search) {
          const searchTerm = activeFilters.search.toLowerCase();
          const searchableText = [
            record.titulo,
            record.autor,
            record.tipo,
            record.descricao,
          ]
            .join(" ")
            .toLowerCase();

          if (!searchableText.includes(searchTerm)) {
            return false;
          }
        }

        // Tipo filter
        if (activeFilters.tipo.length > 0) {
          if (!activeFilters.tipo.includes(record.tipo)) {
            return false;
          }
        }

        // Autor filter
        if (activeFilters.autor) {
          const autorTerm = activeFilters.autor.toLowerCase();
          if (!record.autor.toLowerCase().includes(autorTerm)) {
            return false;
          }
        }

        // Date range filter (dataCriacao)
        if (
          activeFilters.dateRange.startDate ||
          activeFilters.dateRange.endDate
        ) {
          const recordDate = new Date(record.dataCriacao);

          if (activeFilters.dateRange.startDate) {
            const startDate = new Date(activeFilters.dateRange.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (recordDate < startDate) {
              return false;
            }
          }

          if (activeFilters.dateRange.endDate) {
            const endDate = new Date(activeFilters.dateRange.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (recordDate > endDate) {
              return false;
            }
          }
        }

        return true;
      });
    };
  }, [activeFilters]);

  // 🎯 Reset all filters
  const resetFilters = () => {
    setFilters({
      search: "",
      tipo: [],
      autor: "",
      startDate: null,
      endDate: null,
    });
  };

  // 🎯 Individual filter setters
  const setSearch = (search: string) => {
    setFilters({ search });
  };

  const setTipo = (tipo: string[]) => {
    setFilters({ tipo });
  };

  const setAutor = (autor: string) => {
    setFilters({ autor });
  };

  const setDateRange = (dateRange: DateRange) => {
    setFilters({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  };

  return {
    filters: activeFilters,
    hasActiveFilters,
    filterRecords,
    resetFilters,
    setSearch,
    setTipo,
    setAutor,
    setDateRange,
  };
}
