import { zodResolver } from "@hookform/resolvers/zod";
import {
  PencilSimpleLineIcon,
  PlusCircleIcon,
  ProhibitIcon,
} from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Textarea } from "@shared/components/ui/textarea";
import { memo, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  recordFormSchema,
  type BaseRecord,
  type RecordForm,
} from "../../schemas/record.schemas";

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RecordForm) => Promise<void>;
  record?: BaseRecord | null;
  isEditing?: boolean;
}

// 🚀 Memoized modal for performance optimization
export const RecordModal = memo(function RecordModal({
  isOpen,
  onClose,
  onSave,
  record,
  isEditing = false,
}: RecordModalProps) {
  const { t } = useTranslation("records");
  const defaultValues = useMemo<RecordForm>(
    () => ({
      titulo: "",
      autor: "",
      tipo: "Comunicado",
      descricao: "",
    }),
    [],
  );

  const form = useForm<RecordForm>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = form;

  // Watch tipo to update form state
  const watchedTipo = watch("tipo");

  // Reset form when modal opens/closes or record changes
  useEffect(() => {
    if (isOpen && isEditing && record) {
      // Edit mode - populate with record data
      reset({
        titulo: record.titulo,
        autor: record.autor,
        tipo: record.tipo,
        descricao: record.descricao,
      });
    } else if (isOpen && !isEditing) {
      // Add mode - use defaults
      reset(defaultValues);
    } else if (!isOpen) {
      // Modal closed - reset to defaults
      reset(defaultValues);
    }
  }, [isOpen, isEditing, record, defaultValues, reset]);

  const onSubmit = async (data: RecordForm) => {
    try {
      await onSave(data);
      onClose();
      reset(defaultValues);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving record:", error);
      }
    }
  };

  const modalTitle = useMemo(() => {
    return isEditing ? t("actions.edit") : t("actions.new");
  }, [isEditing, t]);

  const submitButtonText = useMemo(() => {
    return isEditing ? t("actions.save") : t("actions.add");
  }, [isEditing, t]);

  const modalIcon = useMemo(() => {
    return isEditing ? (
      <PencilSimpleLineIcon className="h-5 w-5" />
    ) : (
      <PlusCircleIcon className="h-5 w-5" />
    );
  }, [isEditing]);

  const hasChanges = isEditing ? isDirty : isValid;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            {modalIcon}
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700"
            >
              {t("fields.title")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="titulo"
              placeholder={t("form.placeholders.title")}
              {...register("titulo")}
              className={errors.titulo ? "border-red-500" : ""}
              aria-invalid={!!errors.titulo}
              aria-describedby={errors.titulo ? "titulo-error" : undefined}
            />
            {errors.titulo && (
              <p
                id="titulo-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.titulo.message}
              </p>
            )}
          </div>

          {/* Author Field */}
          <div className="space-y-2">
            <label
              htmlFor="autor"
              className="block text-sm font-medium text-gray-700"
            >
              {t("fields.author")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="autor"
              placeholder={t("form.placeholders.author")}
              {...register("autor")}
              className={errors.autor ? "border-red-500" : ""}
              aria-invalid={!!errors.autor}
              aria-describedby={errors.autor ? "autor-error" : undefined}
            />
            {errors.autor && (
              <p
                id="autor-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.autor.message}
              </p>
            )}
          </div>

          {/* Type Field */}
          <div className="space-y-2">
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700"
            >
              {t("fields.type")} <span className="text-red-500">*</span>
            </label>
            <Select
              value={watchedTipo}
              onValueChange={(value) =>
                setValue("tipo", value as "Comunicado" | "Aviso" | "Notícia", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                id="tipo"
                className={errors.tipo ? "border-red-500" : ""}
                aria-invalid={!!errors.tipo}
                aria-describedby={errors.tipo ? "tipo-error" : undefined}
              >
                <SelectValue placeholder={t("form.placeholders.type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Comunicado">
                  {t("form.types.comunicado")}
                </SelectItem>
                <SelectItem value="Aviso">{t("form.types.aviso")}</SelectItem>
                <SelectItem value="Notícia">
                  {t("form.types.noticia")}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p
                id="tipo-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.tipo.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700"
            >
              {t("fields.description")} <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="descricao"
              placeholder={t("form.placeholders.description")}
              rows={3}
              {...register("descricao")}
              className={errors.descricao ? "border-red-500" : ""}
              aria-invalid={!!errors.descricao}
              aria-describedby={
                errors.descricao ? "descricao-error" : undefined
              }
            />
            {errors.descricao && (
              <p
                id="descricao-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.descricao.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex items-center gap-1.5"
            >
              <ProhibitIcon className="h-4 w-4" />
              {t("actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges || isSubmitting}
              className="flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("actions.saving")}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <PencilSimpleLineIcon className="h-4 w-4" />
                  ) : (
                    <PlusCircleIcon className="h-4 w-4" />
                  )}
                  {submitButtonText}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
