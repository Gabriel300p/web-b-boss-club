/**
 * 🏢 useUpdatePrimaryUnit Hook
 * Hook para atualizar a unidade principal de um funcionário
 */
import { useToast } from "@shared/hooks/useToast";
import { apiService } from "@shared/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdatePrimaryUnitParams {
  staffId: string;
  primaryUnitId: string;
}

export function useUpdatePrimaryUnit() {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ staffId, primaryUnitId }: UpdatePrimaryUnitParams) => {
      const response = await apiService.patch(`/barbershop-staff/${staffId}`, {
        primary_unit_id: primaryUnitId,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidar query para refetch da lista
      queryClient.invalidateQueries({ queryKey: ["barbershop-staff"] });

      success(
        "Unidade principal atualizada",
        "A unidade principal foi alterada com sucesso",
      );
    },
    onError: (err: Error) => {
      console.error("Erro ao atualizar unidade principal:", err);

      error(
        "Erro ao atualizar",
        "Não foi possível alterar a unidade principal",
      );
    },
  });

  return mutation;
}
