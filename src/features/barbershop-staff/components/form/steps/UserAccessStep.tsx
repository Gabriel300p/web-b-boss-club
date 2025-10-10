/**
 * 📝 User Access Step - Step 4: Acesso do Usuário
 * E-mail, senha inicial, tipo de acesso
 */
import { useToast } from "@/shared/hooks";
import { AvatarUpload } from "@shared/components/form/AvatarUpload";
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
import type { CreateStaffFormInput } from "../../../schemas/barbershop-staff.schemas";
import type { StaffFormMode } from "../StaffForm";

interface UserAccessStepProps {
  form: UseFormReturn<CreateStaffFormInput>;
  mode: StaffFormMode;
  isLoading?: boolean;
}

export const UserAccessStep = memo(function UserAccessStep({
  form,
  mode,
  isLoading = false,
}: UserAccessStepProps) {
  const { t } = useTranslation("barbershop-staff");
  const { showToast } = useToast();

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const {
    formState: { isSubmitting },
  } = form;

  /**
   * 📸 Handler para upload de avatar com sucesso
   */
  const handleAvatarUploadSuccess = (url: string) => {
    form.setValue("avatar_url", url, {
      shouldDirty: true,
      shouldValidate: true,
    });
    showToast({
      type: "success",
      title: "Foto atualizada",
      message: "A foto do colaborador foi atualizada com sucesso.",
    });
  };

  /**
   * ❌ Handler para erro no upload
   */
  const handleAvatarUploadError = (error: string) => {
    showToast({
      type: "error",
      title: "Erro no upload",
      message: error,
    });
  };

  return (
    <div className="space-y-5">
      {/* 📸 Avatar Upload */}
      <div className="flex flex-col items-center border-b border-neutral-800 pb-6">
        <AvatarUpload
          currentAvatarUrl={form.watch("avatar_url") || null}
          fullName={form.watch("full_name") || ""}
          onUploadSuccess={handleAvatarUploadSuccess}
          onUploadError={handleAvatarUploadError}
          disabled={isViewMode || isSubmitting || isLoading}
          size="lg"
        />
      </div>

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
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <div className="rounded-lg border border-neutral-700 bg-neutral-800/20 p-4">
        <h3 className="mb-2 text-sm font-semibold text-neutral-50">
          Senha inicial
        </h3>
        <p className="text-xs text-neutral-400 md:text-sm">
          {isViewMode || isEditMode
            ? "A senha foi gerada automaticamente e enviada por e-mail para o colaborador."
            : "Uma senha aleatória será gerada automaticamente e enviada por e-mail para o colaborador. O usuário poderá alterar a senha depois do primeiro acesso."}
        </p>

        {/* TODO: Futuro - Adicionar opção de definir senha manualmente */}
      </div>

      <div className="rounded-lg border border-yellow-700/30 bg-yellow-900/10 p-4">
        <p className="text-xs text-yellow-200/90 md:text-sm">
          <strong>Atenção:</strong> Certifique-se de que o e-mail está correto.
          As credenciais de acesso serão enviadas para este endereço.
        </p>
      </div>
    </div>
  );
});
