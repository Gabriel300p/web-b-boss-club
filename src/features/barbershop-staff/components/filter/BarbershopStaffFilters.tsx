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
import { useMemo } from "react";

import type {
  StaffFilters,
  StaffListResponse,
} from "../../schemas/barbershop-staff.schemas";

interface BarbershopStaffFiltersProps {
  filters: StaffFilters;
  onFilterChange: <K extends keyof StaffFilters>(
    key: K,
    value: StaffFilters[K],
  ) => void;
  onClearFilters: () => void;
  totalCount?: number;
  statistics?: StaffListResponse["statistics"];
}

export function BarbershopStaffFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalCount = 0,
  statistics,
}: BarbershopStaffFiltersProps) {
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
      {/* Stats Cards */}
      {statistics && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-green-900/20 p-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-400">Ativos</span>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {statistics.total_active ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-yellow-900/20 p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-400">
                Inativos
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">
              {statistics.total_inactive ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-blue-900/20 p-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-400">
                Disponíveis
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-500">
              {statistics.available_now ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-purple-500">
              {totalCount ?? 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Search bar */}
        <TextFilter
          value={filters.search || ""}
          onChange={(value) => onFilterChange("search", value)}
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
            onChange={(values) =>
              onFilterChange(
                "status",
                values[0] as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED",
              )
            }
          />

          {/* Role filter */}
          <Filter
            title="Função"
            options={roleOptions}
            icon={<UserIcon className="h-4 w-4" />}
            value={filters.role_in_shop ? [filters.role_in_shop] : []}
            onChange={(values) =>
              onFilterChange(
                "role_in_shop",
                values[0] as "BARBER" | "BARBERSHOP_OWNER",
              )
            }
          />

          {/* Availability filter */}
          <Filter
            title="Disponibilidade"
            options={availabilityOptions}
            icon={<CheckCircleIcon className="h-4 w-4" />}
            value={
              filters.is_available !== undefined ? [filters.is_available] : []
            }
            onChange={(values) =>
              onFilterChange("is_available", values[0] as boolean)
            }
          />
        </FilterToolbar>
      </div>
    </div>
  );
}
