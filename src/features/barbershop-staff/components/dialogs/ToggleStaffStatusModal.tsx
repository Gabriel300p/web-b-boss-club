/**
 * 🔄 Toggle Staff Status Confirmation Modal
 * Modal para confirmar a inativação ou ativação de um colaborador
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/components/ui/alert-dialog";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";

interface ToggleStaffStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staff: BarbershopStaff | null;
  isLoading?: boolean;
}

/**
 * Modal de confirmação para alternar status do colaborador
 */
export const ToggleStaffStatusModal = memo(function ToggleStaffStatusModal({
  isOpen,
  onClose,
  onConfirm,
  staff,
  isLoading = false,
}: ToggleStaffStatusModalProps) {
  const { t } = useTranslation("barbershop-staff");

  if (!staff) return null;

  const isActive = staff.status === "ACTIVE";
  const lastName =
    staff.last_name && typeof staff.last_name === "string"
      ? staff.last_name
      : "";
  const staffName =
    (staff.display_name && typeof staff.display_name === "string"
      ? staff.display_name
      : null) || `${staff.first_name} ${lastName}`.trim();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive
              ? t("modals.toggleStatus.deactivateTitle", {
                  defaultValue: "Deseja inativar esse colaborador?",
                })
              : t("modals.toggleStatus.activateTitle", {
                  defaultValue: "Deseja ativar esse colaborador?",
                })}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {isActive
                ? t("modals.toggleStatus.deactivateDescription", {
                    defaultValue:
                      "Este colaborador irá alterar de status para inativo. Você poderá ativá-lo novamente, se necessário.",
                  })
                : t("modals.toggleStatus.activateDescription", {
                    defaultValue:
                      "Este colaborador irá alterar de status para ativo e poderá voltar a trabalhar normalmente.",
                  })}
            </p>
            <p className="font-semibold text-neutral-200">
              {t("modals.toggleStatus.staffName", {
                defaultValue: "Colaborador:",
              })}{" "}
              {staffName}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("actions.cancel", { defaultValue: "Fechar" })}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isActive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }
          >
            {isLoading
              ? t("actions.processing", { defaultValue: "Processando..." })
              : isActive
                ? t("actions.deactivate", { defaultValue: "Inativar" })
                : t("actions.activate", { defaultValue: "Ativar" })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
