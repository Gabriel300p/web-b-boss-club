import Logo from "@shared/assets/logo/logo-simple.png";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { MfaVerificationForm } from "../components/MfaVerificationForm";
import { useCurrentUserEmail } from "../hooks/useAuth";

export function MfaVerificationPage() {
  const userEmail = useCurrentUserEmail();
  const maskedEmail = userEmail
    ? `${userEmail.slice(0, 3)}...${userEmail.slice(-10)}`
    : "seu email";

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title="Verificação de Segurança"
        subtitle={`Enviamos o código de verificação para ${maskedEmail}`}
      >
        <div className="mb-8 flex flex-col items-center gap-5">
          <img src={Logo} alt="Logo" className="size-20" />
        </div>
        <MfaVerificationForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
