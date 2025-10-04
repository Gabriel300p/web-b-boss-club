/**
 * 🎯 Create Staff Stepper - Navegação lateral do wizard
 * Componente de navegação com etapas do formulário
 */
import { cn } from "@shared/lib/utils";
import {
  ClipboardListIcon,
  ClockIcon,
  FileTextIcon,
  UserIcon,
} from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CreateStaffStepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * Componente de navegação lateral (Stepper)
 */
export const CreateStaffStepper = memo(function CreateStaffStepper({
  currentStep,
  totalSteps,
  className,
}: CreateStaffStepperProps) {
  const { t } = useTranslation("barbershop-staff");

  // Definição das etapas
  const steps: Step[] = [
    {
      id: 1,
      label: t("wizard.steps.basicData"),
      icon: ClipboardListIcon,
    },
    {
      id: 2,
      label: t("wizard.steps.admissionInfo"),
      icon: FileTextIcon,
    },
    {
      id: 3,
      label: t("wizard.steps.workSchedule"),
      icon: ClockIcon,
    },
    {
      id: 4,
      label: t("wizard.steps.userAccess"),
      icon: UserIcon,
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-neutral-950 p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAC82B]/10">
            <ClipboardListIcon className="h-4 w-4 text-[#FAC82B]" />
          </div>
          <h2 className="text-base font-semibold text-neutral-50">
            {t("wizard.title")}
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-neutral-400">
          {t("wizard.subtitle")}
        </p>
      </div>

      {/* Lista de Etapas */}
      <nav className="flex-1 space-y-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                {
                  "bg-neutral-900": isActive,
                  "hover:bg-neutral-900/50": !isActive,
                },
              )}
            >
              {/* Ícone */}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  {
                    "bg-[#FAC82B]/10": isActive,
                    "bg-neutral-800": !isActive && !isCompleted,
                    "bg-green-500/10": isCompleted,
                  },
                )}
              >
                <Icon
                  className={cn("h-4 w-4", {
                    "text-[#FAC82B]": isActive,
                    "text-neutral-500": !isActive && !isCompleted,
                    "text-green-500": isCompleted,
                  })}
                />
              </div>

              {/* Label */}
              <span
                className={cn("text-sm font-medium transition-colors", {
                  "text-neutral-50": isActive,
                  "text-neutral-400": !isActive && !isCompleted,
                  "text-neutral-300": isCompleted,
                })}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Progress Indicator */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-300">
            {t("wizard.progress.label")}
          </span>
          <span className="text-neutral-400">
            {t("wizard.progress.step", {
              current: currentStep,
              total: totalSteps,
            })}
          </span>
        </div>
        {/* Barra de Progresso */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-[#FAC82B] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});
