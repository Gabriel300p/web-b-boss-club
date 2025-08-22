import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type z from "zod";
import { useForgotPasswordAuth } from "../../hooks/useForgotPasswordAuth";
import { forgotPasswordSchema } from "../../schemas/auth.schema.ts";
import { AuthError } from "../AuthAnimations.tsx";

export function ForgotPasswordForm() {
  const { t } = useTranslation("auth");
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { forgotPassword, isLoading, error } = useForgotPasswordAuth();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => forgotPassword(values))}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.forgotPassword.fields.email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t(
                      "forms.forgotPassword.fields.emailPlaceholder",
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Error message display */}
        {error && (
          <AuthError
            message={
              error.message || t("forms.forgotPassword.errors.sendError")
            }
          />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium"
          size="lg"
        >
          {isLoading ? (
            <>
              {t("forms.forgotPassword.actions.loading")}{" "}
              <LoadingSpinner className="ml-2 size-5" />
            </>
          ) : (
            <>
              {t("forms.forgotPassword.actions.submit")}{" "}
              <ArrowRightIcon className="size-5" weight="fill" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
