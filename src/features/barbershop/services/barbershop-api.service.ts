import { apiService } from "@shared/services/api.service";
import type { CreateBarbershopFormData } from "../schemas/barbershop.schema";

// Create custom barbershop error
function createBarbershopError(
  code: string,
  message: string,
): Error & { code: string } {
  const error = new Error(message) as Error & { code: string };
  error.code = code;
  return error;
}

/**
 * 🏪 Serviço para APIs de barbearia
 */
export class BarbershopApiService {
  private readonly baseUrl = "/barbershop";

  /**
   * 🚀 Cria uma nova barbearia com proprietário
   */
  async createBarbershop(data: CreateBarbershopFormData): Promise<unknown> {
    try {
      const response = await apiService.post<unknown>(this.baseUrl, data);
      return response.data;
    } catch (error: unknown) {
      // Trata erros específicos do backend
      let errorMessage = "";

      if (error instanceof Error) {
        errorMessage = error.message.toLowerCase();
      } else if (error && typeof error === "object" && "message" in error) {
        // Se for um ApiError, extrai a mensagem
        const apiError = error as { message: string; status?: number };
        errorMessage = apiError.message.toLowerCase();
      }

      if (errorMessage) {
        if (
          errorMessage.includes("cpf") &&
          errorMessage.includes("cadastrado")
        ) {
          throw createBarbershopError(
            "duplicate_cpf",
            "Este CPF já está cadastrado no sistema. Use outro CPF ou faça login na conta existente.",
          );
        }
        if (errorMessage.includes("cpf") && errorMessage.includes("inválido")) {
          throw createBarbershopError(
            "invalid_cpf",
            "CPF inválido. Verifique se o CPF foi digitado corretamente (apenas números).",
          );
        }
        if (
          errorMessage.includes("email") &&
          errorMessage.includes("cadastrado")
        ) {
          throw createBarbershopError(
            "duplicate_email",
            "Este email já está cadastrado no sistema. Use outro email ou faça login na conta existente.",
          );
        }
        if (
          errorMessage.includes("email") &&
          errorMessage.includes("inválido")
        ) {
          throw createBarbershopError(
            "invalid_email",
            "Email inválido. Verifique se o email foi digitado corretamente.",
          );
        }
        if (
          errorMessage.includes("rede") ||
          errorMessage.includes("conexão") ||
          errorMessage.includes("conexao")
        ) {
          throw createBarbershopError(
            "network_error",
            "Erro de conexão com o servidor. Verifique sua internet e tente novamente.",
          );
        }

        throw error;
      }
      throw createBarbershopError(
        "server_error",
        "Erro desconhecido ao criar barbearia",
      );
    }
  }
}

// Instância singleton
export const barbershopApiService = new BarbershopApiService();
