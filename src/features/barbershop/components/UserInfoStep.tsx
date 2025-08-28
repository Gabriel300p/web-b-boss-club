import { Checkbox } from "@shared/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { UserInfoFormData } from "../schemas/barbershop.schema";

interface UserInfoStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function UserInfoStep({
  onPrevious,
  onSubmit,
  isLoading,
}: UserInfoStepProps) {
  const { t } = useTranslation("barbershop");
  const {
    control,
    formState: { errors },
  } = useFormContext<UserInfoFormData>();

  // Log para debug
  console.log("Erros de validação:", errors);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-neutral-50">
          {t("forms.userInfo.title")}
        </h2>
        <p className="text-neutral-400">{t("forms.userInfo.subtitle")}</p>
      </div>

      <div className="space-y-4">
        {/* Email - OBRIGATÓRIO */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.userInfo.fields.email")}</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-neutral-50 placeholder-neutral-400 focus:ring-1 focus:outline-none"
                  placeholder={t("forms.userInfo.fields.emailPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPF - OBRIGATÓRIO */}
        <FormField
          control={control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.userInfo.fields.cpf")}</FormLabel>
              <FormControl>
                <input
                  {...field}
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-neutral-50 placeholder-neutral-400 focus:ring-1 focus:outline-none"
                  placeholder={t("forms.userInfo.fields.cpfPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estrangeiro - OPCIONAL */}
        <FormField
          control={control}
          name="isforeigner"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  {t("forms.userInfo.fields.isforeigner")}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Termos - OBRIGATÓRIO */}
        <FormField
          control={control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  {t("forms.userInfo.fields.terms")}
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Botões */}
      <motion.div
        className="flex justify-between pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          type="button"
          onClick={onPrevious}
          disabled={isLoading}
          className="rounded-lg border border-neutral-600 px-6 py-3 font-medium text-neutral-300 transition-all duration-200 hover:border-neutral-500 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("actions.previous")}
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? t("actions.creating") : t("actions.create")}
        </button>
      </motion.div>
    </motion.div>
  );
}
