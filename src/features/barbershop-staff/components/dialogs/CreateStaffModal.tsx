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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
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

  const form = useForm<CreateStaffMinimalFormData>({
    resolver: zodResolver(createStaffMinimalFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, isValid },
  } = form;

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
          <DialogTitle className="mb-2 flex items-center gap-3">
            <PlusCircleIcon className="h-5 w-5" />
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo: Nome Completo */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("modals.createStaff.fields.fullName")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "modals.createStaff.placeholders.fullName",
                      )}
                      disabled={isSubmitting || isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("modals.createStaff.fields.cpf")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("modals.createStaff.placeholders.cpf")}
                      disabled={isSubmitting || isLoading}
                      maxLength={14}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("modals.createStaff.hints.cpfFormat")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Email (Opcional) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("modals.createStaff.fields.email")}{" "}
                    <span className="text-xs text-neutral-500">
                      ({t("modals.createStaff.optional")})
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("modals.createStaff.placeholders.email")}
                      disabled={isSubmitting || isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("modals.createStaff.hints.email")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
});
