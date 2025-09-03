/**
 * 🪝 Barbershop Staff Hook
 * Data management hook for barbershop staff with optimized caching
 */
import { useToast } from "@shared/hooks";
import { createAppError, ErrorHandler, ErrorTypes } from "@shared/lib/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  updateStaff,
} from "../services/barbershop-staff.service";

// 🔑 Query keys for optimized caching
export const STAFF_QUERY_KEYS = {
  staff: {
    all: ["barbershop-staff"] as const,
    lists: () => [...STAFF_QUERY_KEYS.staff.all, "list"] as const,
    list: (filters: StaffFilters) =>
      [...STAFF_QUERY_KEYS.staff.lists(), { filters }] as const,
    details: () => [...STAFF_QUERY_KEYS.staff.all, "detail"] as const,
    detail: (id: string) => [...STAFF_QUERY_KEYS.staff.details(), id] as const,
    stats: (barbershopId?: string) =>
      [...STAFF_QUERY_KEYS.staff.all, "stats", { barbershopId }] as const,
  },
} as const;

// 🚀 Main hook for staff list with filters
export function useBarbershopStaff(filters: StaffFilters = {}) {
  const defaultFilters: StaffFilters = {
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  };
  const mergedFilters = { ...defaultFilters, ...filters };
  const { success } = useToast();
  const queryClient = useQueryClient();
  const errorHandler = ErrorHandler.getInstance();

  // 🔄 Query for fetching staff list
  const {
    data: staffData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: STAFF_QUERY_KEYS.staff.list(mergedFilters),
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
        queryKey: STAFF_QUERY_KEYS.staff.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.stats(),
      });

      success(
        "Funcionário criado!",
        `${data.staff.first_name} foi adicionado à equipe`,
        "O funcionário foi criado com sucesso",
      );
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "CREATE_STAFF_FAILED",
        "Erro ao criar funcionário",
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
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffFormData }) =>
      updateStaff(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.stats(),
      });

      success(
        "Funcionário atualizado!",
        `${data.first_name} foi atualizado com sucesso`,
        "As alterações foram salvas",
      );
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "UPDATE_STAFF_FAILED",
        "Erro ao atualizar funcionário",
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
        queryKey: STAFF_QUERY_KEYS.staff.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.staff.stats(),
      });

      success(
        "Funcionário removido!",
        "O funcionário foi removido da equipe",
        "A remoção foi realizada com sucesso",
      );
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "DELETE_STAFF_FAILED",
        "Erro ao remover funcionário",
        {
          details: error,
          context: { action: "delete", entity: "staff" },
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

    // Error state
    error,

    // Actions
    createStaff: createStaffWithToast,
    updateStaff: updateStaffWithToast,
    deleteStaff: deleteStaffWithToast,
    refetch,
  };
}

// 📊 Hook for staff statistics
export function useStaffStats(barbershopId?: string) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: STAFF_QUERY_KEYS.staff.stats(barbershopId),
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
  const {
    data: staff,
    isLoading,
    error,
  } = useQuery({
    queryKey: STAFF_QUERY_KEYS.staff.detail(id),
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
