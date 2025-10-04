/**
 * 🆕 Create Staff Form - Formulário multi-step
 * Componente do formulário com todos os campos necessários
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
import { XCircleIcon } from "lucide-react";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createStaffMinimalFormSchema,
  type CreateStaffMinimalFormData,
} from "../../schemas/barbershop-staff.schemas";

interface CreateStaffFormProps {
  currentStep: number;
  onSubmit: (data: CreateStaffMinimalFormData) => void;
  onCancel: () => void;
  onNext?: () => void;
  isLoading?: boolean;
}

/**
 * Formulário de criação de colaborador (Passo 1: Dados Cadastrais)
 */
export const CreateStaffForm = memo(function CreateStaffForm({
  currentStep,
  onSubmit,
  onCancel,
  onNext,
  isLoading = false,
}: CreateStaffFormProps) {
  const { t } = useTranslation("barbershop-staff");

  const form = useForm<CreateStaffMinimalFormData>({
    resolver: zodResolver(createStaffMinimalFormSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      cpf: "",
      email: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, isValid },
  } = form;

  const watchedCpf = watch("cpf");
  const watchedPhone = watch("phone");

  // Aplicar máscara de CPF
  useEffect(() => {
    if (watchedCpf) {
      const masked = maskCPF(watchedCpf);
      if (masked !== watchedCpf) {
        setValue("cpf", masked, { shouldValidate: true });
      }
    }
  }, [watchedCpf, setValue]);

  // Aplicar máscara de telefone
  useEffect(() => {
    if (watchedPhone) {
      const masked = maskPhone(watchedPhone);
      if (masked !== watchedPhone) {
        setValue("phone", masked, { shouldValidate: true });
      }
    }
  }, [watchedPhone, setValue]);

  const handleFormSubmit = (data: CreateStaffMinimalFormData) => {
    if (currentStep === 1) {
      // Por enquanto, apenas passo 1 funcional
      onSubmit(data);
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-neutral-900">
      {/* Header do Card */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-neutral-50">
          {t("wizard.steps.basicData")}
        </h3>
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
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.placeholders.name")}
                      disabled={isSubmitting || isLoading}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.cpf")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.placeholders.cpf")}
                      disabled={isSubmitting || isLoading}
                      maxLength={14}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500"
                      {...field}
                    />
                  </FormControl>
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
                      disabled={isSubmitting || isLoading}
                      maxLength={15}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Campo: Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.email")}{" "}
                    <span className="text-xs text-neutral-500">
                      ({t("modals.createStaff.optional")})
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("wizard.placeholders.email")}
                      disabled={isSubmitting || isLoading}
                      variant="form"
                      className="bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500"
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
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "ACTIVE"}
                    disabled={isSubmitting || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="border-neutral-700 bg-neutral-800/50 text-neutral-50 hover:bg-neutral-800">
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

            {/* Campo: Descrição (Opcional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-200">
                    {t("wizard.fields.description")}{" "}
                    <span className="text-xs text-neutral-500">
                      ({t("modals.createStaff.optional")})
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("wizard.placeholders.description")}
                      disabled={isSubmitting || isLoading}
                      className="min-h-[100px] resize-none border-neutral-700 bg-neutral-800/50 text-neutral-50 placeholder:text-neutral-500"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-neutral-500">
                    {t("wizard.hints.description")}
                  </FormDescription>
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
              {t("actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || isLoading}
              className="h-11 min-w-[160px] bg-[#FAC82B] px-8 font-semibold text-neutral-950 hover:bg-[#FAC82B]/90"
            >
              {isLoading || isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                  {t("actions.creating")}
                </>
              ) : (
                <>{t("wizard.actions.continue")}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});
