import { apiService } from "@shared/services/api.service";
import type { CreateBarbershopFormData } from "../schemas/barbershop.schema";

/**
 * 🏪 Serviço para APIs de barbearia
 */
export class BarbershopApiService {
  private readonly baseUrl = "/barbershop";

  /**
   * 🚀 Cria uma nova barbearia com proprietário
   */
  async createBarbershop(data: CreateBarbershopFormData): Promise<unknown> {
    const response = await apiService.post<unknown>(this.baseUrl, data);
    return response.data;
  }
}

// Instância singleton
export const barbershopApiService = new BarbershopApiService();
