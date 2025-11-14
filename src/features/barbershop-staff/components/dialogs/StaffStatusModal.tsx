/**
 * 🔄 Toggle Staff Status Confirmation Modal
 * Modal para confirmar a inativação ou ativação de um colaborador (individual ou em massa)
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
  staff?: BarbershopStaff | null; // Individual
  count?: number; // Bulk
  isBulk?: boolean; // Flag para identificar modo bulk
  isActivating?: boolean; // Flag para identificar se está ativando (usado no modo bulk)
}

/**
 * Modal de confirmação para alternar status do colaborador (individual ou em massa)
 */
export const StaffStatusModal = memo(function StaffStatusModal({
  isOpen,
  onClose,
  onConfirm,
  staff,
  count = 1,
  isBulk = false,
  isActivating = false,
}: StaffStatusModalProps) {
  const { t } = useTranslation("barbershop-staff");
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Se não for bulk e não tiver staff, retornar null
  if (!isBulk && !staff) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      // NÃO fechar aqui - deixar a página/hook gerenciar isso
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      // Mostrar toast de erro
      error(
        t(
          isBulk
            ? "toasts.errors.bulkToggleStatusTitle"
            : "toasts.errors.toggleStatusTitle",
          {
            defaultValue: "Erro ao alterar status",
          },
        ),
        t(
          isBulk
            ? "toasts.errors.bulkToggleStatusMessage"
            : "toasts.errors.toggleStatusMessage",
          {
            defaultValue: isBulk
              ? "Não foi possível alterar o status dos colaboradores. Tente novamente."
              : "Não foi possível alterar o status do colaborador. Tente novamente.",
          },
        ),
      );
      // Em caso de erro, fechar modal (bulk) ou manter aberto (individual)
      if (isBulk) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar se está ativando ou inativando
  // No modo bulk, usar a prop isActivating
  // No modo individual, verificar se o staff está ativo (se ativo, vai inativar)
  const isActive = isBulk
    ? !isActivating
    : staff
      ? staff.status === "ACTIVE"
      : false;

  // Nome do colaborador (apenas para modo individual)
  const lastName =
    staff?.last_name && typeof staff.last_name === "string"
      ? staff.last_name
      : "";
  const staffName = staff
    ? (staff.display_name && typeof staff.display_name === "string"
        ? staff.display_name
        : null) || `${staff.first_name} ${lastName}`.trim()
    : "";

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
            <AlertDialogTitle className="text-lg">
              {isActive
                ? t(
                    isBulk
                      ? "modals.toggleStatus.inactivateTitleBulk"
                      : "modals.toggleStatus.inactivateTitle",
                    {
                      defaultValue: isBulk
                        ? `Deseja inativar os colaboradores selecionados?`
                        : `Deseja inativar esse colaborador?`,
                    },
                  )
                : t(
                    isBulk
                      ? "modals.toggleStatus.activateTitleBulk"
                      : "modals.toggleStatus.activateTitle",
                    {
                      defaultValue: isBulk
                        ? `Deseja ativar os colaboradores selecionados?`
                        : `Deseja ativar esse colaborador?`,
                    },
                  )}
              <p className="mt-2 text-sm font-normal text-neutral-400">
                {isBulk
                  ? isActive
                    ? t("modals.toggleStatus.inactivateDescriptionBulk", {
                        count,
                        defaultValue:
                          count > 1
                            ? `${count} colaboradores serão inativados. Você poderá ativá-los novamente a qualquer momento.`
                            : `${count} colaborador será inativado. Você poderá ativá-lo novamente a qualquer momento.`,
                      })
                    : t("modals.toggleStatus.activateDescriptionBulk", {
                        count,
                        defaultValue:
                          count > 1
                            ? `${count} colaboradores serão ativados. Você poderá inativá-los novamente a qualquer momento.`
                            : `${count} colaborador será ativado. Você poderá inativá-lo novamente a qualquer momento.`,
                      })
                  : isActive
                    ? t("modals.toggleStatus.inactivateDescription", {
                        defaultValue: `O colaborador ${staffName} será inativado. Você poderá ativá-lo novamente a qualquer momento.`,
                      })
                    : t("modals.toggleStatus.activateDescription", {
                        defaultValue: `O colaborador ${staffName} será ativado. Você poderá inativá-lo novamente a qualquer momento.`,
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
                ? "bg-red-700 text-white hover:bg-red-800 disabled:bg-red-800"
                : "bg-green-800 text-white hover:bg-green-800 disabled:bg-green-800/50"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("actions.processing", { defaultValue: "Processando..." })}
              </>
            ) : isActive ? (
              t("actions.inactivate", { defaultValue: "Inativar" })
            ) : (
              t("actions.activate", { defaultValue: "Ativar" })
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
