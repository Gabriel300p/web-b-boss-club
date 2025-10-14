/**
 * 📝 Admission Info Step - Step 2: Informações de Admissão
 * Status, Data de admissão, Data de demissão, Salário, Comissão, Unidades
 */
import {
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
import { getTodayFormatted } from "@shared/utils/date.utils";
import {
  createFormattedOnChange,
  inputFormatters,
} from "@shared/utils/input-formatters";
import { memo, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateStaffFormInput } from "../../../schemas/barbershop-staff.schemas";
import { MultiSelectUnits } from "../fields/MultiSelectUnits";
import type { StaffFormMode } from "../StaffForm";

interface AdmissionInfoStepProps {
  form: UseFormReturn<CreateStaffFormInput>;
  mode: StaffFormMode;
  isLoading?: boolean;
}

export const AdmissionInfoStep = memo(function AdmissionInfoStep({
  form,
  mode,
  isLoading = false,
}: AdmissionInfoStepProps) {
  const { t } = useTranslation("barbershop-staff");

  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Define data de admissão como hoje por padrão no modo create
  useEffect(() => {
    if (isCreateMode && !watch("hire_date")) {
      setValue("hire_date", getTodayFormatted());
    }
  }, [isCreateMode, watch, setValue]);

  return (
    <div className="space-y-5">
      {/* Status */}
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
                <SelectItem value="TERMINATED" className="text-neutral-50">
                  {t("status.terminated")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      {/* 🏢 Unidades - Multi-select */}
      <FormField
        control={form.control}
        name="unit_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-200">
              {t("wizard.fields.units")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <MultiSelectUnits
                value={field.value || []}
                onChange={field.onChange}
                disabled={isViewMode || isSubmitting || isLoading}
                placeholder={t("wizard.placeholders.units")}
              />
            </FormControl>
            <FormDescription className="mt-1 text-xs text-neutral-500">
              {t("wizard.descriptions.primaryUnitAuto", {
                defaultValue:
                  "A primeira unidade selecionada será definida como principal",
              })}
            </FormDescription>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      {/* Data de admissão */}
      <FormField
        control={form.control}
        name="hire_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-200">
              {t("wizard.fields.hireDate")}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("wizard.placeholders.hireDate")}
                disabled={isViewMode || isSubmitting || isLoading}
                maxLength={10}
                variant="form"
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                value={field.value || ""}
                onChange={createFormattedOnChange(
                  field.onChange,
                  inputFormatters.date,
                )}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      {/* Salário */}
      <FormField
        control={form.control}
        name="salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-200">
              {t("wizard.fields.salary")}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("wizard.placeholders.salary")}
                disabled={isViewMode || isSubmitting || isLoading}
                variant="form"
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                value={field.value || ""}
                onChange={createFormattedOnChange(
                  field.onChange,
                  inputFormatters.currency,
                )}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      {/* Comissão */}
      <FormField
        control={form.control}
        name="commission_rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-neutral-200">
              {t("wizard.fields.commission")}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("wizard.placeholders.commission")}
                disabled={isViewMode || isSubmitting || isLoading}
                variant="form"
                className="text-neutral-50 placeholder:text-neutral-500 disabled:opacity-60"
                {...field}
                value={field.value || ""}
                onChange={createFormattedOnChange(
                  field.onChange,
                  inputFormatters.percentage,
                )}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
});
