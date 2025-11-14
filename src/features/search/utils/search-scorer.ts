/**
 * 🎯 Search Scorer
 * Algoritmo de relevância para ordenação de resultados de busca
 */

/**
 * Remove acentos e normaliza string para comparação
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .trim();
}

/**
 * Verifica se uma palavra está no início de qualquer palavra na string
 * Ex: "jo" encontra "joão silva" porque "jo" está no início de "joão"
 */
function startsWithWord(text: string, query: string): boolean {
  const words = text.split(/\s+/);
  return words.some((word) => word.startsWith(query));
}

/**
 * Conta quantas palavras da query estão presentes no texto
 */
function countMatchingWords(text: string, query: string): number {
  const queryWords = query.split(/\s+/).filter((w) => w.length > 0);
  const textWords = text.split(/\s+/);

  return queryWords.filter((qWord) =>
    textWords.some((tWord) => tWord.includes(qWord)),
  ).length;
}

/**
 * 🎯 Calcula score de relevância de um resultado de busca
 *
 * @param query - Termo de busca do usuário
 * @param title - Título do item
 * @param description - Descrição do item (opcional)
 * @param metadata - Metadados adicionais para scoring (opcional)
 * @returns Score de 0-100 (0 = sem relevância, 100 = match perfeito)
 *
 * @example
 * calculateRelevanceScore("joão", "João Silva", "Barbeiro") // ~95 (nome exato)
 * calculateRelevanceScore("barb", "Maria Santos", "Barbeira") // ~40 (descrição)
 * calculateRelevanceScore("xyz", "João Silva", "Barbeiro") // 0 (sem match)
 */
export function calculateRelevanceScore(
  query: string,
  title: string,
  description: string = "",
  metadata?: Record<string, unknown>,
): number {
  if (!query || query.trim().length === 0) return 0;

  const normalizedQuery = normalizeString(query);
  const normalizedTitle = normalizeString(title);
  const normalizedDesc = normalizeString(description);

  let score = 0;

  // 🏆 MATCH PERFEITO: Título exatamente igual à busca (+100)
  if (normalizedTitle === normalizedQuery) {
    return 100;
  }

  // 🥇 MATCH EXATO: Título contém a busca completa como palavra (+70)
  const queryRegex = new RegExp(`\\b${normalizedQuery}\\b`);
  if (queryRegex.test(normalizedTitle)) {
    score += 70;
  }

  // 🥈 COMEÇA COM: Título começa com a busca (+50)
  else if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 50;
  }

  // 🥉 COMEÇA PALAVRA: Alguma palavra do título começa com a busca (+40)
  else if (startsWithWord(normalizedTitle, normalizedQuery)) {
    score += 40;
  }

  // 📝 CONTÉM NO TÍTULO: Busca está em qualquer lugar do título (+30)
  else if (normalizedTitle.includes(normalizedQuery)) {
    score += 30;
  }

  // 📄 CONTÉM NA DESCRIÇÃO: Busca está na descrição (+20)
  if (normalizedDesc.includes(normalizedQuery)) {
    score += 20;
  }

  // 🔤 MATCH DE MÚLTIPLAS PALAVRAS: Bonus por cada palavra que dá match
  const titleWordMatches = countMatchingWords(normalizedTitle, normalizedQuery);
  const descWordMatches = countMatchingWords(normalizedDesc, normalizedQuery);
  score += titleWordMatches * 5;
  score += descWordMatches * 2;

  // 🎨 BONUS POR METADATA (ex: tags, categorias)
  if (metadata) {
    const metadataString = normalizeString(JSON.stringify(metadata));
    if (metadataString.includes(normalizedQuery)) {
      score += 5;
    }
  }

  // 🎯 NORMALIZAR: Garantir que não ultrapassa 100
  return Math.min(score, 100);
}

/**
 * 🏅 Ordena array de resultados por score de relevância (maior primeiro)
 */
export function sortByRelevance<T extends { score: number }>(
  results: T[],
): T[] {
  return [...results].sort((a, b) => {
    // Primeiro por score (maior primeiro)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Empate: manter ordem original (estabilidade)
    return 0;
  });
}

/**
 * 🔍 Filtra resultados que não têm relevância mínima
 */
export function filterByMinScore<T extends { score: number }>(
  results: T[],
  minScore: number = 10,
): T[] {
  return results.filter((result) => result.score >= minScore);
}

/**
 * 📊 Aplica score e ordena resultados de busca
 *
 * @example
 * const scored = scoreAndSort(items, query, (item) => ({
 *   title: item.name,
 *   description: item.role,
 * }));
 */
export function scoreAndSort<T>(
  items: T[],
  query: string,
  extractor: (item: T) => {
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
  },
): Array<T & { score: number }> {
  const scored = items.map((item) => {
    const { title, description = "", metadata } = extractor(item);
    const score = calculateRelevanceScore(query, title, description, metadata);
    return { ...item, score };
  });

  return sortByRelevance(filterByMinScore(scored));
}
