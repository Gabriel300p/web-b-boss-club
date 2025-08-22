import { LanguageSwitcher } from "@/shared/components/i18n/LanguageSwitcher";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { LoginForm } from "../components/form/LoginForm";

export function LoginPage() {
  return (
    <AuthPageWrapper className="bg-neutral-950">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <AuthForm
        title="Faça o login no B-Boss Club"
        subtitle="Bem-vindo de volta!"
      >
        <LoginForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
