import { ProhibitIcon, XCircleIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BaseRecord } from "../../schemas/record.schemas";

interface RecordDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  record?: BaseRecord | null;
}

export const RecordDeleteModal = memo(function RecordDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  record,
}: RecordDeleteModalProps) {
  const { t } = useTranslation("records");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting record:", error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircleIcon className="h-5 w-5" />
            {t("actions.delete")}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {t("delete.confirmation", { title: record.titulo })}
            <br />
            <span className="mt-2 block text-sm text-neutral-500">
              {t("delete.warning")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-neutral-700">
                {t("fields.title")}:
              </span>{" "}
              <span className="text-neutral-900">{record.titulo}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-neutral-700">
                {t("fields.author")}:
              </span>{" "}
              <span className="text-neutral-900">{record.autor}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-neutral-700">
                {t("fields.type")}:
              </span>{" "}
              <span className="text-neutral-900">{record.tipo}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex items-center gap-1.5"
          >
            <ProhibitIcon className="h-4 w-4" />
            {t("actions.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t("actions.deleting")}
              </>
            ) : (
              <>
                <XCircleIcon className="h-4 w-4" />
                {t("actions.delete")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
