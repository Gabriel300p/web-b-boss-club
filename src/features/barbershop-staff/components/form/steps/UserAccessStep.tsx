/**
 * 📝 User Access Step - Step 4: Acesso do Usuário
 * E-mail, senha inicial, tipo de acesso
 */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { Input } from "@shared/components/ui/input";
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateStaffMinimalFormData } from "../../../schemas/barbershop-staff.schemas";
import type { StaffFormMode } from "../StaffForm";

interface UserAccessStepProps {
  form: UseFormReturn<CreateStaffMinimalFormData>;
  mode: StaffFormMode;
  isLoading?: boolean;
}

export const UserAccessStep = memo(function UserAccessStep({
  form,
  mode,
  isLoading = false,
}: UserAccessStepProps) {
  const { t } = useTranslation("barbershop-staff");

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-200">
              {t("wizard.fields.email")}
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder={t("wizard.placeholders.email")}
                disabled={isViewMode || isEditMode || isSubmitting || isLoading}
                variant="form"
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <p className="text-xs text-neutral-500">
              {t("wizard.fields.emailHelper", {
                defaultValue: "E-mail que será o acesso no login.",
              })}
            </p>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <div className="rounded-lg border border-neutral-700 bg-neutral-800/20 p-6">
        <h3 className="mb-2 text-sm font-semibold text-neutral-50">
          Senha inicial
        </h3>
        <p className="text-xs text-neutral-400">
          {isViewMode || isEditMode
            ? "A senha foi gerada automaticamente e enviada por e-mail para o colaborador."
            : "Uma senha aleatória será gerada automaticamente e enviada por e-mail para o colaborador. O usuário poderá alterar a senha depois do primeiro acesso."}
        </p>

        {/* TODO: Futuro - Adicionar opção de definir senha manualmente */}
      </div>

      <div className="rounded-lg border border-yellow-700/30 bg-yellow-900/10 p-4">
        <p className="text-xs text-yellow-200/90">
          <strong>Atenção:</strong> Certifique-se de que o e-mail está correto.
          As credenciais de acesso serão enviadas para este endereço.
        </p>
      </div>
    </div>
  );
});
