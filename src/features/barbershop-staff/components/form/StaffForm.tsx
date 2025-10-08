import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import { Form } from "@shared/components/ui/form";
import { Tabs, TabsContent } from "@shared/components/ui/tabs";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  PencilIcon,
  XCircleIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createStaffMinimalFormSchema,
  type BarbershopStaff,
  type CreateStaffMinimalFormData,
} from "../../schemas/barbershop-staff.schemas";

import { useStepNavigation, useStepValidation } from "@/shared/hooks";
import {
  getTotalSteps,
  STAFF_FORM_STEPS,
  transformStaffToFormData,
} from "./staff-form.config";
import { BasicDataStep } from "./steps/_index";

//  Tipos de modo do formulário
export type StaffFormMode = "create" | "view" | "edit";

interface StaffFormProps {
  mode: StaffFormMode;
  initialData?: BarbershopStaff | null;
  onSubmit: (data: CreateStaffMinimalFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onValidationChange?: (validationState: Record<number, boolean>) => void;
}

export const StaffForm = memo(function StaffForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  currentStep: externalCurrentStep,
  onStepChange,
  onValidationChange,
}: StaffFormProps) {
  const { t } = useTranslation("barbershop-staff");
  const [internalCurrentStep, setInternalCurrentStep] = useState<number>(1);

  const currentStep = externalCurrentStep ?? internalCurrentStep;

  const isViewMode = useMemo(() => mode === "view", [mode]);
  const isEditMode = useMemo(() => mode === "edit", [mode]);
  const isCreateMode = useMemo(() => mode === "create", [mode]);

  const TOTAL_STEPS = useMemo(() => getTotalSteps(), []);

  // ✅ Usa transformer da config para converter dados da API → Form
  const getDefaultValues = (): CreateStaffMinimalFormData => {
    const shouldLoadData = initialData && (isViewMode || isEditMode);
    return transformStaffToFormData(
      shouldLoadData ? initialData : null,
    ) as CreateStaffMinimalFormData;
  };

  const form = useForm<CreateStaffMinimalFormData>({
    resolver: zodResolver(createStaffMinimalFormSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  // ✅ Hook de validação de steps
  const isStepValid = useStepValidation(form, mode, STAFF_FORM_STEPS);

  // ✅ Hook de navegação entre steps
  const handleStepChange = useCallback(
    (step: number) => {
      if (onStepChange) {
        onStepChange(step);
      } else {
        setInternalCurrentStep(step);
      }
    },
    [onStepChange],
  );

  const { goToNext, goToPrevious, goToStep, isFirstStep, isLastStep } =
    useStepNavigation({
      currentStep,
      totalSteps: TOTAL_STEPS,
      onStepChange: handleStepChange,
    });

  const handleTabChange = useCallback(
    (value: string) => {
      const step = Number.parseInt(value.split("-")[1]);
      goToStep(step);
    },
    [goToStep],
  );

  const handleFormSubmit = useCallback(
    (data: CreateStaffMinimalFormData) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  // ✅ Coleta todos os campos de validação de TODOS os steps dinamicamente
  const allValidationFields = useMemo(() => {
    const fields = new Set<string>();
    STAFF_FORM_STEPS.forEach((step) => {
      step.validationFields?.forEach((field) => fields.add(field));
    });
    return Array.from(fields);
  }, []);

  // ✅ useWatch otimizado para observar múltiplos campos sem infinite loop
  const watchedValues = useWatch({
    control: form.control,
    name: allValidationFields as Array<keyof CreateStaffMinimalFormData>,
  });

  // ✅ Validação do step atual (recalcula quando qualquer campo muda)
  const canProceed = isStepValid(currentStep);

  // 🎯 Emitir validação em tempo real para o Modal/Sidebar
  useEffect(() => {
    if (onValidationChange && isCreateMode) {
      // Gera validationState dinamicamente para todos os steps
      const validationState: Record<number, boolean> = {};
      STAFF_FORM_STEPS.forEach((step) => {
        validationState[step.id] = isStepValid(step.id);
      });
      onValidationChange(validationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, onValidationChange, isCreateMode]);

  // ✅ Título dinâmico baseado na configuração
  const headerTitle = useMemo(() => {
    if (!isCreateMode) {
      return mode === "view"
        ? t("wizard.modes.viewTitle", {
            defaultValue: "Visualizar Colaborador",
          })
        : t("wizard.modes.editTitle", {
            defaultValue: "Editar Colaborador",
          });
    }

    // 🎯 Busca título do step na configuração
    const step = STAFF_FORM_STEPS.find((s) => s.id === currentStep);
    if (!step) return t("wizard.steps.basicData");

    return t(step.labelKey, { defaultValue: step.defaultLabel });
  }, [isCreateMode, mode, currentStep, t]);

  // ✅ Ícone dinâmico baseado no modo
  const HeaderIcon = useMemo(
    () => (isViewMode ? EyeIcon : isEditMode ? PencilIcon : null),
    [isViewMode, isEditMode],
  );

  const primaryButtonText = useMemo(() => {
    if (isLoading || isSubmitting) {
      return isCreateMode
        ? t("actions.creating", { defaultValue: "Criando..." })
        : t("actions.saving", { defaultValue: "Salvando..." });
    }

    if (!isCreateMode) {
      return t("actions.save", { defaultValue: "Salvar alterações" });
    }

    return isLastStep
      ? t("wizard.actions.finish", { defaultValue: "Finalizar" })
      : t("wizard.actions.continue", { defaultValue: "Continuar" });
  }, [isLoading, isSubmitting, isCreateMode, isLastStep, t]);

  const handlePrimaryAction = useCallback(() => {
    if (isCreateMode && !isLastStep) {
      goToNext();
    } else {
      handleSubmit(handleFormSubmit)();
    }
  }, [isCreateMode, isLastStep, goToNext, handleSubmit, handleFormSubmit]);

  const currentTab = useMemo(() => `step-${currentStep}`, [currentStep]);

  return (
    <div className="flex h-full w-full flex-col bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center gap-3">
          {HeaderIcon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAC82B]/10">
              <HeaderIcon className="h-5 w-5 text-[#FAC82B]" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-neutral-50">
            {headerTitle}
          </h3>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {isCreateMode ? (
            <Tabs
              value={currentTab}
              onValueChange={handleTabChange}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {/* ✅ Renderização 100% dinâmica dos steps */}
                {STAFF_FORM_STEPS.map((step) => {
                  const StepComponent = step.component;
                  return (
                    <TabsContent
                      key={step.id}
                      value={`step-${step.id}`}
                      className="m-0"
                    >
                      <StepComponent
                        form={form}
                        mode={mode}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                  );
                })}
              </div>
            </Tabs>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <BasicDataStep form={form} mode={mode} isLoading={isLoading} />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-8 py-5">
            <div>
              {isCreateMode && !isFirstStep && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goToPrevious}
                  disabled={isSubmitting || isLoading}
                  className="text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  {t("wizard.actions.previous", { defaultValue: "Anterior" })}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                className="text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50"
              >
                <XCircleIcon className="h-4 w-4" />
                {isViewMode
                  ? t("actions.close", { defaultValue: "Fechar" })
                  : t("actions.cancel")}
              </Button>

              {!isViewMode && (
                <Button
                  type={isCreateMode && !isLastStep ? "button" : "submit"}
                  onClick={
                    isCreateMode && !isLastStep
                      ? handlePrimaryAction
                      : undefined
                  }
                  disabled={
                    !canProceed ||
                    isSubmitting ||
                    isLoading ||
                    (!isCreateMode && isEditMode && !isDirty) ||
                    (isCreateMode && isLastStep && !isValid)
                  }
                  className="bg-primary hover:bg-primary/90 font-semibold text-neutral-950 disabled:opacity-50"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                      {primaryButtonText}
                    </>
                  ) : (
                    <>
                      {isCreateMode && !isLastStep ? (
                        <ArrowRightIcon className="h-4 w-4" />
                      ) : (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      {primaryButtonText}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
});
