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
import type z from "zod";
import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../schemas/auth.schema.ts";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending: isLoading } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => login(values))}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email@exemplo.com" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

          <div>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-neutral-200 underline transition-opacity duration-200 hover:opacity-80"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium"
          size="lg"
        >
          {isLoading ? (
            <>
              Entrando... <LoadingSpinner className="ml-2 size-5" />
            </>
          ) : (
            <>
              Continuar <ArrowRightIcon className="size-5" weight="fill" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
