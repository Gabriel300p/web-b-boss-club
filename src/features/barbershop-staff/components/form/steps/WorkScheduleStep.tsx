/**
 * 📝 Work Schedule Step - Step 3: Horário de Trabalho
 * Configuração de dias e horários de trabalho do colaborador
 */
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateStaffMinimalFormData } from "../../../schemas/barbershop-staff.schemas";
import type { StaffFormMode } from "../StaffForm";

interface WorkScheduleStepProps {
  form: UseFormReturn<CreateStaffMinimalFormData>;
  mode: StaffFormMode;
  isLoading?: boolean;
}

export const WorkScheduleStep = memo(function WorkScheduleStep({
  // form,
  mode,
  // isLoading = false,
}: WorkScheduleStepProps) {
  const { t } = useTranslation("barbershop-staff");

  const isViewMode = mode === "view";

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-neutral-700 bg-neutral-800/20 p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-50">
          {t("wizard.steps.workSchedule", {
            defaultValue: "Horário de Trabalho",
          })}
        </h3>
        <p className="text-sm text-neutral-400">
          {isViewMode
            ? "Visualize os horários de trabalho do colaborador."
            : "Esta etapa ainda está em desenvolvimento. Em breve você poderá configurar os dias da semana e horários de trabalho do colaborador."}
        </p>

        {/* TODO: Adicionar campos:
          - Usar template de horário (Select)
          - Configuração manual por dia da semana
          - Horário de início e término para cada dia
          - Intervalo de almoço (opcional)
          - Disponibilidade para agendamento
        */}
      </div>
    </div>
  );
});
