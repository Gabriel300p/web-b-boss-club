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
import { ArrowRightIcon, PaperPlaneTilt } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useCurrentUserEmail } from "../../hooks/useAuth";
import { useMfaAuth } from "../../hooks/useMfaAuth";
import { mfaVerificationSchema } from "../../schemas/auth.schema";

export function MfaVerificationForm() {
  const userEmail = useCurrentUserEmail();
  const form = useForm<z.infer<typeof mfaVerificationSchema>>({
    resolver: zodResolver(mfaVerificationSchema),
    defaultValues: { email: userEmail || "" },
  });
  const [value, setValue] = React.useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { verifyMfa, resendMfaCode, isVerifying, isResending } = useMfaAuth();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Function to handle resend code
  const handleResendCode = async () => {
    resendMfaCode();

    // Reset countdown and states
    setCountdown(60);
    setCanResend(false);
    setValue(""); // Clear the OTP input
    form.reset(); // Reset form
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          verifyMfa({ ...values, code: value }),
        )}
        className="flex flex-col items-center justify-center gap-8"
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

        {/* Countdown or Resend Button */}
        <div className="space-y-2 text-center">
          {!canResend ? (
            <span className="text-base font-normal text-neutral-300">
              Reenviar código em{" "}
              <span className="font-semibold underline">{countdown}</span>{" "}
              segundos
            </span>
          ) : (
            <div className="space-y-2">
              <span className="text-base text-neutral-400">
                Não recebeu o código?
              </span>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-primary hover:text-primary/80"
              >
                {isResending ? (
                  <>
                    <LoadingSpinner className="size-3" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt className="size-3" weight="fill" />
                    Reenviar código
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isVerifying || value.length !== 6}
          className="w-full font-medium"
          size="lg"
        >
          {isVerifying ? (
            <>
              Verificando... <LoadingSpinner className="ml-2 size-5" />
            </>
          ) : (
            <>
              Verificar código
              <ArrowRightIcon className="size-5" weight="fill" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
