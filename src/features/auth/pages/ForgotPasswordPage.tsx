import Logo from "@shared/assets/logo/logo-simple.png";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title="Esqueci a senha"
        subtitle="Iremos enviar um e-mail para recuperar a senha"
      >
        <div className="mb-8 flex flex-col items-center gap-5">
          <img src={Logo} alt="Logo" className="size-20" />
        </div>
        <ForgotPasswordForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
