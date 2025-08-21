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
import type z from "zod";
import { useForgotPasswordAuth } from "../../hooks/useForgotPasswordAuth";
import { forgotPasswordSchema } from "../../schemas/auth.schema.ts";

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { forgotPassword, isLoading } = useForgotPasswordAuth();

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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email@exemplo.com" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium"
          size="lg"
        >
          {isLoading ? (
            <>
              Enviando... <LoadingSpinner className="ml-2 size-5" />
            </>
          ) : (
            <>
              Enviar recuperação de senha{" "}
              <ArrowRightIcon className="size-5" weight="fill" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
