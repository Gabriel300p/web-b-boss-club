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
import type { BarbershopInfoFormData } from "../schemas/barbershop.schema";

interface BarbershopInfoStepProps {
  onNext: () => void;
  // isValid: boolean;
}

export function BarbershopInfoStep({
  onNext,
  // isValid,
}: BarbershopInfoStepProps) {
  const { t } = useTranslation("barbershop");
  const { control } = useFormContext<BarbershopInfoFormData>();

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
          {t("forms.barbershopInfo.title")}
        </h2>
        <p className="text-neutral-400">{t("forms.barbershopInfo.subtitle")}</p>
      </div>

      <div className="space-y-4">
        {/* Nome da Barbearia - ÚNICO CAMPO OBRIGATÓRIO */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.barbershopInfo.fields.name")}</FormLabel>
              <FormControl>
                <input
                  {...field}
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-neutral-50 placeholder-neutral-400 focus:ring-1 focus:outline-none"
                  placeholder={t("forms.barbershopInfo.fields.namePlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Botão Próximo */}
      <motion.div
        className="flex justify-end pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          type="button"
          onClick={onNext}
          // disabled={!isValid}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("actions.next")}
        </button>
      </motion.div>
    </motion.div>
  );
}
