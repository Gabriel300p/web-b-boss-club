/**
 * 🎯 Hook para buscar breakdown detalhado do score
 * Consome endpoint GET /barbershop-staff/:id/score-breakdown
 */
import { useQuery } from "@tanstack/react-query";
import { barbershopStaffService } from "../services/barbershop-staff.service";
import type { ScoreBreakdownDetailed } from "../types/score.types";

export function useStaffScoreBreakdown(staffId: string | null) {
  return useQuery<ScoreBreakdownDetailed>({
    queryKey: ["staff-score-breakdown", staffId],
    queryFn: async () => {
      if (!staffId) {
        throw new Error("Staff ID é obrigatório");
      }
      return await barbershopStaffService.getStaffScoreBreakdown(staffId);
    },
    enabled: !!staffId, // Só executa se staffId existir
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    gcTime: 1000 * 60 * 10, // Garbage collection após 10 minutos
  });
}
