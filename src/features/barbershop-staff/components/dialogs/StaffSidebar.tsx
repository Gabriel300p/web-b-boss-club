import { cn } from "@shared/lib/utils";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";
import {
  getCompletedStepsCount,
  getProgressPercentage,
  getTotalSteps,
  SIDEBAR_HEADER_CONFIGS,
  STAFF_FORM_STEPS,
} from "../form/staff-form.config";

interface StaffSidebarProps {
  mode: "create" | "view" | "edit";
  currentStep?: number;
  staffData?: BarbershopStaff | null;
  isLoading?: boolean;
  className?: string;
  onStepChange?: (step: number) => void;
  visitedSteps?: Set<number>;
  validationState?: Record<number, boolean>;
}

/**
 * Sidebar adaptativa que muda conforme o modo
 */
export const StaffSidebar = memo(function StaffSidebar({
  mode,
  currentStep = 1,
  // staffData,
  // isLoading = false,
  className,
  onStepChange,
  visitedSteps = new Set([1]),
  validationState = {},
}: StaffSidebarProps) {
  const { t } = useTranslation("barbershop-staff");

  // ✅ Total de steps calculado dinamicamente da config
  const totalSteps = useMemo(() => getTotalSteps(), []);

  // 🎯 Configuração do header por modo (da config centralizada)
  const headerContent = useMemo(() => {
    const config = SIDEBAR_HEADER_CONFIGS[mode];
    return {
      icon: config.icon,
      title: t(config.titleKey, { defaultValue: config.titleDefault }),
      subtitle: t(config.subtitleKey, { defaultValue: config.subtitleDefault }),
    };
  }, [mode, t]);

  const HeaderIcon = headerContent.icon;

  // ✅ Steps dinâmicos da configuração com labels traduzidos
  const steps = useMemo(
    () =>
      STAFF_FORM_STEPS.map((step) => ({
        id: step.id,
        label: t(step.labelKey, { defaultValue: step.defaultLabel }),
        icon: step.icon,
        hasRequiredFields: step.hasRequiredFields,
      })),
    [t],
  );

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-neutral-950 p-5",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <HeaderIcon className="h-4 w-4 text-neutral-400" />
          <h2 className="text-base font-semibold text-neutral-50">
            {headerContent.title}
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          {headerContent.subtitle}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        {/* Lista de Etapas (Stepper) */}
        <nav className="flex-1 space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;

            // ✅ Lógica de validação visual - apenas no modo create
            const showColorValidation = mode === "create";
            const hasRequired = step.hasRequiredFields;
            const isVisited = visitedSteps.has(step.id);
            const isValid = validationState[step.id] || false;

            // Estados visuais (apenas no create):
            // Verde: (tem campos obrigatórios && válido) OU (sem campos obrigatórios && visitado)
            // Vermelho: tem campos obrigatórios && inválido && visitado
            // Cinza: não visitado
            const isGreen =
              showColorValidation &&
              (hasRequired ? isValid && isVisited : isVisited);
            const isRed =
              showColorValidation && hasRequired && !isValid && isVisited;
            const isGray = showColorValidation && !isVisited;

            const handleStepClick = () => {
              if (onStepChange) {
                onStepChange(step.id);
              }
            };

            return (
              <button
                type="button"
                key={step.id}
                onClick={handleStepClick}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200",
                  {
                    "bg-neutral-900": isActive,
                    "cursor-pointer hover:bg-neutral-900/50": !isActive,
                  },
                )}
              >
                {/* Ícone */}
                <Icon
                  className={cn("h-5 w-5 transition-colors", {
                    "text-primary": isActive,
                    "text-green-500": isGreen && !isActive,
                    "text-red-500": isRed && !isActive,
                    "text-neutral-500":
                      (isGray && !isActive) ||
                      (!showColorValidation && !isActive),
                  })}
                />
                {/* Label */}
                <span
                  className={cn("text-sm font-medium transition-colors", {
                    "text-neutral-50": isActive,
                    "text-neutral-300":
                      (isGreen && !isActive) ||
                      (!showColorValidation && !isActive),
                    "text-red-300": isRed && !isActive,
                    "text-neutral-400": isGray && !isActive,
                  })}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Progress Indicator */}
        {mode === "create" && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-300">
                {t("wizard.progress.label", { defaultValue: "Progresso" })}
              </span>
              <span className="text-neutral-400">
                {t("wizard.progress.step", {
                  current: getCompletedStepsCount(
                    validationState,
                    visitedSteps,
                  ),
                  total: totalSteps,
                  defaultValue: `${getCompletedStepsCount(validationState, visitedSteps)}/${totalSteps}`,
                })}
              </span>
            </div>
            {/* Barra de Progresso */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-[#FAC82B] to-[#f9b800] transition-all duration-300"
                style={{
                  width: `${getProgressPercentage(validationState, visitedSteps)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
