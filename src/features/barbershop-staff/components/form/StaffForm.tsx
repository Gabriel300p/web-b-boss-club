/**
 *  Staff Form - Formulário adaptativo para criar/visualizar/editar colaborador
 * Suporta navegação por tabs (steps) no modo create
 */
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
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createStaffMinimalFormSchema,
  type BarbershopStaff,
  type CreateStaffMinimalFormData,
} from "../../schemas/barbershop-staff.schemas";
import {
  AdmissionInfoStep,
  BasicDataStep,
  UserAccessStep,
  WorkScheduleStep,
} from "./steps";
import { getTotalSteps, STAFF_FORM_STEPS } from "./staff-form.config";

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
  const currentTab = `step-${currentStep}`;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const TOTAL_STEPS = getTotalSteps();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  const getDefaultValues = (): CreateStaffMinimalFormData => {
    if (initialData && (isViewMode || isEditMode)) {
      const fullName = [initialData.first_name, initialData.last_name]
        .filter(Boolean)
        .join(" ");

      return {
        full_name: fullName,
        cpf:
          typeof initialData.user?.cpf === "string" ? initialData.user.cpf : "",
        email: initialData.user?.email || "",
        phone: typeof initialData.phone === "string" ? initialData.phone : "",
        status: initialData.status,
        description:
          typeof initialData.internal_notes === "string"
            ? initialData.internal_notes
            : "",
      };
    }

    return {
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
      status: "ACTIVE",
      description: "",
    };
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

  const handleFormSubmit = (data: CreateStaffMinimalFormData) => {
    onSubmit(data);
  };

  const handleStepChange = (step: number) => {
    if (onStepChange) {
      onStepChange(step);
    } else {
      setInternalCurrentStep(step);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleTabChange = (value: string) => {
    const step = Number.parseInt(value.split("-")[1]);
    handleStepChange(step);
  };

  const isStepValid = (step: number): boolean => {
    // 🎯 Busca configuração do step
    const stepConfig = STAFF_FORM_STEPS.find((s) => s.id === step);
    if (!stepConfig) return false;

    // Steps sem campos obrigatórios são sempre válidos
    if (!stepConfig.hasRequiredFields) return true;

    // Steps com campos obrigatórios: valida campos
    const values = form.getValues();
    const fields = stepConfig.validationFields || [];

    // Valida cada campo obrigatório
    return fields.every((field) => {
      const value = values[field as keyof CreateStaffMinimalFormData];
      
      // Caso especial: CPF só obrigatório em create mode
      if (field === 'cpf' && isEditMode) return true;
      
      // Validação genérica: campo preenchido
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      
      return !!value;
    });
  };

  const canProceed = isStepValid(currentStep);

  // 🎯 Watch individual validation fields to avoid infinite loop
  const fullName = form.watch("full_name");
  const cpf = form.watch("cpf");
  const status = form.watch("status");
  const email = form.watch("email");

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
  }, [fullName, cpf, status, email, onValidationChange, isCreateMode]);

  const getHeaderTitle = () => {
    if (!isCreateMode) {
      return mode === "view"
        ? t("wizard.modes.viewTitle", {
            defaultValue: "Visualizar Colaborador",
          })
        : t("wizard.modes.editTitle", {
            defaultValue: "Editar Colaborador",
          });
    }

    switch (currentStep) {
      case 1:
        return t("wizard.steps.basicData", {
          defaultValue: "Dados Cadastrais",
        });
      case 2:
        return t("wizard.steps.admissionInfo", {
          defaultValue: "Informações de Admissão",
        });
      case 3:
        return t("wizard.steps.workSchedule", {
          defaultValue: "Horário de Trabalho",
        });
      case 4:
        return t("wizard.steps.userAccess", {
          defaultValue: "Acesso do Usuário",
        });
      default:
        return t("wizard.steps.basicData");
    }
  };

  const HeaderIcon = isViewMode ? EyeIcon : isEditMode ? PencilIcon : null;

  const getPrimaryButtonText = () => {
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
  };

  const handlePrimaryAction = () => {
    if (isCreateMode && !isLastStep) {
      handleNextStep();
    } else {
      handleSubmit(handleFormSubmit)();
    }
  };

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
            {getHeaderTitle()}
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
                <TabsContent value="step-1" className="m-0">
                  <BasicDataStep
                    form={form}
                    mode={mode}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="step-2" className="m-0">
                  <AdmissionInfoStep
                    form={form}
                    mode={mode}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="step-3" className="m-0">
                  <WorkScheduleStep
                    form={form}
                    mode={mode}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="step-4" className="m-0">
                  <UserAccessStep
                    form={form}
                    mode={mode}
                    isLoading={isLoading}
                  />
                </TabsContent>
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
                  onClick={handlePreviousStep}
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
                      {getPrimaryButtonText()}
                    </>
                  ) : (
                    <>
                      {isCreateMode && !isLastStep ? (
                        <ArrowRightIcon className="h-4 w-4" />
                      ) : (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      {getPrimaryButtonText()}
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
