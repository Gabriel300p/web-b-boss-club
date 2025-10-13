/**
 * 🎯 ScoreCell Component
 * Célula da tabela que exibe o score do barbeiro com loading state
 * OTIMIZADO: Apenas busca o score quando o usuário interage
 */
import { ScoreBadge } from "./ScoreBadge";

interface ScoreCellProps {
  // Score pode vir da lista principal se disponível
  score?: number;
  scoreLevel?:
    | "critical"
    | "needs_improvement"
    | "regular"
    | "good"
    | "excellent";
  onClick?: () => void;
}

export function ScoreCell({ score, scoreLevel, onClick }: ScoreCellProps) {
  // 🎯 Se não tiver score da lista principal, mostra placeholder
  if (score === undefined || score === null) {
    return (
      <div className="flex justify-center">
        <button
          onClick={onClick}
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Ver Score
        </button>
      </div>
    );
  }

  return <ScoreBadge score={score} level={scoreLevel} onClick={onClick} />;
}
