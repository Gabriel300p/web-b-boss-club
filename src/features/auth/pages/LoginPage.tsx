import Logo from "@shared/assets/logo-vertical.svg";
import { buttonVariants } from "@shared/components/ui/button-variants";
import { Input } from "@shared/components/ui/input";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Login:", { username, password, rememberMe }); // Removed for production
    setIsLoading(true);

    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/comunicacoes";
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#062E4B] to-[#0E6DB1] p-4">
      <div className="w-full max-w-prose">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          {/* Logo e título */}
          <div className="mb-8 flex flex-col items-center justify-center">
            <img src={Logo} alt="Centro Educacional Alfa" />
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-3 block text-sm font-medium text-slate-600"
              >
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  className="h-14 rounded-xl border-slate-200 bg-white pl-12 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-sm font-medium text-slate-600"
              >
                Senha
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="h-14 rounded-xl border-slate-200 bg-white pr-12 pl-12 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembre de mim e Esqueci senha */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="text-primary focus:ring-primary h-4 w-4 rounded border-slate-300"
                />
                <label
                  htmlFor="remember-me"
                  className="block text-sm font-medium text-slate-600"
                >
                  Lembre de mim
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Esqueci minha senha
                </a>
              </div>
            </div>

            {/* Botão Login */}
            <button
              type="submit"
              disabled={isLoading}
              className={buttonVariants({
                variant: "default",
                className: "w-full",
              })}
            >
              {isLoading ? "Entrando..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
