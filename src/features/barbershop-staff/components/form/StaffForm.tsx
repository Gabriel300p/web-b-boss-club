/**
 * 🆕 Staff Form - Formulário unificado para criar/visualizar/editar
 * Componente genérico que funciona em 3 modos diferentes
 */
import { maskPhone } from "@/shared/utils/phone.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Textarea } from "@shared/components/ui/textarea";
import { maskCPF } from "@shared/utils/cpf.utils";
import { CheckIcon, EyeIcon, PencilIcon, XCircleIcon } from "lucide-react";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createStaffMinimalFormSchema,
  type BarbershopStaff,
  type CreateStaffMinimalFormData,
} from "../../schemas/barbershop-staff.schemas";

// 🎯 Tipos de modo do formulário
export type StaffFormMode = "create" | "view" | "edit";

interface StaffFormProps {
  mode: StaffFormMode;
  initialData?: BarbershopStaff | null;
  onSubmit: (data: CreateStaffMinimalFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Formulário unificado para Staff (create/view/edit)
 */
export const StaffForm = memo(function StaffForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: StaffFormProps) {
  const { t } = useTranslation("barbershop-staff");

  // 🎯 Determinar comportamento baseado no modo
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  // 🎯 Preparar dados iniciais baseado no modo
  const getDefaultValues = (): CreateStaffMinimalFormData => {
    if (initialData && (isViewMode || isEditMode)) {
      // Combinar first_name e last_name em full_name
      const fullName = [initialData.first_name, initialData.last_name]
        .filter(Boolean)
        .join(" ");

      return {
        full_name: fullName,
        cpf:
          typeof initialData.user?.cpf === "string" ? initialData.user.cpf : "", // CPF virá do user
        email: initialData.user?.email || "",
        phone: typeof initialData.phone === "string" ? initialData.phone : "",
        status: initialData.status,
        description:
          typeof initialData.internal_notes === "string"
            ? initialData.internal_notes
            : "",
      };
    }

    // Valores padrão para modo create
    return {
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
      status: "ACTIVE",
      description: "",
    };
  };

  const form = useForm<CreateStaffMinimalFormData>({
    resolver: zodResolver(createStaffMinimalFormSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  const watchedCpf = watch("cpf");
  const watchedPhone = watch("phone");

  // Aplicar máscara de CPF (apenas no modo create)
  useEffect(() => {
    if (watchedCpf && isCreateMode) {
      const masked = maskCPF(watchedCpf);
      if (masked !== watchedCpf) {
        setValue("cpf", masked, { shouldValidate: true });
      }
    }
  }, [watchedCpf, setValue, isCreateMode]);

  // Aplicar máscara de telefone
  useEffect(() => {
    if (watchedPhone && !isViewMode) {
      const masked = maskPhone(watchedPhone);
      if (masked !== watchedPhone) {
        setValue("phone", masked, { shouldValidate: true });
      }
    }
  }, [watchedPhone, setValue, isViewMode]);

  const handleFormSubmit = (data: CreateStaffMinimalFormData) => {
    onSubmit(data);
  };

  // 🎯 Determinar título do header baseado no modo
  const getHeaderTitle = () => {
    switch (mode) {
      case "create":
        return t("wizard.steps.basicData");
      case "view":
        return t("wizard.modes.viewTitle", {
          defaultValue: "Visualizar Colaborador",
        });
      case "edit":
        return t("wizard.modes.editTitle", {
          defaultValue: "Editar Colaborador",
        });
    }
  };

  // 🎯 Determinar ícone do header
  const HeaderIcon = isViewMode ? EyeIcon : isEditMode ? PencilIcon : null;

  // 🎯 Determinar texto do botão submit
  const getSubmitButtonText = () => {
    if (isLoading || isSubmitting) {
      return isCreateMode
        ? t("actions.creating")
        : t("actions.saving", { defaultValue: "Salvando..." });
    }
    return isCreateMode
      ? t("wizard.actions.continue")
      : t("actions.save", { defaultValue: "Salvar alterações" });
  };

  return (
    <div className="flex h-full w-full flex-col bg-neutral-900">
      {/* Header do Card */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center gap-3">
          {HeaderIcon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAC82B]/10">
              <HeaderIcon className="h-5 w-5 text-[#FAC82B]" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-neutral-50">
            {getHeaderTitle()}
          </h3>
        </div>
      </div>

      {/* Conteúdo do Formulário */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Campos do Formulário */}
          <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
            {/* Campo: Nome */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.name")}{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.placeholders.name")}
                      disabled={isViewMode || isSubmitting || isLoading}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: CPF (disabled em view/edit, editável em create) */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.cpf")}{" "}
                    {isCreateMode && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.placeholders.cpf")}
                      disabled={
                        isViewMode || isEditMode || isSubmitting || isLoading
                      }
                      maxLength={14}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                      {...field}
                    />
                  </FormControl>
                  {isEditMode && (
                    <FormDescription className="text-neutral-500">
                      {t("wizard.hints.cpfNotEditable", {
                        defaultValue: "CPF não pode ser alterado",
                      })}
                    </FormDescription>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: Email (não editável em edit mode) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.email")}{" "}
                    {isCreateMode && (
                      <span className="text-xs text-neutral-500">
                        ({t("modals.createStaff.optional")})
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("wizard.placeholders.email")}
                      disabled={
                        isViewMode || isEditMode || isSubmitting || isLoading
                      }
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  {isEditMode && (
                    <FormDescription className="text-neutral-500">
                      {t("wizard.hints.emailNotEditable", {
                        defaultValue: "Email não pode ser alterado",
                      })}
                    </FormDescription>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.phone")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.placeholders.phone")}
                      disabled={isViewMode || isSubmitting || isLoading}
                      maxLength={15}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.status")}{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "ACTIVE"}
                    disabled={isViewMode || isSubmitting || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="border-neutral-700 bg-neutral-800/50 text-neutral-50 hover:bg-neutral-800 disabled:opacity-60">
                        <SelectValue
                          placeholder={t("wizard.placeholders.status")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-neutral-700 bg-neutral-800">
                      <SelectItem value="ACTIVE" className="text-neutral-50">
                        {t("status.active")}
                      </SelectItem>
                      <SelectItem value="INACTIVE" className="text-neutral-50">
                        {t("status.inactive")}
                      </SelectItem>
                      <SelectItem value="SUSPENDED" className="text-neutral-50">
                        {t("status.suspended")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: Descrição/Notas Internas (Opcional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {isCreateMode
                      ? t("wizard.fields.description")
                      : t("wizard.fields.internalNotes", {
                          defaultValue: "Notas Internas",
                        })}{" "}
                    {isCreateMode && (
                      <span className="text-xs text-neutral-500">
                        ({t("modals.createStaff.optional")})
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isCreateMode
                          ? t("wizard.placeholders.description")
                          : t("wizard.placeholders.internalNotes", {
                              defaultValue: "Adicione observações internas...",
                            })
                      }
                      disabled={isViewMode || isSubmitting || isLoading}
                      className="min-h-[100px] resize-none border-neutral-700 bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  {isCreateMode && (
                    <FormDescription className="text-neutral-500">
                      {t("wizard.hints.description")}
                    </FormDescription>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Footer com Botões */}
          <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-8 py-5">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="h-11 px-6 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50"
            >
              <XCircleIcon className="mr-2 h-4 w-4" />
              {isViewMode
                ? t("actions.close", { defaultValue: "Fechar" })
                : t("actions.cancel")}
            </Button>

            {/* Botão Submit - Não mostrar no modo view */}
            {!isViewMode && (
              <Button
                type="submit"
                disabled={
                  !isValid ||
                  isSubmitting ||
                  isLoading ||
                  (isEditMode && !isDirty)
                }
                className="h-11 min-w-[160px] bg-[#FAC82B] px-8 font-semibold text-neutral-950 hover:bg-[#FAC82B]/90 disabled:opacity-50"
              >
                {isLoading || isSubmitting ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                    {isCreateMode
                      ? t("actions.creating")
                      : t("actions.saving", { defaultValue: "Salvando..." })}
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    {getSubmitButtonText()}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
});
