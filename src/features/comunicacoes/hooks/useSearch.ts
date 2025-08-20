import { useCallback, useMemo, useState } from "react";
import type { Comunicacao } from "../schemas/comunicacao.schemas";

// 🚀 Optimized search hook with memoization
export function useSearch(comunicacoes: Comunicacao[] = []) {
  const [searchTerm, setSearchTerm] = useState("");

  // 🚀 Memoize filtered results to prevent unnecessary re-filtering
  const filteredComunicacoes = useMemo(() => {
    if (!searchTerm.trim()) return comunicacoes;

    const lowercaseSearch = searchTerm.toLowerCase();
    return comunicacoes.filter(
      (comunicacao) =>
        comunicacao.titulo.toLowerCase().includes(lowercaseSearch) ||
        comunicacao.autor.toLowerCase().includes(lowercaseSearch) ||
        comunicacao.tipo.toLowerCase().includes(lowercaseSearch) ||
        comunicacao.descricao.toLowerCase().includes(lowercaseSearch),
    );
  }, [comunicacoes, searchTerm]);

  // 🚀 Memoize search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // 🚀 Memoize derived state
  const hasActiveSearch = useMemo(() => searchTerm.trim() !== "", [searchTerm]);

  return {
    searchTerm,
    filteredComunicacoes,
    handleSearch,
    hasActiveSearch,
  };
}
