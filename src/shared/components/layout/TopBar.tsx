import Logo from "@shared/assets/logo.svg";
import { LogOut } from "lucide-react";
import { LanguageSwitcher } from "@shared/components/i18n/LanguageSwitcher";
import { Button } from "@shared/components/ui/button";

export function TopBar() {
  const handleLogout = () => {
    // Implementar lógica de logout aqui
    // console.log("Logout realizado"); // Removed for production
    // Redirecionar para a página de login ou limpar o estado de autenticação
    window.location.href = "/login";
  };

  return (
    <header className="bg-[#062E4B] text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 lg:px-16">
        {/* Logo e Nome */}
        <img
          src={Logo}
          alt="Logo Centro Educacional Alfa"
          className="h-8 w-auto md:h-10"
        />

        {/* Usuário */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full md:h-9 md:w-9">
              <span className="text-xs font-medium text-white md:text-sm">
                GA
              </span>
            </div>
            <span className="hidden text-xs font-medium sm:block md:text-sm">
              Gabriel Andrade
            </span>
            <span className="text-xs font-medium sm:hidden md:text-sm">
              Gabriel
            </span>
          </div>
          <hr className="h-4 w-px border border-slate-600 md:h-6" />
          <LanguageSwitcher />
          {/* Botão de Logout */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center justify-center rounded-md p-1 transition-colors duration-200 hover:bg-white/80"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
