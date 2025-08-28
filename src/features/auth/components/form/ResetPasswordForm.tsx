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
import { changePasswordSchema } from "../../schemas/auth.schema.ts";
import { authApiService } from "../../services/auth-api.service.ts";
import { AuthError } from "../AuthAnimations.tsx";

export function ResetPasswordForm() {
  const { t } = useTranslation("auth");

  // Detectar se é primeiro login baseado na URL
  const isFirstLogin =
    window.location.pathname === "/auth/first-login" ||
    window.location.search.includes("firstLogin=true");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      await authApiService.changePassword(
        values.newPassword,
        values.confirmPassword,
      );

      // Limpar temp_token após sucesso
      localStorage.removeItem("temp_token");

      // Se for primeiro login, redireciona para home após 2 segundos
      if (isFirstLogin) {
        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao alterar senha";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-400 transition hover:text-neutral-200"
                    >
                      {showConfirmPassword ? (
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
          {error && (
            <AuthError message={error}>
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
          )}
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                Alterando Senha... <LoadingSpinner className="ml-2 size-5" />
              </>
            ) : (
              <>
                Alterar Senha{" "}
                <ArrowRightIcon className="size-5" weight="fill" />
              </>
            )}
          </Button>

          {/* Botão Pular apenas para primeiro login */}
          {isFirstLogin && (
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/home")}
              className="w-full"
              size="lg"
            >
              Pular e Continuar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
