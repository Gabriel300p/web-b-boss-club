/**
 * 📝 Basic Data Step 1: Dados Cadastrais
 * Nome, CPF, Telefone, Status, Descrição
 */
import {
  FormControl,
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
import {
  createFormattedOnChange,
  inputFormatters,
} from "@shared/utils/input-formatters";
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateStaffFormInput } from "../../../schemas/barbershop-staff.schemas";
import type { StaffFormMode } from "../StaffForm";

interface BasicDataStepProps {
  form: UseFormReturn<CreateStaffFormInput>;
  mode: StaffFormMode;
  isLoading?: boolean;
}

export const BasicDataStep = memo(function BasicDataStep({
  form,
  mode,
  isLoading = false,
}: BasicDataStepProps) {
  const { t } = useTranslation("barbershop-staff");

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const {
    formState: { isSubmitting },
  } = form;

  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-200">
              {t("wizard.fields.name")}
              {!isViewMode && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("wizard.placeholders.name")}
                disabled={isViewMode || isSubmitting || isLoading}
                variant="form"
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

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
                disabled={isViewMode || isEditMode || isSubmitting || isLoading}
                maxLength={14}
                variant="form"
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                onChange={createFormattedOnChange(
                  field.onChange,
                  inputFormatters.cpf,
                )}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

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
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                value={field.value || ""}
                onChange={createFormattedOnChange(
                  field.onChange,
                  inputFormatters.phone,
                )}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

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
                  <SelectValue placeholder={t("wizard.placeholders.status")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border-neutral-700 bg-neutral-900">
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

      <FormField
        control={form.control}
        name="internal_notes"
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
                className="min-h-[100px] resize-none border-neutral-700/80 bg-neutral-800/20 text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
});
