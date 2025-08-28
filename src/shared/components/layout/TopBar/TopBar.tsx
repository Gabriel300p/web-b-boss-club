import { cn } from "@shared/lib/utils";
import { TopBarNotifications } from "./TopBarNotifications";
import { TopBarSearch } from "./TopBarSearch";
import { TopBarSidebarToggle } from "./TopBarSidebarToggle";
import { TopBarUserMenu } from "./TopBarUserMenu";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <header
      className={cn("bg-neutral-900 text-neutral-200 shadow-md", className)}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 lg:px-16">
        {/* Lado esquerdo: Botão sidebar e busca */}
        <div className="flex items-center gap-4">
          <TopBarSidebarToggle />
          <TopBarSearch />
        </div>

        {/* Espaçador central */}
        <div className="flex-1" />

        {/* Lado direito: Notificações e usuário */}
        <div className="flex items-center gap-5">
          <TopBarNotifications />

          {/* Separador vertical */}
          <div className="h-6 w-px bg-neutral-600" />

          <TopBarUserMenu />
        </div>
      </div>
    </header>
  );
}
