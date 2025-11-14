import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import { Form } from "@shared/components/ui/form";
import { Tabs, TabsContent } from "@shared/components/ui/tabs";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XCircleIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createStaffFormInputSchema,
  type BarbershopStaff,
  type CreateStaffFormInput,
} from "../../schemas/barbershop-staff.schemas";

import { useStepNavigation, useStepValidation } from "@/shared/hooks";
import {
  getTotalSteps,
  STAFF_FORM_STEPS,
  transformStaffToFormData,
} from "./staff-form.config";

export type StaffFormMode = "create" | "view" | "edit";

interface StaffFormProps {
  mode: StaffFormMode;
  initialData?: BarbershopStaff | null;
  onSubmit: (data: CreateStaffFormInput) => void;
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

  const getDefaultValues = (): CreateStaffFormInput => {
    const shouldLoadData = initialData && (isViewMode || isEditMode);
    return transformStaffToFormData(
      shouldLoadData ? initialData : null,
    ) as CreateStaffFormInput;
  };

  const form = useForm<CreateStaffFormInput>({
    resolver: zodResolver(createStaffFormInputSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  const isStepValid = useStepValidation(form, mode, STAFF_FORM_STEPS);

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
    (data: CreateStaffFormInput) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  const allValidationFields = useMemo(() => {
    const fields = new Set<string>();
    STAFF_FORM_STEPS.forEach((step) => {
      step.validationFields?.forEach((field) => fields.add(field));
    });
    return Array.from(fields);
  }, []);

  const watchedValues = useWatch({
    control: form.control,
    name: allValidationFields as Array<keyof CreateStaffFormInput>,
  });

  const canProceed = isStepValid(currentStep);

  useEffect(() => {
    if (onValidationChange && isCreateMode) {
      const validationState: Record<number, boolean> = {};
      STAFF_FORM_STEPS.forEach((step) => {
        validationState[step.id] = isStepValid(step.id);
      });
      onValidationChange(validationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, onValidationChange, isCreateMode]);

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
    const step = STAFF_FORM_STEPS.find((s) => s.id === currentStep);
    if (!step) return t("wizard.steps.basicData");

    return t(step.labelKey, { defaultValue: step.defaultLabel });
  }, [isCreateMode, mode, currentStep, t]);

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
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-neutral-50 md:text-lg">
            {headerTitle}
          </h3>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
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

          <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-4 py-5 md:px-8">
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
                  <span className="hidden md:inline">
                    {t("wizard.actions.previous", { defaultValue: "Anterior" })}
                  </span>
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
                <span className="hidden md:inline">
                  {isViewMode
                    ? t("actions.close", { defaultValue: "Fechar" })
                    : t("actions.cancel")}
                </span>
              </Button>

              {!isViewMode && (
                <Button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={
                    !canProceed ||
                    isSubmitting ||
                    isLoading ||
                    (!isCreateMode && isEditMode && !isDirty)
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
