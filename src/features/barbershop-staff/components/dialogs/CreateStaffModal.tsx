/**
 * 🆕 Create Staff Modal - Multi-step Wizard
 * Modal com layout lado a lado (stepper + formulário)
 */
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { memo, useState } from "react";
import { useBarbershopStaffCreate } from "../../hooks/useBarbershopStaffCreate";
import type { CreateStaffMinimalFormData } from "../../schemas/barbershop-staff.schemas";
import { CreateStaffForm } from "../form/CreateStaffForm";
import { CreateStaffStepper } from "../form/CreateStaffStepper";

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 4;

/**
 * Modal para criar novo colaborador com wizard multi-step
 */
export const CreateStaffModal = memo(function CreateStaffModal({
  isOpen,
  onClose,
}: CreateStaffModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Hook com callback de sucesso que fecha a modal
  const { createStaff, isLoading } = useBarbershopStaffCreate({
    onSuccess: () => {
      // Fechar modal e resetar step
      setCurrentStep(1);
      onClose();
    },
  });

  // Handler de submit do formulário
  const handleFormSubmit = (data: CreateStaffMinimalFormData) => {
    // Split nome completo em first_name e last_name
    const nameParts = data.full_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || undefined;

    // Criar staff com dados transformados
    createStaff({
      first_name,
      last_name,
      cpf: data.cpf,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      status: data.status || "ACTIVE",
    });
  };

  const handleCancel = () => {
    setCurrentStep(1);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="h-[85vh] !w-[50vw] !max-w-[1400px] gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <div className="flex h-full w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
          {/* Sidebar - Navegação (Stepper) */}
          <div className="w-[280px] flex-shrink-0 border-r border-neutral-800">
            <CreateStaffStepper
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          </div>

          {/* Conteúdo - Formulário */}
          <div className="flex-1 overflow-hidden">
            <CreateStaffForm
              currentStep={currentStep}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              onNext={handleNext}
              isLoading={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
