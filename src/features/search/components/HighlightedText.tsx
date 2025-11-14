/**
 * ✨ Highlighted Text Component
 * Componente React para renderizar texto com highlights
 */

import { highlightMatches } from "../utils/search-highlighter";

/**
 * 🎯 Componente React para renderizar texto com highlights
 *
 * @example
 * <HighlightedText text="João Silva" query="jo" />
 * // Renderiza: <span><mark>Jo</mark>ão Silva</span>
 */
interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

export function HighlightedText({
  text,
  query,
  className = "",
  highlightClassName = "bg-yellow-200 dark:bg-yellow-900/50 font-semibold rounded px-0.5",
}: HighlightedTextProps) {
  const parts = highlightMatches(text, query);

  return (
    <span className={className}>
      {parts.map((part, index: number) =>
        part.highlight ? (
          <mark key={index} className={highlightClassName}>
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  );
}
