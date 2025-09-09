import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateBarbershop } from "../hooks/useCreateBarbershop";
import {
  createBarbershopSchema,
  type CreateBarbershopFormData,
} from "../schemas/barbershop.schema";
import { StepIndicator } from "./StepIndicator";

export function CreateBarbershopForm() {
  const { t } = useTranslation("barbershop");
  const { createBarbershop, isLoading } = useCreateBarbershop();
  // const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  const form = useForm<CreateBarbershopFormData>({
    resolver: zodResolver(createBarbershopSchema),
    defaultValues: {
      barbershop: {
        name: "",
      },
      owner: {
        email: "",
        cpf: "",
        isforeigner: false,
        terms: false,
      },
    },
    mode: "onSubmit", // Validação apenas no submit
  });

  const steps = [t("steps.barbershop"), t("steps.owner")];

  const handleSubmit = async (data: CreateBarbershopFormData) => {
    try {
      await createBarbershop({
        barbershop: data.barbershop,
        owner: data.owner,
      });
    } catch (err) {
      console.error("❌ Erro ao criar barbearia:", err);
      // setSubmitErrors(["Erro ao criar barbearia. Tente novamente."]);
    }
  };

  const onSubmit = form.handleSubmit(handleSubmit);

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-2xl space-y-8">
        {/* Stepper Visual (sem funcionalidade) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StepIndicator
            currentStep={1} // Sempre na etapa 2 (proprietário)
            totalSteps={steps.length}
            steps={steps}
            className="mb-8"
          />
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-neutral-50">
              {t("pages.createBarbershop.title")}
            </h2>
            <p className="text-neutral-400">
              {t("pages.createBarbershop.subtitle")}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Nome da Barbearia */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-200">
                {t("forms.barbershopInfo.fields.name")}
              </label>
              <input
                {...form.register("barbershop.name")}
                className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-neutral-50 placeholder-neutral-400 focus:ring-1 focus:outline-none"
                placeholder={t("forms.barbershopInfo.fields.namePlaceholder")}
              />
              {form.formState.errors.barbershop?.name && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.barbershop.name.message ||
                    "Nome é obrigatório"}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-200">
                {t("forms.userInfo.fields.email")}
              </label>
              <input
                {...form.register("owner.email")}
                type="email"
                className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-neutral-50 placeholder-neutral-400 focus:ring-1 focus:outline-none"
                placeholder={t("forms.userInfo.fields.emailPlaceholder")}
              />
              {form.formState.errors.owner?.email && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.owner.email.message ||
                    "Email inválido"}
                </p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-200">
                {t("forms.userInfo.fields.cpf")}
              </label>
              <input
                {...form.register("owner.cpf")}
                className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-neutral-50 placeholder-neutral-400 focus:ring-1 focus:outline-none"
                placeholder={t("forms.userInfo.fields.cpfPlaceholder")}
              />
              {form.formState.errors.owner?.cpf && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.owner.cpf.message || "CPF inválido"}
                </p>
              )}
            </div>

            {/* Estrangeiro */}
            <div className="flex items-center space-x-3">
              <input
                {...form.register("owner.isforeigner")}
                type="checkbox"
                className="text-primary focus:ring-primary h-4 w-4 rounded border-neutral-600 bg-neutral-800 focus:ring-offset-neutral-800"
              />
              <label className="text-sm font-medium text-neutral-200">
                {t("forms.userInfo.fields.isforeigner")}
              </label>
            </div>

            {/* Termos */}
            <div className="flex items-center space-x-3">
              <input
                {...form.register("owner.terms")}
                type="checkbox"
                className="text-primary focus:ring-primary h-4 w-4 rounded border-neutral-600 bg-neutral-800 focus:ring-offset-neutral-800"
              />
              <label className="text-sm font-medium text-neutral-200">
                {t("forms.userInfo.fields.terms")}
              </label>
            </div>
            {form.formState.errors.owner?.terms && (
              <p className="text-sm text-red-400">
                {form.formState.errors.owner.terms.message ||
                  "Termos são obrigatórios"}
              </p>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-6 py-3 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t("actions.creating") : t("actions.create")}
            </button>
          </form>

          {/* {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400"
            >
              {t("errors.createFailed")}
            </motion.div>
          )} */}
        </motion.div>
      </div>
    </FormProvider>
  );
}
