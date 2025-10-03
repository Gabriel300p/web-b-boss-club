/**
 * 🆕 Create Staff Modal - Phase 1 (MVP)
 * Formulário minimalista para adicionar colaboradores
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, ProhibitIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { maskCPF } from "@shared/utils/cpf.utils";
import { memo, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useBarbershopStaffCreate } from "../../hooks/useBarbershopStaffCreate";
import {
  createStaffMinimalFormSchema,
  type CreateStaffMinimalFormData,
} from "../../schemas/barbershop-staff.schemas";

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para criar novo colaborador (Fase 1 - Campos essenciais)
 */
export const CreateStaffModal = memo(function CreateStaffModal({
  isOpen,
  onClose,
}: CreateStaffModalProps) {
  const { t } = useTranslation("barbershop-staff");

  // Hook com callback de sucesso que fecha a modal
  const { createStaff, isLoading } = useBarbershopStaffCreate({
    onSuccess: () => {
      // Fechar modal apenas quando sucesso confirmado
      onClose();
    },
  });

  // Form setup com validação Zod
  const defaultValues = useMemo<CreateStaffMinimalFormData>(
    () => ({
      full_name: "",
      cpf: "",
      email: "",
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
  } = useForm<CreateStaffMinimalFormData>({
    resolver: zodResolver(createStaffMinimalFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const watchedCpf = watch("cpf");

  // Aplicar máscara de CPF
  useEffect(() => {
    if (watchedCpf) {
      const masked = maskCPF(watchedCpf);
      if (masked !== watchedCpf) {
        setValue("cpf", masked, { shouldValidate: true });
      }
    }
  }, [watchedCpf, setValue]);

  // Reset form quando modal abre
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset, defaultValues]);

  // Handler de submit
  const onSubmit = async (data: CreateStaffMinimalFormData) => {
    // Split nome completo em first_name e last_name
    const nameParts = data.full_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || undefined;

    // Criar staff com dados transformados
    // Nota: não fechamos a modal aqui, ela será fechada no onSuccess do mutation
    createStaff({
      first_name,
      last_name,
      cpf: data.cpf,
      email: data.email?.trim() || undefined,
      status: "ACTIVE",
    });
  };

  const modalTitle = useMemo(() => t("modals.createStaff.title"), [t]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neutral-900">
            <PlusCircleIcon className="h-5 w-5" />
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo: Nome Completo */}
          <div className="space-y-2">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-neutral-700"
            >
              {t("modals.createStaff.fields.fullName")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="full_name"
              placeholder={t("modals.createStaff.placeholders.fullName")}
              {...register("full_name")}
              className={errors.full_name ? "border-red-500" : ""}
              aria-invalid={!!errors.full_name}
              aria-describedby={
                errors.full_name ? "full_name-error" : undefined
              }
              disabled={isSubmitting || isLoading}
            />
            {errors.full_name && (
              <p
                id="full_name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Campo: CPF */}
          <div className="space-y-2">
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-neutral-700"
            >
              {t("modals.createStaff.fields.cpf")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="cpf"
              placeholder={t("modals.createStaff.placeholders.cpf")}
              {...register("cpf")}
              className={errors.cpf ? "border-red-500" : ""}
              aria-invalid={!!errors.cpf}
              aria-describedby={errors.cpf ? "cpf-error" : undefined}
              disabled={isSubmitting || isLoading}
              maxLength={14} // XXX.XXX.XXX-XX
            />
            {errors.cpf && (
              <p
                id="cpf-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.cpf.message}
              </p>
            )}
            <p className="text-xs text-neutral-500">
              {t("modals.createStaff.hints.cpfFormat")}
            </p>
          </div>

          {/* Campo: Email (Opcional) */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700"
            >
              {t("modals.createStaff.fields.email")}{" "}
              <span className="text-xs text-neutral-500">
                ({t("modals.createStaff.optional")})
              </span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t("modals.createStaff.placeholders.email")}
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting || isLoading}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
            <p className="text-xs text-neutral-500">
              {t("modals.createStaff.hints.email")}
            </p>
          </div>

          {/* Footer com botões */}
          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
            >
              <ProhibitIcon className="mr-2 h-4 w-4" />
              {t("actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || isLoading}
              className="min-w-[120px]"
            >
              {isLoading || isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("actions.creating")}
                </>
              ) : (
                <>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  {t("actions.create")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
