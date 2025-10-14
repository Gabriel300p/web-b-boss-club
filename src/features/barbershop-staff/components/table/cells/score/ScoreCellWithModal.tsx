/**
 * 📊 ScoreCellWithModal Component
 * Wrapper da célula de score que gerencia o estado do modal
 */
import { useState } from "react";
import { ScoreReportModal } from "../../../dialogs/ScoreReportModal";
import type { ScoreLevel } from "./ScoreCell";
import { ScoreCell } from "./ScoreCell";

interface ScoreCellWithModalProps {
  // Staff data
  staffId: string;
  staffName: string;
  staffPhoto?: string | null;
  staffEmail: string;
  // Score data (pode ser null quando dados insuficientes)
  score: number | null;
  scoreLevel: ScoreLevel | null;
  averageRating: number | null;
  totalReviews: number;
  totalRevenue: number;
  totalAttendances: number;
  // Optional
  variant?: "gauge";
}

export function ScoreCellWithModal({
  staffId,
  staffName,
  staffPhoto,
  staffEmail,
  score,
  scoreLevel,
  averageRating,
  totalReviews,
  totalRevenue,
  totalAttendances,
  variant = "gauge",
}: ScoreCellWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Só permite abrir modal se houver score válido
  const handleClick = () => {
    if (score !== null && scoreLevel !== null) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <ScoreCell
        score={score ?? undefined}
        scoreLevel={scoreLevel ?? undefined}
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalRevenue={totalRevenue}
        totalAttendances={totalAttendances}
        variant={variant}
        onClick={handleClick}
      />

      {/* Só renderiza modal se houver dados válidos */}
      {score !== null && scoreLevel !== null && (
        <ScoreReportModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          staffId={staffId}
          staffName={staffName}
          staffPhoto={staffPhoto}
          staffEmail={staffEmail}
          score={score}
          level={scoreLevel}
          averageRating={averageRating}
          totalReviews={totalReviews}
          totalRevenue={totalRevenue}
          totalAttendances={totalAttendances}
        />
      )}
    </>
  );
}
