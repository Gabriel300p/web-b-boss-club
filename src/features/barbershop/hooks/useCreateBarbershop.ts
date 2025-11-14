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
      // Extrai mensagem específica do erro
      let errorMessage = "Erro desconhecido ao criar barbearia";
      let errorTitle = "Erro ao criar barbearia";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Mapeia códigos de erro para títulos específicos
        if ((error as any).code === "duplicate_cpf") {
          errorTitle = "CPF já cadastrado";
        } else if ((error as any).code === "duplicate_email") {
          errorTitle = "Email já cadastrado";
        } else if ((error as any).code === "invalid_cpf") {
          errorTitle = "CPF inválido";
        } else if ((error as any).code === "invalid_email") {
          errorTitle = "Email inválido";
        } else if ((error as any).code === "network_error") {
          errorTitle = "Erro de conexão";
        } else if ((error as any).code === "server_error") {
          errorTitle = "Erro interno do servidor";
        }
      }

      showToast({
        type: "error",
        title: errorTitle,
        message: errorMessage,
        duration: 8000,
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
