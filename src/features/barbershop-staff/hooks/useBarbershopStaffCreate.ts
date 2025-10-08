/**
 * 🆕 Hook for creating barbershop staff
 * Uses TanStack Query mutation with toast notifications
 */
import { useToast } from "@shared/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateStaffMinimalData,
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
  const mutation = useMutation<
    CreateStaffResponse,
    Error,
    CreateStaffMinimalData
  >({
    mutationFn: async (data: CreateStaffMinimalData) => {
      // 🎯 Backend agora infere barbershop_id automaticamente do owner logado
      // Não precisamos mais enviar barbershop_id no payload

      // Build payload matching backend expectations
      const payload = {
        // barbershop_id removido - backend infere automaticamente
        user: {
          first_name: data.first_name,
          last_name: data.last_name || "",
          cpf: data.cpf,
          email: data.email || "", // Backend handles empty email
          phone: data.phone || "", // Backend handles empty phone
        },
        role_in_shop: "BARBER" as const, // Default role
        status: data.status || "ACTIVE", // Default status
        is_available: true, // Default availability
        internal_notes: data.internal_notes || undefined, // ✅ internal_notes no nível raiz
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return createStaff(payload as any);
    },
    onSuccess: async (response) => {
      // Invalidate cache aggressively to ensure fresh data
      await queryClient.invalidateQueries({
        queryKey: ["barbershop-staff"],
        refetchType: "all", // Force refetch of all matching queries
      });

      // Force immediate refetch to get updated list with new staff at top
      await queryClient.refetchQueries({
        queryKey: ["barbershop-staff"],
        type: "all", // Refetch all matching queries
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
  });

  return {
    createStaff: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
