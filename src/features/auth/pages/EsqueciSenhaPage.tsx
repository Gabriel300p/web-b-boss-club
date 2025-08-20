import Logo from "@shared/assets/logo/logo-simple.png";
import { LoginForm } from "../components/LoginForm";

export function EsqueciSenhaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-5">
          <img src={Logo} alt="Logo" className="size-20" />
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-neutral-50">
              Faça o login no B-Boss Club
            </h2>
            <p className="text-neutral-400">Bem-vindo de volta!</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
