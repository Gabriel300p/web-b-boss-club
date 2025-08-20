/**
 * 🧪 Tests for useSearch hook
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockComunicacoes } from "@/test/utils/test-utils";
import { useSearch } from "./useSearch";

describe("useSearch", () => {
  const mockData = mockComunicacoes(3);

  it("should return all comunicacoes when search term is empty", () => {
    const { result } = renderHook(() => useSearch(mockData));

    expect(result.current.filteredComunicacoes).toEqual(mockData);
    expect(result.current.hasActiveSearch).toBe(false);
  });

  it("should filter comunicacoes by title", () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.handleSearch("Communication 1");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(1);
    expect(result.current.filteredComunicacoes[0].titulo).toBe(
      "Communication 1",
    );
    expect(result.current.hasActiveSearch).toBe(true);
  });

  it("should filter comunicacoes by author", () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.handleSearch("Author 2");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(1);
    expect(result.current.filteredComunicacoes[0].autor).toBe("Author 2");
  });

  it("should filter comunicacoes by type", () => {
    const customData = [
      ...mockData,
      { ...mockComunicacoes(1)[0], tipo: "Aviso" as const },
    ];

    const { result } = renderHook(() => useSearch(customData));

    act(() => {
      result.current.handleSearch("Aviso");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(1);
    expect(result.current.filteredComunicacoes[0].tipo).toBe("Aviso");
  });

  it("should filter comunicacoes by description", () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.handleSearch("description");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(3);
  });

  it("should be case insensitive", () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.handleSearch("COMMUNICATION 1");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(1);
    expect(result.current.filteredComunicacoes[0].titulo).toBe(
      "Communication 1",
    );
  });

  it("should handle empty search term", () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.handleSearch("   ");
    });

    expect(result.current.filteredComunicacoes).toEqual(mockData);
    expect(result.current.hasActiveSearch).toBe(false);
  });

  it("should return empty array when no matches found", () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.handleSearch("nonexistent");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(0);
    expect(result.current.hasActiveSearch).toBe(true);
  });

  it("should clear search when called with empty string", () => {
    const { result } = renderHook(() => useSearch(mockData));

    // First search for something
    act(() => {
      result.current.handleSearch("Communication 1");
    });

    expect(result.current.filteredComunicacoes).toHaveLength(1);

    // Then clear the search
    act(() => {
      result.current.handleSearch("");
    });

    expect(result.current.filteredComunicacoes).toEqual(mockData);
    expect(result.current.hasActiveSearch).toBe(false);
  });
});
