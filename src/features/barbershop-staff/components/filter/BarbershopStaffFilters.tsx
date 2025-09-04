import {
  Filter,
  FilterToolbar,
  TextFilter,
  type FilterOption,
} from "@shared/components/filters";

import {
  CheckCircleIcon,
  ClockIcon,
  PauseIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useCallback } from "react";

import type { StaffFilters } from "../../schemas/barbershop-staff.schemas";

interface BarbershopStaffFiltersProps {
  filters: StaffFilters;
  onFilterChange: <K extends keyof StaffFilters>(
    key: K,
    value: StaffFilters[K],
  ) => void;
  onClearFilters: () => void;
}

export function BarbershopStaffFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: BarbershopStaffFiltersProps) {
  // 🔥 OPTIMIZATION: Memoize filter change handlers to prevent re-renders
  const handleSearchChange = useCallback(
    (value: string) => onFilterChange("search", value),
    [onFilterChange]
  );

  const handleStatusChange = useCallback(
    (values: unknown[]) =>
      onFilterChange(
        "status",
        values[0] as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED"
      ),
    [onFilterChange]
  );

  const handleRoleChange = useCallback(
    (values: unknown[]) =>
      onFilterChange(
        "role_in_shop",
        values[0] as "BARBER" | "BARBERSHOP_OWNER"
      ),
    [onFilterChange]
  );

  const handleAvailabilityChange = useCallback(
    (values: unknown[]) =>
      onFilterChange("is_available", values[0] as boolean),
    [onFilterChange]
  );
  // 🎯 Status options with icons and colors
  const statusOptions: FilterOption[] = useMemo(
    () => [
      {
        label: "Ativo",
        value: "ACTIVE",
        icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
      },
      {
        label: "Inativo",
        value: "INACTIVE",
        icon: <ClockIcon className="h-4 w-4 text-yellow-500" />,
      },
      {
        label: "Suspenso",
        value: "SUSPENDED",
        icon: <PauseIcon className="h-4 w-4 text-orange-500" />,
      },
      {
        label: "Demitido",
        value: "TERMINATED",
        icon: <XCircleIcon className="h-4 w-4 text-red-500" />,
      },
    ],
    [],
  );

  // 🎯 Role options
  const roleOptions: FilterOption[] = useMemo(
    () => [
      {
        label: "Barbeiro",
        value: "BARBER",
        icon: <UserIcon className="h-4 w-4 text-blue-500" />,
      },
      {
        label: "Proprietário",
        value: "BARBERSHOP_OWNER",
        icon: <UserIcon className="h-4 w-4 text-purple-500" />,
      },
    ],
    [],
  );

  // 🎯 Availability options
  const availabilityOptions: FilterOption[] = useMemo(
    () => [
      {
        label: "Disponível",
        value: true,
        icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
      },
      {
        label: "Indisponível",
        value: false,
        icon: <XCircleIcon className="h-4 w-4 text-red-500" />,
      },
    ],
    [],
  );

  // 📊 Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.status ||
      filters.role_in_shop ||
      filters.is_available !== undefined ||
      filters.search
    );
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Search bar */}
        <TextFilter
          value={filters.search || ""}
          onChange={handleSearchChange}
          placeholder="Pesquisar funcionários..."
          className="max-w-md"
          size="md"
        />

        <FilterToolbar
          hasActiveFilters={hasActiveFilters}
          onReset={onClearFilters}
        >
          {/* Status filter */}
          <Filter
            title="Status"
            options={statusOptions}
            icon={<CheckCircleIcon className="h-4 w-4" />}
            value={filters.status ? [filters.status] : []}
            onChange={handleStatusChange}
          />

          {/* Role filter */}
          <Filter
            title="Função"
            options={roleOptions}
            icon={<UserIcon className="h-4 w-4" />}
            value={filters.role_in_shop ? [filters.role_in_shop] : []}
            onChange={handleRoleChange}
          />

          {/* Availability filter */}
          <Filter
            title="Disponibilidade"
            options={availabilityOptions}
            icon={<CheckCircleIcon className="h-4 w-4" />}
            value={
              filters.is_available !== undefined ? [filters.is_available] : []
            }
            onChange={handleAvailabilityChange}
          />
        </FilterToolbar>
      </div>
    </div>
  );
}
