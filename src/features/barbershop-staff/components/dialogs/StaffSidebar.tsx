import { cn } from "@shared/lib/utils";
import {
  ClipboardListIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  PencilIcon,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StaffSidebarProps {
  mode: "create" | "view" | "edit";
  currentStep?: number;
  totalSteps?: number;
  staffData?: BarbershopStaff | null;
  isLoading?: boolean;
  className?: string;
  onStepChange?: (step: number) => void;
}

/**
 * Sidebar adaptativa que muda conforme o modo
 */
export const StaffSidebar = memo(function StaffSidebar({
  mode,
  currentStep = 1,
  totalSteps = 4,
  // staffData,
  // isLoading = false,
  className,
  onStepChange,
}: StaffSidebarProps) {
  const { t } = useTranslation("barbershop-staff");

  // 🎯 Definir conteúdo do header baseado no modo
  const getHeaderContent = () => {
    switch (mode) {
      case "create":
        return {
          icon: PlusCircleIcon,
          title: t("wizard.title", { defaultValue: "Adicionar novo barbeiro" }),
          subtitle: t("wizard.subtitle", {
            defaultValue: "Preencha os dados do novo colaborador",
          }),
        };
      case "view":
        return {
          icon: EyeIcon,
          title: t("modals.staffModal.viewTitle", {
            defaultValue: "Visualizar Colaborador",
          }),
          subtitle: t("modals.staffModal.viewSubtitle", {
            defaultValue: "Informações detalhadas do colaborador",
          }),
        };
      case "edit":
        return {
          icon: PencilIcon,
          title: t("modals.staffModal.editTitle", {
            defaultValue: "Editar Colaborador",
          }),
          subtitle: t("modals.staffModal.editSubtitle", {
            defaultValue: "Atualize as informações do colaborador",
          }),
        };
    }
  };

  const headerContent = getHeaderContent();
  const HeaderIcon = headerContent.icon;

  // 🎯 Steps para o modo create
  const steps: Step[] = [
    {
      id: 1,
      label: t("wizard.steps.basicData", { defaultValue: "Dados Básicos" }),
      icon: ClipboardListIcon,
    },
    {
      id: 2,
      label: t("wizard.steps.admissionInfo", {
        defaultValue: "Informações de Admissão",
      }),
      icon: FileTextIcon,
    },
    {
      id: 3,
      label: t("wizard.steps.workSchedule", {
        defaultValue: "Horário de Trabalho",
      }),
      icon: ClockIcon,
    },
    {
      id: 4,
      label: t("wizard.steps.userAccess", {
        defaultValue: "Acesso do Usuário",
      }),
      icon: UserIcon,
    },
  ];

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
            const isCompleted = step.id < currentStep;

            const handleStepClick = () => {
              if (mode === "create" && onStepChange) {
                onStepChange(step.id);
              }
            };

            return (
              <button
                type="button"
                key={step.id}
                onClick={handleStepClick}
                disabled={mode !== "create"}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200",
                  {
                    "bg-neutral-900": isActive,
                    "cursor-pointer hover:bg-neutral-900/50":
                      !isActive && mode === "create",
                    "cursor-not-allowed opacity-50": mode !== "create",
                  },
                )}
              >
                {/* Ícone */}
                <Icon
                  className={cn("h-5 w-5", {
                    "text-primary": isActive,
                    "text-neutral-500": !isActive && !isCompleted,
                    "text-green-500": isCompleted,
                  })}
                />
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
                  current: currentStep,
                  total: totalSteps,
                  defaultValue: `${currentStep}/${totalSteps}`,
                })}
              </span>
            </div>
            {/* Barra de Progresso */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-[#FAC82B] to-[#f9b800] transition-all duration-300"
                style={{
                  width: `${(currentStep / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
