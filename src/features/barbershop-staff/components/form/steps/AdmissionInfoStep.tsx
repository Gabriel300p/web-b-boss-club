/**
 * 📝 Admission Info Step - Step 2: Informações de Admissão
 * Data de admissão, Data de demissão, Salário, Comissão
 */
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateStaffMinimalFormData } from "../../../schemas/barbershop-staff.schemas";
import type { StaffFormMode } from "../StaffForm";

interface AdmissionInfoStepProps {
  form: UseFormReturn<CreateStaffMinimalFormData>;
  mode: StaffFormMode;
  isLoading?: boolean;
}

export const AdmissionInfoStep = memo(function AdmissionInfoStep({
  // form,
  mode,
  // isLoading = false,
}: AdmissionInfoStepProps) {
  const { t } = useTranslation("barbershop-staff");

  const isViewMode = mode === "view";

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-neutral-700 bg-neutral-800/20 p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-50">
          {t("wizard.steps.admissionInfo", {
            defaultValue: "Informações de Admissão",
          })}
        </h3>
        <p className="text-sm text-neutral-400">
          {isViewMode
            ? "Visualize as informações de admissão do colaborador."
            : "Esta etapa ainda está em desenvolvimento. Em breve você poderá adicionar data de admissão, salário, comissão e outras informações profissionais."}
        </p>

        {/* TODO: Adicionar campos:
          - Data de admissão (DatePicker)
          - Data de demissão (DatePicker, opcional)
          - Salário (Input numérico com formatação BRL)
          - Taxa de comissão (Input numérico com %)
          - Avatar upload
        */}
      </div>
    </div>
  );
});
