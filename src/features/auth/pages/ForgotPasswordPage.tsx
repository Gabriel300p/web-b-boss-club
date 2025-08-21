import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { ForgotPasswordForm } from "../components/form/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title="Esqueci a senha"
        subtitle="Iremos enviar um e-mail para recuperar a senha"
      >
        <ForgotPasswordForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
