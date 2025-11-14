/**
 * 🆕 Hook for creating barbershop staff
 * Uses TanStack Query mutation with toast notifications
 */
import { useToast } from "@shared/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateStaffFormData,
  CreateStaffResponse,
} from "../schemas/barbershop-staff.schemas";
import { createStaff } from "../services/barbershop-staff.service";

interface UseBarbershopStaffCreateOptions {
  onSuccess?: (response: CreateStaffResponse) => void;
}

export function useBarbershopStaffCreate(
  options?: UseBarbershopStaffCreateOptions,
) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<CreateStaffResponse, Error, CreateStaffFormData>(
    {
      mutationFn: async (data: CreateStaffFormData) => {
        // ✅ Data já vem validada e transformada pelo Zod schema!
        // O schema createStaffFormSchema já:
        // 1. Divide full_name em first_name + last_name
        // 2. Monta o objeto user aninhado
        // 3. Define defaults (role_in_shop, status, is_available)
        // 4. Formata o payload exatamente como o backend espera

        // 🏢 Define primeira unidade como principal se não foi especificada
        const dataWithPrimaryUnit = {
          ...data,
          primary_unit_id:
            data.primary_unit_id ||
            (data.unit_ids && data.unit_ids.length > 0
              ? data.unit_ids[0]
              : undefined),
        };

        // Backend infere barbershop_id automaticamente do owner logado
        return createStaff(dataWithPrimaryUnit);
      },
      onSuccess: async (response) => {
        // ✅ Estratégia otimizada: invalidar apenas listas (não detalhes)
        // Usa predicate function para ser seletivo e evitar refetch de staff details
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            // Invalida apenas queries de lista e stats, não detalhes individuais
            return (
              Array.isArray(queryKey) &&
              queryKey[0] === "barbershop-staff" &&
              (queryKey.includes("list") || queryKey.includes("stats"))
            );
          },
        });

        // Show success toast (sem mostrar a senha)
        showToast({
          type: "success",
          title: "Colaborador criado com sucesso!",
          message: "O novo colaborador foi adicionado à equipe.",
          duration: 5000,
        });

        // Call custom onSuccess callback if provided
        options?.onSuccess?.(response);
      },
      onError: (error: Error) => {
        // Handle different error types
        const errorMessage = error.message || "Erro ao criar colaborador";

        showToast({
          type: "error",
          title: "Erro ao criar colaborador",
          message: errorMessage,
          duration: 8000,
        });
      },
    },
  );

  return {
    createStaff: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
