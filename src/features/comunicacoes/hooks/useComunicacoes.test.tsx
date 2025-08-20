/**
 * 🧪 Tests for useComunicacoes hook
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
// Usa ToastProvider real (warnings minimizados usando act nas mutações)
import { ToastProvider } from "@/app/providers/ToastProvider";
import { setQueryClient } from "@shared/lib/react-query";
import {
  createTestQueryClient,
  mockComunicacao,
  mockComunicacoes,
} from "../../../test/utils/test-utils";
import * as comunicacaoService from "../services/comunicacao.service";
import { useComunicacoes } from "./useComunicacoes";

// Mock the service
vi.mock("../services/comunicacao.service");

const mockedService = vi.mocked(comunicacaoService);

describe("useComunicacoes", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = createTestQueryClient();
    setQueryClient(queryClient); // Set the global queryClient for mutations
    vi.clearAllMocks();
  });

  it("should fetch comunicacoes successfully", async () => {
    const mockData = mockComunicacoes(3);
    mockedService.fetchComunicacoes.mockResolvedValue(mockData);

    const { result } = renderHook(() => useComunicacoes(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.comunicacoes).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.comunicacoes).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    const error = new Error("Failed to fetch");
    mockedService.fetchComunicacoes.mockRejectedValue(error);

    // Criar queryClient específico para teste de erro (sem retry)
    const errorQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
      },
    });

    const errorWrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={errorQueryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useComunicacoes(), {
      wrapper: errorWrapper,
    });

    // Aguardar o erro ser processado sem retry
    await waitFor(
      () => {
        expect(result.current.error).toBeTruthy();
      },
      { timeout: 5000 },
    );

    expect(result.current.comunicacoes).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should create comunicacao with optimistic update", async () => {
    const existingData = mockComunicacoes(2);
    const newComunicacao = mockComunicacao({ titulo: "New Communication" });

    mockedService.fetchComunicacoes.mockResolvedValue(existingData);
    mockedService.createComunicacao.mockResolvedValue(newComunicacao);

    const { result } = renderHook(() => useComunicacoes(), { wrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.comunicacoes).toHaveLength(2);

    // Create new comunicacao
    await act(async () => {
      await result.current.createComunicacao({
        titulo: "New Communication",
        autor: "Test Author",
        tipo: "Comunicado",
        descricao: "Test description",
      });
    });

    expect(mockedService.createComunicacao).toHaveBeenCalledWith({
      titulo: "New Communication",
      autor: "Test Author",
      tipo: "Comunicado",
      descricao: "Test description",
    });
  });

  it("should update comunicacao", async () => {
    const existingData = mockComunicacoes(2);
    const updatedComunicacao = { ...existingData[0], titulo: "Updated Title" };

    mockedService.fetchComunicacoes.mockResolvedValue(existingData);
    mockedService.updateComunicacao.mockResolvedValue(updatedComunicacao);

    const { result } = renderHook(() => useComunicacoes(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateComunicacao("1", {
        titulo: "Updated Title",
        autor: "Test Author",
        tipo: "Comunicado",
        descricao: "Test description",
      });
    });

    expect(mockedService.updateComunicacao).toHaveBeenCalledWith("1", {
      titulo: "Updated Title",
      autor: "Test Author",
      tipo: "Comunicado",
      descricao: "Test description",
    });
  });

  it("should delete comunicacao", async () => {
    const existingData = mockComunicacoes(2);

    mockedService.fetchComunicacoes.mockResolvedValue(existingData);
    mockedService.deleteComunicacao.mockResolvedValue();

    const { result } = renderHook(() => useComunicacoes(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteComunicacao("1");
    });

    expect(mockedService.deleteComunicacao).toHaveBeenCalledWith("1");
  });

  it("should track loading states for mutations", async () => {
    const existingData = mockComunicacoes(1);

    mockedService.fetchComunicacoes.mockResolvedValue(existingData);
    mockedService.createComunicacao.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockComunicacao()), 100),
        ),
    );

    const { result } = renderHook(() => useComunicacoes(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isCreating).toBe(false);

    const createPromise = result.current.createComunicacao({
      titulo: "Test",
      autor: "Test",
      tipo: "Comunicado",
      descricao: "Test",
    });

    // Aguardar o estado de loading ser atualizado
    await waitFor(() => {
      expect(result.current.isCreating).toBe(true);
    });

    await createPromise;

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });
  });
});
