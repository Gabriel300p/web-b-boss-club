/**
 * ✨ Search Highlighter
 * Utilitários para destacar termos de busca em resultados
 */

/**
 * Remove acentos e normaliza string (sync com search-scorer)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * 🎨 Encontra índices de match da query no texto (case-insensitive, ignora acentos)
 *
 * @returns Array de [startIndex, endIndex] dos matches encontrados
 */
function findMatchIndices(
  text: string,
  query: string,
): Array<[number, number]> {
  if (!query || !text) return [];

  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query);
  const indices: Array<[number, number]> = [];

  let index = normalizedText.indexOf(normalizedQuery);
  while (index !== -1) {
    indices.push([index, index + normalizedQuery.length]);
    index = normalizedText.indexOf(normalizedQuery, index + 1);
  }

  return indices;
}

/**
 * ✨ Destaca termo de busca no texto, retornando array de partes
 *
 * @param text - Texto original
 * @param query - Termo de busca
 * @returns Array de objetos { text: string, highlight: boolean }
 *
 * @example
 * highlightMatches("João Silva", "jo")
 * // [{ text: "Jo", highlight: true }, { text: "ão Silva", highlight: false }]
 */
export function highlightMatches(
  text: string,
  query: string,
): Array<{ text: string; highlight: boolean }> {
  if (!query || !text) {
    return [{ text, highlight: false }];
  }

  const indices = findMatchIndices(text, query);

  if (indices.length === 0) {
    return [{ text, highlight: false }];
  }

  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    // Adicionar texto antes do match
    if (start > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, start),
        highlight: false,
      });
    }

    // Adicionar texto do match (highlighted)
    parts.push({
      text: text.substring(start, end),
      highlight: true,
    });

    lastIndex = end;
  });

  // Adicionar texto restante após último match
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlight: false,
    });
  }

  return parts;
}

/**
 * 📝 Trunca texto longo e adiciona elipse
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * 🎯 Extrai snippet relevante do texto baseado na query
 * Útil para mostrar contexto em descrições longas
 *
 * @param text - Texto completo
 * @param query - Termo de busca
 * @param snippetLength - Tamanho do snippet (caracteres)
 * @returns Snippet centrado no match ou início do texto
 *
 * @example
 * extractSnippet("Este é um texto muito longo com João Silva no meio...", "joão", 50)
 * // "...texto muito longo com João Silva no meio..."
 */
export function extractSnippet(
  text: string,
  query: string,
  snippetLength: number = 150,
): string {
  if (text.length <= snippetLength) return text;

  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query);
  const matchIndex = normalizedText.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    // Sem match: retornar início do texto
    return truncateText(text, snippetLength);
  }

  // Centralizar snippet no match
  const halfSnippet = Math.floor(snippetLength / 2);
  let start = Math.max(0, matchIndex - halfSnippet);
  let end = Math.min(text.length, start + snippetLength);

  // Ajustar para não cortar palavras
  if (start > 0) {
    const spaceIndex = text.lastIndexOf(" ", start);
    if (spaceIndex > start - 20) start = spaceIndex + 1;
  }

  if (end < text.length) {
    const spaceIndex = text.indexOf(" ", end);
    if (spaceIndex !== -1 && spaceIndex < end + 20) end = spaceIndex;
  }

  let snippet = text.substring(start, end).trim();

  // Adicionar elipse
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}
