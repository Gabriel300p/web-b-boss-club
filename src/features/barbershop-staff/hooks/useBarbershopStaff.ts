/**
 * 🪝 Barbershop Staff Hook
 * Data management hook for barbershop staff with optimized caching
 */
import { useToast } from "@shared/hooks";
import { createAppError, ErrorHandler, ErrorTypes } from "@shared/lib/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth";

import type {
  CreateStaffFormData,
  StaffFilters,
  UpdateStaffFormData,
} from "../schemas/barbershop-staff.schemas";
import {
  createStaff,
  deleteStaff,
  fetchStaffById,
  fetchStaffList,
  fetchStaffStats,
  toggleStaffStatus,
  updateStaff,
} from "../services/barbershop-staff.service";

// 🔑 Query keys for optimized caching with user isolation
export const STAFF_QUERY_KEYS = {
  staff: {
    all: (userId?: string) => ["barbershop-staff", userId] as const,
    lists: (userId?: string) =>
      [...STAFF_QUERY_KEYS.staff.all(userId), "list"] as const,
    list: (filters: StaffFilters, userId?: string) =>
      [...STAFF_QUERY_KEYS.staff.lists(userId), { filters }] as const,
    details: (userId?: string) =>
      [...STAFF_QUERY_KEYS.staff.all(userId), "detail"] as const,
    detail: (id: string, userId?: string) =>
      [...STAFF_QUERY_KEYS.staff.details(userId), id] as const,
    stats: (barbershopId?: string, userId?: string) =>
      [
        ...STAFF_QUERY_KEYS.staff.all(userId),
        "stats",
        { barbershopId },
      ] as const,
  },
} as const;

// 🎯 Default filter values (moved outside component for optimization)
const DEFAULT_FILTERS: StaffFilters = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
};

// 🎯 Empty initial filters constant to prevent recreating objects
const EMPTY_INITIAL_FILTERS: StaffFilters = DEFAULT_FILTERS;

// 🚀 Main hook for staff list with filters
export function useBarbershopStaff(
  filters: StaffFilters = EMPTY_INITIAL_FILTERS,
) {
  // 🎯 Memoize merged filters to prevent unnecessary re-renders
  const mergedFilters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      ...filters,
    }),
    [filters],
  );

  const { success } = useToast();
  const queryClient = useQueryClient();
  const errorHandler = ErrorHandler.getInstance();
  const { user } = useAuthStore(); // 🔑 Obter usuário atual para isolamento de cache
  const { t } = useTranslation("barbershop-staff");

  // 🎯 Memoize query key to prevent unnecessary re-fetches
  const queryKey = useMemo(
    () => STAFF_QUERY_KEYS.staff.list(mergedFilters, user?.id),
    [mergedFilters, user?.id],
  );

  // 🔄 Query for fetching staff list
  const {
    data: staffData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey, // 🔒 Cache isolado por usuário com query key memoizada
    queryFn: () => fetchStaffList(mergedFilters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // 🚀 Create mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (data) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.lists(user?.id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.stats(undefined, user?.id),
      });

      success(
        t("toasts.success.createTitle"),
        t("toasts.success.createMessage", { name: data.staff.first_name }),
        t("toasts.success.createDescription"),
      );
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "CREATE_STAFF_FAILED",
        t("toasts.errors.messages.createFailed"),
        {
          details: error,
          context: { action: "create", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🚀 Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffFormData }) => {
      // 🏢 Define primeira unidade como principal se não foi especificada
      const dataWithPrimaryUnit = {
        ...data,
        primary_unit_id:
          data.primary_unit_id ||
          (data.unit_ids && data.unit_ids.length > 0
            ? data.unit_ids[0]
            : undefined),
      };
      return updateStaff(id, dataWithPrimaryUnit);
    },
    onSuccess: (data) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.lists(user?.id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.detail(data.id, user?.id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.stats(undefined, user?.id),
      });

      success(
        t("toasts.success.updateTitle"),
        t("toasts.success.updateMessage", { name: data.first_name }),
        t("toasts.success.updateDescription"),
      );
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "UPDATE_STAFF_FAILED",
        t("toasts.errors.messages.updateFailed"),
        {
          details: error,
          context: { action: "update", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🚀 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: (_, id) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.lists(user?.id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.detail(id, user?.id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.stats(undefined, user?.id),
      });

      success(
        t("toasts.success.deleteTitle"),
        t("toasts.success.deleteMessage"),
        t("toasts.success.deleteDescription"),
      );
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "DELETE_STAFF_FAILED",
        t("toasts.errors.messages.deleteFailed"),
        {
          details: error,
          context: { action: "delete", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🔄 Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: toggleStaffStatus,
    onSuccess: (updatedStaff) => {
      const isActive = updatedStaff.status === "ACTIVE";

      // 🚀 Toast imediato (não bloqueia)
      success(
        isActive
          ? t("toasts.success.activateTitle", {
              defaultValue: "Colaborador ativado!",
            })
          : t("toasts.success.deactivateTitle", {
              defaultValue: "Colaborador inativado!",
            }),
        isActive
          ? t("toasts.success.activateMessage", {
              defaultValue: "O colaborador foi ativado com sucesso.",
            })
          : t("toasts.success.deactivateMessage", {
              defaultValue: "O colaborador foi inativado com sucesso.",
            }),
      );

      // 🔄 Invalidar em background (não bloqueia)
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.staff.lists(user?.id),
        });
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.staff.detail(updatedStaff.id, user?.id),
        });
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.staff.stats(undefined, user?.id),
        });
      }, 0);
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "TOGGLE_STATUS_FAILED",
        t("toasts.errors.messages.toggleStatusFailed", {
          defaultValue: "Erro ao alterar status do colaborador",
        }),
        {
          details: error,
          context: { action: "toggleStatus", entity: "staff" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🍞 Toast-enabled mutation wrappers
  const createStaffWithToast = async (data: CreateStaffFormData) => {
    return await createMutation.mutateAsync(data);
  };

  const updateStaffWithToast = async (
    id: string,
    data: UpdateStaffFormData,
  ) => {
    return await updateMutation.mutateAsync({ id, data });
  };

  const deleteStaffWithToast = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const toggleStaffStatusWithToast = async (id: string) => {
    return await toggleStatusMutation.mutateAsync(id);
  };

  return {
    // Data
    staff: staffData?.data || [],
    pagination: staffData?.pagination,
    meta: staffData?.meta,
    statistics: staffData?.statistics,

    // Loading states
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,

    // Error state
    error,

    // Actions
    createStaff: createStaffWithToast,
    updateStaff: updateStaffWithToast,
    deleteStaff: deleteStaffWithToast,
    toggleStaffStatus: toggleStaffStatusWithToast,
    refetch,
  };
}

// 📊 Hook for staff statistics
export function useStaffStats(barbershopId?: string) {
  const { user } = useAuthStore(); // 🔑 Obter usuário atual

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: STAFF_QUERY_KEYS.staff.stats(barbershopId, user?.id), // 🔒 Cache isolado por usuário
    queryFn: () => fetchStaffStats(barbershopId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats,
    isLoading,
    error,
  };
}

// 🔍 Hook for single staff member
export function useStaffDetail(id: string) {
  const { user } = useAuthStore(); // 🔑 Obter usuário atual

  const {
    data: staff,
    isLoading,
    error,
  } = useQuery({
    queryKey: STAFF_QUERY_KEYS.staff.detail(id, user?.id), // 🔒 Cache isolado por usuário
    queryFn: () => fetchStaffById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    staff,
    isLoading,
    error,
  };
}
