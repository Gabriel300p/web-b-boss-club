import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { Button } from "@/shared/components/ui/button";
import { Form, FormField, FormItem } from "@/shared/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@phosphor-icons/react";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useMfaVerification } from "../hooks/useMfaVerification.ts";
import { mfaVerificationSchema } from "../schemas/auth.schema.ts";

export function MfaVerificationForm() {
  const form = useForm<z.infer<typeof mfaVerificationSchema>>({
    resolver: zodResolver(mfaVerificationSchema),
    defaultValues: { email: "" },
  });
  const [value, setValue] = React.useState("");

  const mfaVerificationMutation = useMfaVerification();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          mfaVerificationMutation.mutate(values),
        )}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={() => (
              <FormItem>
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={(value) => setValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={mfaVerificationMutation.isPending}
          className="w-full font-medium"
          size="lg"
        >
          {mfaVerificationMutation.isPending ? (
            <>
              Enviando... <LoadingSpinner className="ml-2 size-5" />
            </>
          ) : (
            <>
              Enviar código de verificação
              <ArrowRightIcon className="size-5" weight="fill" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
