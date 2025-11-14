/**
 * 📊 ScoreCellWithModal Component
 * Wrapper da célula de score que gerencia o estado do modal
 * 🎯 Score V3: Dados de segmentação vêm do backend
 * ⚠️ Modal temporariamente desabilitado - apenas preview hover ativo
 */
// import { useState } from "react"; // Temporariamente desabilitado
// import { ScoreReportModal } from "../../../dialogs/ScoreReportModal"; // Temporariamente desabilitado
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
  // 🎯 Score V3 data (from backend)
  barbershopSize?: "SMALL" | "MEDIUM" | "LARGE" | null;
  targetAttendances?: number | null;
  daysWorking?: number | null;
  rampMultiplier?: number | null;
  isInRampPeriod?: boolean | null;
  // Optional
  variant?: "gauge";
}

export function ScoreCellWithModal({
  staffId: _staffId, // eslint-disable-line @typescript-eslint/no-unused-vars
  staffName: _staffName, // eslint-disable-line @typescript-eslint/no-unused-vars
  staffPhoto: _staffPhoto, // eslint-disable-line @typescript-eslint/no-unused-vars
  staffEmail: _staffEmail, // eslint-disable-line @typescript-eslint/no-unused-vars
  score,
  scoreLevel,
  averageRating,
  totalReviews,
  totalRevenue,
  totalAttendances,
  barbershopSize: _barbershopSize, // eslint-disable-line @typescript-eslint/no-unused-vars
  targetAttendances: _targetAttendances, // eslint-disable-line @typescript-eslint/no-unused-vars
  daysWorking: _daysWorking, // eslint-disable-line @typescript-eslint/no-unused-vars
  // rampMultiplier and isInRampPeriod are received but not used yet
  variant = "gauge",
}: ScoreCellWithModalProps) {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // V3 está ativo se há dados de porte da barbearia
  // const isV3 = !!barbershopSize;

  // Só permite abrir modal se houver score válido
  // const handleClick = () => {
  //   if (score !== null && scoreLevel !== null) {
  //     setIsModalOpen(true);
  //   }
  // };

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
        // onClick={handleClick} // Temporariamente desabilitado
      />

      {/* Modal temporariamente desabilitado - apenas preview hover ativo */}
      {/* {score !== null && scoreLevel !== null && (
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
          // 🎯 Props V3 do backend
          isV3={isV3}
          size={barbershopSize ?? undefined}
          targetAttendances={targetAttendances ?? undefined}
          daysWorking={daysWorking ?? undefined}
        />
      )} */}
    </>
  );
}
