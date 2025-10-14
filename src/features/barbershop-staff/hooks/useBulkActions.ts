/**
 * 🪝 Bulk Actions Hook
 * Hook para operações em massa de colaboradores
 */
import { useToast } from "@shared/hooks";
import { createAppError, ErrorHandler, ErrorTypes } from "@shared/lib/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "../../../app/store/auth";
import type { BarbershopStaff } from "../schemas/barbershop-staff.schemas";
import {
  bulkActivateStaff,
  bulkDeactivateStaff,
  type BulkOperationResult,
} from "../services/bulk-staff.service";
import { exportStaffToCSV } from "../services/staff-csv-export.service";
import { STAFF_QUERY_KEYS } from "./useBarbershopStaff";

export interface UseBulkActionsOptions {
  onSuccess?: (result: BulkOperationResult) => void;
  onError?: (error: Error) => void;
  onCSVExportSuccess?: () => void;
}

export function useBulkActions(options?: UseBulkActionsOptions) {
  const { success } = useToast();
  const queryClient = useQueryClient();
  const errorHandler = ErrorHandler.getInstance();
  const { user } = useAuthStore();
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  // 🚀 Mutation: Ativar em massa
  const activateMutation = useMutation({
    mutationFn: bulkActivateStaff,
    onSuccess: (result) => {
      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.all(user?.id),
      });

      // Toast de sucesso com detalhes
      if (result.failed === 0 && result.skipped === 0) {
        success(
          "Sucesso!",
          `${result.success} colaborador(es) ativado(s)`,
          "Operação concluída com sucesso",
        );
      } else if (result.success > 0) {
        success(
          "Sucesso parcial",
          `${result.success} ativado(s), ${result.skipped || 0} já ativo(s), ${result.failed} falhou(aram)`,
          "Alguns itens foram atualizados",
        );
      } else {
        success(
          "Nenhuma alteração",
          `${result.skipped || 0} colaborador(es) já estava(m) ativo(s)`,
          "",
        );
      }

      options?.onSuccess?.(result);
    },
    onError: (error: Error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "BULK_ACTIVATE_FAILED",
        "Não foi possível ativar os colaboradores selecionados",
        {
          details: error,
          context: { action: "bulk_activate", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
      options?.onError?.(error);
    },
  });

  // 🛑 Mutation: Inativar em massa
  const deactivateMutation = useMutation({
    mutationFn: bulkDeactivateStaff,
    onSuccess: (result) => {
      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.all(user?.id),
      });

      // Toast de sucesso com detalhes
      if (result.failed === 0 && result.skipped === 0) {
        success(
          "Sucesso!",
          `${result.success} colaborador(es) inativado(s)`,
          "Operação concluída com sucesso",
        );
      } else if (result.success > 0) {
        success(
          "Sucesso parcial",
          `${result.success} inativado(s), ${result.skipped || 0} já inativo(s), ${result.failed} falhou(aram)`,
          "Alguns itens foram atualizados",
        );
      } else {
        success(
          "Nenhuma alteração",
          `${result.skipped || 0} colaborador(es) já estava(m) inativo(s)`,
          "",
        );
      }

      options?.onSuccess?.(result);
    },
    onError: (error: Error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "BULK_DEACTIVATE_FAILED",
        "Não foi possível inativar os colaboradores selecionados",
        {
          details: error,
          context: { action: "bulk_deactivate", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
      options?.onError?.(error);
    },
  });

  // 📊 CSV Export handler
  const handleExportCSV = async (staffList: BarbershopStaff[]) => {
    setIsExportingCSV(true);
    try {
      await exportStaffToCSV(staffList);
      success(
        "Exportação concluída!",
        `${staffList.length} colaborador${staffList.length > 1 ? "es" : ""} exportado${staffList.length > 1 ? "s" : ""} com sucesso`,
        "O arquivo CSV foi baixado",
      );
      options?.onCSVExportSuccess?.();
    } catch (error: unknown) {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "CSV_EXPORT_FAILED",
        "Não foi possível exportar os colaboradores",
        {
          details: error,
          context: { action: "csv_export", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
    } finally {
      setIsExportingCSV(false);
    }
  };

  return {
    // Mutations
    activateMutation,
    deactivateMutation,

    // Loading states
    isActivating: activateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    isExportingCSV,
    isLoading:
      activateMutation.isPending ||
      deactivateMutation.isPending ||
      isExportingCSV,

    // Actions
    activateStaff: activateMutation.mutate,
    deactivateStaff: deactivateMutation.mutate,
    exportCSV: handleExportCSV,

    // Results
    activateResult: activateMutation.data,
    deactivateResult: deactivateMutation.data,

    // Errors
    activateError: activateMutation.error,
    deactivateError: deactivateMutation.error,

    // Reset
    reset: () => {
      activateMutation.reset();
      deactivateMutation.reset();
    },
  };
}
