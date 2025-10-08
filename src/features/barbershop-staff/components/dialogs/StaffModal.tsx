/**
 * 🆕 Staff Modal - Modal unificada para criar/visualizar/editar
 * Usa StaffForm e StaffSidebar adaptativas baseado no modo
 */
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { memo, useMemo, useState } from "react";
import {
  useBarbershopStaff,
  useStaffDetail,
} from "../../hooks/useBarbershopStaff";
import { useBarbershopStaffCreate } from "../../hooks/useBarbershopStaffCreate";
import type { CreateStaffMinimalFormData } from "../../schemas/barbershop-staff.schemas";
import {
  STAFF_FORM_STEPS,
  transformFormDataToCreate,
  transformFormDataToUpdate,
} from "../form/staff-form.config";
import { StaffForm } from "../form/StaffForm";
import { StaffSidebar } from "./StaffSidebar";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  staffId?: string | null;
}

export const StaffModal = memo(function StaffModal({
  isOpen,
  onClose,
  mode,
  staffId,
}: StaffModalProps) {
  // ✅ Estado inicial de validação dinâmico baseado na config
  const initialValidationState = useMemo(() => {
    const state: Record<number, boolean> = {};
    STAFF_FORM_STEPS.forEach((step) => {
      // Steps sem campos obrigatórios iniciam como válidos
      state[step.id] = !step.hasRequiredFields;
    });
    return state;
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  const [validationState, setValidationState] = useState<
    Record<number, boolean>
  >(initialValidationState);

  // 🎯 Reset state function
  const resetModalState = () => {
    setCurrentStep(1);
    setVisitedSteps(new Set([1]));
    setValidationState(initialValidationState);
  };

  // 🎯 Hook de criação (apenas para mode="create")
  const { createStaff: createStaffFn, isLoading: isCreating } =
    useBarbershopStaffCreate({
      onSuccess: () => {
        resetModalState();
        onClose();
      },
    });

  // 🎯 Hook de atualização (apenas para mode="edit")
  const { updateStaff } = useBarbershopStaff();
  const [isUpdating, setIsUpdating] = useState(false);

  // 🎯 Buscar dados do staff (apenas para mode="view" ou "edit")
  const shouldFetchStaff = (mode === "view" || mode === "edit") && !!staffId;
  const {
    staff: staffData,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useStaffDetail(shouldFetchStaff ? staffId! : "");

  // 🎯 Handler de submit do formulário
  const handleFormSubmit = async (data: CreateStaffMinimalFormData) => {
    if (mode === "create") {
      // ✅ Criar novo staff usando transformer da config
      const createData = transformFormDataToCreate(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createStaffFn(createData as any); // TODO: Fix type mismatch between form and API
    } else if (mode === "edit" && staffId) {
      // ✅ Atualizar staff existente usando transformer da config
      setIsUpdating(true);

      try {
        const updateData = transformFormDataToUpdate(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateStaff(staffId, updateData as any); // TODO: Fix type mismatch between form and API
        onClose();
      } catch (error) {
        console.error("Error updating staff:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCancel = () => {
    resetModalState();
    onClose();
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setVisitedSteps((prev) => new Set(prev).add(step));
  };

  // 🎯 Determinar estado de loading
  const isLoading =
    mode === "create" ? isCreating : mode === "edit" ? isUpdating : false;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="h-[85vh] !max-w-[1400px] gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none md:!w-[75vw] xl:!w-[50vw]">
        <div className="flex h-full w-full overflow-hidden rounded-xl bg-neutral-950 shadow-2xl">
          {/* Sidebar - Adaptativa (Stepper ou Info) */}
          <div className="w-[300px] flex-shrink-0 border-r border-neutral-800">
            <StaffSidebar
              mode={mode}
              currentStep={currentStep}
              staffData={mode !== "create" ? staffData : null}
              isLoading={isLoadingStaff}
              onStepChange={handleStepChange}
              visitedSteps={visitedSteps}
              validationState={validationState}
            />
          </div>

          {/* Conteúdo - Formulário */}
          <div className="flex-1 overflow-hidden">
            {/* Modo Create - Formulário vazio */}
            {mode === "create" && (
              <StaffForm
                mode="create"
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                currentStep={currentStep}
                onStepChange={handleStepChange}
                onValidationChange={setValidationState}
              />
            )}

            {/* Modo View/Edit - Formulário com dados */}
            {mode !== "create" && (
              <>
                {/* Loading state */}
                {isLoadingStaff && (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#FAC82B] border-t-transparent" />
                      <p className="text-sm text-neutral-400">
                        Carregando dados...
                      </p>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {staffError && !isLoadingStaff && (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-red-400">
                        Erro ao carregar dados do colaborador
                      </p>
                    </div>
                  </div>
                )}

                {/* Form with data */}
                {staffData && !isLoadingStaff && (
                  <StaffForm
                    mode={mode}
                    initialData={staffData}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                    currentStep={currentStep}
                    onStepChange={handleStepChange}
                    onValidationChange={setValidationState}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
