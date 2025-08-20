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
  comunicacaoFormSchema,
  type Comunicacao,
  type ComunicacaoForm,
} from "../../schemas/comunicacao.schemas";

interface ModalComunicacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ComunicacaoForm) => Promise<void>;
  comunicacao?: Comunicacao | null;
  isEditing?: boolean;
}

// 🚀 Memoized modal for performance optimization
export const ModalComunicacao = memo(function ModalComunicacao({
  isOpen,
  onClose,
  onSave,
  comunicacao,
  isEditing = false,
}: ModalComunicacaoProps) {
  const { t } = useTranslation("records");
  const defaultValues = useMemo<ComunicacaoForm>(
    () => ({
      titulo: "",
      autor: "",
      tipo: "Comunicado",
      descricao: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ComunicacaoForm>({
    resolver: zodResolver(comunicacaoFormSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && comunicacao) {
        reset({
          titulo: comunicacao.titulo,
          autor: comunicacao.autor,
          tipo: comunicacao.tipo,
          descricao: comunicacao.descricao,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isEditing, comunicacao, isOpen, reset, defaultValues]);

  const onSubmit = async (data: ComunicacaoForm) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      // Only log in development or when explicitly needed
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao salvar comunicação:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("form.editTitle") : t("form.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="titulo" className="text-sm font-medium">
              {t("fields.title")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="titulo"
              type="text"
              placeholder={t("form.placeholders.title")}
              {...register("titulo")}
            />
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="autor" className="text-sm font-medium">
              {t("fields.author")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="autor"
              type="text"
              placeholder={t("form.placeholders.author")}
              {...register("autor")}
            />
            {errors.autor && (
              <p className="text-sm text-red-500">{errors.autor.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tipo" className="text-sm font-medium">
              {t("fields.type")}
              <span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("tipo")}
              onValueChange={(value) => {
                setValue("tipo", value as ComunicacaoForm["tipo"], {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("form.placeholders.type")} />
              </SelectTrigger>
              <SelectContent className="w-full">
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
              <p className="text-sm text-red-500">{errors.tipo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="descricao" className="text-sm font-medium">
              {t("fields.description")}
              <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="descricao"
              placeholder={t("form.placeholders.description")}
              {...register("descricao")}
              rows={4}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="font-medium text-slate-600"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <ProhibitIcon
                style={{ width: 20, height: 20 }}
                className="text-slate-500"
              />
              {t("form.close")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isEditing ? (
                <PencilSimpleLineIcon
                  className="text-white"
                  weight="fill"
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <PlusCircleIcon
                  className="text-white"
                  weight="fill"
                  style={{ width: 20, height: 20 }}
                />
              )}
              {isSubmitting
                ? t("form.saving")
                : isEditing
                  ? t("form.saveEdit")
                  : t("form.saveNew")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
