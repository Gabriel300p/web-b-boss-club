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
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Comunicacao } from "../../schemas/comunicacao.schemas";

interface ModalDeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  comunicacao?: Comunicacao | null;
}

// 🚀 Memoized delete modal for performance optimization
export const ModalDeleteConfirm = memo(function ModalDeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
}: ModalDeleteConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("records");

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Only log in development or when explicitly needed
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao remover comunicação:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("delete.close")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? t("delete.removing") : t("delete.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
