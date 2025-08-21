import Logo from "@shared/assets/logo/logo-simple.png";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title="Faça o login no B-Boss Club"
        subtitle="Bem-vindo de volta!"
      >
        <div className="mb-8 flex flex-col items-center gap-5">
          <img src={Logo} alt="Logo" className="size-20" />
        </div>
        <LoginForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
