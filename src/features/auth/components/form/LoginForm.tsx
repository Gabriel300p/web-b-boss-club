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
import { ArrowRightIcon, Eye, EyeSlash } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type z from "zod";
import { useLoginAuth } from "../../hooks/useLoginAuth";
import { loginSchema } from "../../schemas/auth.schema.ts";
import { AuthError } from "../AuthAnimations.tsx";

export function LoginForm() {
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLoginAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { credential: "", password: "" },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login({
      credential: values.credential,
      password: values.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="credential"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.login.fields.email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("forms.login.fields.emailPlaceholder")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.login.fields.password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("forms.login.fields.passwordPlaceholder")}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-400 transition hover:text-neutral-200"
                    >
                      {showPassword ? (
                        <EyeSlash className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {/* Error message display */}
          {error ? (
            <AuthError
              message={
                error.message || t("forms.login.errors.invalidCredentials")
              }
            >
              <span className="text-sm text-neutral-200 dark:text-neutral-400">
                {t("forms.login.actions.forgotPasswordQuestion")}{" "}
                <Link
                  to="/auth/forgot-password"
                  className="underline transition-opacity duration-200 hover:opacity-80 dark:text-neutral-200"
                >
                  {t("forms.login.actions.forgotPasswordLink")}
                </Link>
              </span>
            </AuthError>
          ) : (
            <div>
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-neutral-200 underline transition-opacity duration-200 hover:opacity-80"
              >
                {t("forms.login.actions.forgotPassword")}
              </Link>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium"
          size="lg"
        >
          {isLoading ? (
            <>
              {t("forms.login.actions.loading")}{" "}
              <LoadingSpinner className="ml-2 size-5" />
            </>
          ) : (
            <>
              {t("forms.login.actions.submit")}{" "}
              <ArrowRightIcon className="size-5" weight="fill" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
