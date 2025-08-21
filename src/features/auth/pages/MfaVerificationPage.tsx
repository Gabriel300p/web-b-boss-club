import Logo from "@shared/assets/logo/logo-simple.png";
import { MfaVerificationForm } from "../components/MfaVerificationForm";

export function MfaVerificationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-5">
          <img src={Logo} alt="Logo" className="size-20" />
          <div className="space-y-1 text-center">
            <p className="text-neutral-400">
              Nós enviamos o código de verificação para gabriel.andra...
            </p>
          </div>
        </div>
        <MfaVerificationForm />
      </div>
    </div>
  );
}
