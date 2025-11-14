/**
 * 🏢 Multi-Select Units Component
 * Component for selecting multiple barbershop units with API integration
 */
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/shared/components/ui/multi-select";
import { apiService } from "@/shared/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

interface BarbershopUnit {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface UnitsListResponse {
  units: BarbershopUnit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface MultiSelectUnitsProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MultiSelectUnits = memo(function MultiSelectUnits({
  value,
  onChange,
  disabled = false,
  placeholder = "Selecione as unidades...",
  className,
}: MultiSelectUnitsProps) {
  // 🔍 Buscar unidades da API
  const { data: unitsResponse, isLoading } = useQuery<UnitsListResponse>({
    queryKey: ["barbershop-units", "list"],
    queryFn: async () => {
      const response = await apiService.get<UnitsListResponse>(
        "/barbershop-units?page=1&limit=100",
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  const units = unitsResponse?.units || [];

  // 🔄 Transformar unidades em opções para o MultiSelect
  const options: MultiSelectOption[] = units.map((unit: BarbershopUnit) => ({
    value: unit.id,
    label: `${unit.name} - ${unit.city}/${unit.state}`,
  }));

  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={isLoading ? "Carregando unidades..." : placeholder}
      emptyMessage="Nenhuma unidade encontrada"
      disabled={disabled || isLoading}
      className={className}
    />
  );
});
