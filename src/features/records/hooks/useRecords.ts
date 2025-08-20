/**
 * 🪝 Generic Records Hook
 * Data management hook for the generic records feature
 */
import { useToast } from "@shared/hooks";
import { createAppError, ErrorHandler, ErrorTypes } from "@shared/lib/errors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { RecordForm } from "../schemas/record.schemas";
import {
  createRecord,
  deleteRecord,
  fetchRecords,
  updateRecord,
} from "../services/record.service";

// Generic query keys for records
const RECORD_QUERY_KEYS = {
  records: {
    all: ["records"] as const,
    lists: () => [...RECORD_QUERY_KEYS.records.all, "list"] as const,
    list: (filters: unknown) =>
      [...RECORD_QUERY_KEYS.records.lists(), { filters }] as const,
    details: () => [...RECORD_QUERY_KEYS.records.all, "detail"] as const,
    detail: (id: string) =>
      [...RECORD_QUERY_KEYS.records.details(), id] as const,
  },
};

// 🚀 Generic records hook with optimized caching
export function useRecords() {
  const { success } = useToast();
  const { t } = useTranslation("records");
  const errorHandler = ErrorHandler.getInstance();

  // 🔄 Query for fetching all records
  const {
    data: records = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: RECORD_QUERY_KEYS.records.all,
    queryFn: fetchRecords,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // 🚀 Create mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      // Invalidate and refetch records
      // queryClient.invalidateQueries({ queryKey: RECORD_QUERY_KEYS.records.all });
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "CREATE_RECORD_FAILED",
        t("errors.create.title"),
        {
          details: error,
          context: { action: "create", entity: "record" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🚀 Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordForm }) =>
      updateRecord(id, data),
    onSuccess: () => {
      // Invalidate and refetch records
      // queryClient.invalidateQueries({ queryKey: RECORD_QUERY_KEYS.records.all });
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "UPDATE_RECORD_FAILED",
        t("errors.update.title"),
        {
          details: error,
          context: { action: "update", entity: "record" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🚀 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => {
      // Invalidate and refetch records
      // queryClient.invalidateQueries({ queryKey: RECORD_QUERY_KEYS.records.all });
    },
    onError: (error) => {
      const appError = createAppError(
        ErrorTypes.API_ERROR,
        "DELETE_RECORD_FAILED",
        t("errors.delete.title"),
        {
          details: error,
          context: { action: "delete", entity: "record" },
        },
      );
      errorHandler.handle(appError);
    },
  });

  // 🍞 Toast-enabled mutation wrappers
  const createWithToast = async (data: RecordForm) => {
    const result = await createMutation.mutateAsync(data);
    success(
      t("toasts.create.title"),
      t("toasts.create.subtitle", { title: data.titulo }),
      t("toasts.create.description"),
    );
    return result;
  };

  const updateWithToast = async (id: string, data: RecordForm) => {
    const result = await updateMutation.mutateAsync({ id, data });
    success(
      t("toasts.update.title"),
      t("toasts.update.subtitle", { title: data.titulo }),
      t("toasts.update.description"),
    );
    return result;
  };

  const deleteWithToast = async (id: string) => {
    const result = await deleteMutation.mutateAsync(id);
    success(
      t("toasts.delete.title"),
      t("toasts.delete.subtitle"),
      t("toasts.delete.description"),
    );
    return result;
  };

  return {
    records,
    isLoading,
    error,
    createRecord: createWithToast,
    updateRecord: updateWithToast,
    deleteRecord: deleteWithToast,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
