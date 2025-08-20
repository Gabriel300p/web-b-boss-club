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
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../schemas/auth.schema.ts";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLogin();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
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
                {/* <FormMessage /> */}
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
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <div>
            <Link
              to="/auth/esqueci-senha"
              className="text-sm font-medium text-neutral-200 underline transition-opacity duration-200 hover:opacity-80"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full font-medium"
          size="lg"
        >
          {loginMutation.isPending ? (
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
