/**
 * 🔄 Toggle Staff Status Confirmation Modal
 * Modal para confirmar a inativação ou ativação de um colaborador
 */
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/components/ui/alert-dialog";
import { Button } from "@shared/components/ui/button";
import { useToast } from "@shared/hooks";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";

interface StaffStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  staff: BarbershopStaff | null;
}

/**
 * Modal de confirmação para alternar status do colaborador
 */
export const StaffStatusModal = memo(function StaffStatusModal({
  isOpen,
  onClose,
  onConfirm,
  staff,
}: StaffStatusModalProps) {
  const { t } = useTranslation("barbershop-staff");
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!staff) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      // NÃO fechar aqui - deixar a página gerenciar isso
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      // Mostrar toast de erro
      error(
        t("toasts.errors.toggleStatusTitle", {
          defaultValue: "Erro ao alterar status",
        }),
        t("toasts.errors.toggleStatusMessage", {
          defaultValue:
            "Não foi possível alterar o status do colaborador. Tente novamente.",
        }),
      );
      // Em caso de erro, manter modal aberto
    } finally {
      setIsLoading(false);
    }
  };

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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex min-h-14 min-w-14 items-center justify-center rounded-full ${
                isActive
                  ? "bg-red-500/10 text-red-500"
                  : "bg-green-500/10 text-green-500"
              }`}
            >
              {isActive ? (
                <AlertCircle className="h-6 w-6" />
              ) : (
                <CheckCircle className="h-6 w-6" />
              )}
            </div>
            <AlertDialogTitle className="text-xl">
              {isActive
                ? t("modals.toggleStatus.deactivateTitle", {
                    defaultValue: `Deseja inativar esse colaborador?`,
                  })
                : t("modals.toggleStatus.activateTitle", {
                    defaultValue: `Deseja ativar esse colaborador?`,
                  })}
              <p className="mt-2 text-base font-normal text-neutral-400">
                {isActive
                  ? t("modals.toggleStatus.deactivateDescription", {
                      defaultValue: `O colaborador ${staffName} irá alterar de status para inativo. Você poderá ativá-lo novamente.`,
                    })
                  : t("modals.toggleStatus.activateDescription", {
                      defaultValue: `O colaborador ${staffName} irá alterar de status para ativo. Você poderá inativá-lo novamente.`,
                    })}
              </p>
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel disabled={isLoading} className="min-w-[100px]">
            {t("actions.cancel", { defaultValue: "Cancelar" })}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={` ${
              isActive
                ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800"
                : "bg-green-700 text-white hover:bg-green-700 disabled:bg-green-800"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("actions.processing", { defaultValue: "Processando..." })}
              </>
            ) : isActive ? (
              t("actions.deactivate", { defaultValue: "Inativar" })
            ) : (
              t("actions.activate", { defaultValue: "Ativar" })
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
