import { useToast } from "@/shared/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { CreateBarbershopFormData } from "../schemas/barbershop.schema";
import { barbershopApiService } from "../services/barbershop-api.service";

/**
 * 🎣 Hook para criação de barbearia
 */
export function useCreateBarbershop() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: CreateBarbershopFormData) =>
      barbershopApiService.createBarbershop(data),
    onSuccess: () => {
      // Redirecionar para login com mensagem de sucesso
      navigate({
        to: "/auth/login",
      });
      showToast({
        type: "success",
        title: "Barbearia criada com sucesso!",
        message: "Verifique seu email para as credenciais.",
        duration: 5000,
      });
    },
    onError: (error: unknown) => {
      showToast({
        type: "error",
        title: "Erro ao criar barbearia",
        message: `Erro: ${error}`,
        duration: 5000,
      });
    },
  });

  return {
    createBarbershop: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
