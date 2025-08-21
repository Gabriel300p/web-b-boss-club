import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title="Faça o login no B-Boss Club"
        subtitle="Bem-vindo de volta!"
      >
        <LoginForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
