import { useToast } from "@shared/hooks";
import { ErrorHandler, ErrorTypes, createAppError } from "@shared/lib/errors";
import {
  QUERY_KEYS,
  createMutationOptions,
  createQueryOptions,
} from "@shared/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type {
  Comunicacao,
  ComunicacaoForm,
} from "../schemas/comunicacao.schemas";
import {
  createComunicacao,
  deleteComunicacao,
  fetchComunicacoes,
  updateComunicacao,
} from "../services/comunicacao.service";

// 🚀 Optimized hook with advanced caching and optimistic updates
export function useComunicacoes() {
  const { success } = useToast();
  const { t } = useTranslation("records");
  const errorHandler = ErrorHandler.getInstance();

  // 🔄 Optimized query with centralized configuration
  const {
    data: comunicacoes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.comunicacoes.all,
    ...createQueryOptions.list(fetchComunicacoes),
  });

  // 🚀 Create mutation with optimistic updates
  const createMutation = useMutation(
    createMutationOptions.withOptimisticUpdate<Comunicacao, ComunicacaoForm>({
      mutationFn: createComunicacao,
      queryKey: QUERY_KEYS.comunicacoes.all,
      optimisticUpdateFn: (oldData: unknown, newData: ComunicacaoForm) => {
        const comunicacoesList = oldData as Comunicacao[];
        const optimisticComunicacao: Comunicacao = {
          id: `temp-${Date.now()}`, // Temporary ID
          ...newData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        };
        return [...comunicacoesList, optimisticComunicacao];
      },
      onError: (error) => {
        const appError = createAppError(
          ErrorTypes.API_ERROR,
          "CREATE_COMUNICACAO_FAILED",
          t("errors.create.title"),
          {
            details: error,
            context: { action: "create", entity: "comunicacao" },
          },
        );
        errorHandler.handle(appError);
      },
    }),
  );

  // 🚀 Update mutation with optimistic updates
  const updateMutation = useMutation(
    createMutationOptions.withOptimisticUpdate<
      Comunicacao,
      { id: string; data: ComunicacaoForm }
    >({
      mutationFn: ({ id, data }) => updateComunicacao(id, data),
      queryKey: QUERY_KEYS.comunicacoes.all,
      optimisticUpdateFn: (oldData: unknown, { id, data }) => {
        const comunicacoesList = oldData as Comunicacao[];
        return comunicacoesList.map((comunicacao) =>
          comunicacao.id === id ? { ...comunicacao, ...data } : comunicacao,
        );
      },
      onError: (error) => {
        const appError = createAppError(
          ErrorTypes.API_ERROR,
          "UPDATE_COMUNICACAO_FAILED",
          t("errors.update.title"),
          {
            details: error,
            context: { action: "update", entity: "comunicacao" },
          },
        );
        errorHandler.handle(appError);
      },
    }),
  );

  // 🚀 Delete mutation with optimistic updates
  const deleteMutation = useMutation(
    createMutationOptions.withOptimisticUpdate<void, string>({
      mutationFn: deleteComunicacao,
      queryKey: QUERY_KEYS.comunicacoes.all,
      optimisticUpdateFn: (oldData: unknown, id: string) => {
        const comunicacoesList = oldData as Comunicacao[];
        return comunicacoesList.filter((comunicacao) => comunicacao.id !== id);
      },
      onError: (error) => {
        const appError = createAppError(
          ErrorTypes.API_ERROR,
          "DELETE_COMUNICACAO_FAILED",
          t("errors.delete.title"),
          {
            details: error,
            context: { action: "delete", entity: "comunicacao" },
          },
        );
        errorHandler.handle(appError);
      },
    }),
  );

  // 🍞 Toast-enabled mutation wrappers
  const createWithToast = async (data: ComunicacaoForm) => {
    const result = await createMutation.mutateAsync(data);
    success(
      t("toasts.create.title"),
      t("toasts.create.subtitle", { title: data.titulo }),
      t("toasts.create.description"),
    );
    return result;
  };

  const updateWithToast = async (id: string, data: ComunicacaoForm) => {
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
    comunicacoes,
    isLoading,
    error,
    createComunicacao: createWithToast,
    updateComunicacao: updateWithToast,
    deleteComunicacao: deleteWithToast,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
