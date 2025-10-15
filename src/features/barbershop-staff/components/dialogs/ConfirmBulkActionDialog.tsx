/**
 * 🔄 Bulk Action Confirmation Dialog
 * Modal reutilizável para confirmação de ações em massa
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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { memo } from "react";

export type BulkActionType = "activate" | "inactivate";

interface ConfirmBulkActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: BulkActionType;
  count: number;
  isLoading?: boolean;
}

const ACTION_CONFIG = {
  activate: {
    title: "Ativar colaboradores selecionados?",
    description: (count: number) =>
      `${count} colaborador${count > 1 ? "es" : ""} será${count > 1 ? "ão" : ""} ativado${count > 1 ? "s" : ""}. Você poderá inativá-lo${count > 1 ? "s" : ""} novamente.`,
    confirmText: "Ativar",
    icon: CheckCircle,
    colorClass: "bg-green-500/10 text-green-500",
    buttonVariant: "default" as const,
  },
  inactivate: {
    title: "Inativar colaboradores selecionados?",
    description: (count: number) =>
      `${count} colaborador${count > 1 ? "es" : ""} será${count > 1 ? "ão" : ""} inativado${count > 1 ? "s" : ""}. Você poderá ativá-lo${count > 1 ? "s" : ""} novamente.`,
    confirmText: "Inativar",
    icon: AlertCircle,
    colorClass: "bg-red-500/10 text-red-500",
    buttonVariant: "destructive" as const,
  },
};

/**
 * Modal de confirmação para ações em massa
 */
export const ConfirmBulkActionDialog = memo(function ConfirmBulkActionDialog({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  count,
  isLoading = false,
}: ConfirmBulkActionDialogProps) {
  const config = ACTION_CONFIG[actionType];
  const Icon = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex min-h-14 min-w-14 items-center justify-center rounded-full ${config.colorClass}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl">
              {config.title}
              <p className="mt-2 text-base font-normal text-neutral-400">
                {config.description(count)}
              </p>
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel disabled={isLoading} className="min-w-[100px]">
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={config.buttonVariant}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              config.confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
