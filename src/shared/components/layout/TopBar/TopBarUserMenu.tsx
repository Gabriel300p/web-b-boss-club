import { useAuth } from "@features/auth/hooks/useAuth";
import { GearIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import { cn } from "@shared/lib/utils";
import { useState } from "react";
import UserAvatar from "../user/UserAvatar";

interface TopBarUserMenuProps {
  className?: string;
}

export function TopBarUserMenu({ className }: TopBarUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  // Lógica para exibir nome e email baseado no tipo de usuário
  const getDisplayInfo = () => {
    if (user.role === "BARBERSHOP_OWNER") {
      // Para BARBERSHOP_OWNER, tentar usar name (que pode ser o nome da barbearia)
      // Se não tiver, usar o email como fallback
      return {
        primaryText: user.name || "Barbearia",
        secondaryText: user.email,
        isBarbershopOwner: true,
      };
    } else {
      // Para outros tipos, usar name se disponível, senão email
      return {
        primaryText: user.name || user.email.split("@")[0],
        secondaryText: user.email,
        isBarbershopOwner: false,
      };
    }
  };

  const displayInfo = getDisplayInfo();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto p-1 text-neutral-100 transition-colors hover:bg-neutral-700 sm:p-0",
            "flex items-center gap-0 rounded-md sm:gap-3",
            className,
          )}
          aria-label="Menu do usuário"
        >
          {/* Avatar */}
          <UserAvatar user={user} />

          {/* Informações do usuário */}
          <div className="hidden flex-col items-start gap-1 text-left sm:flex">
            <span className="max-w-32 truncate text-sm leading-tight font-medium lg:max-w-none">
              {displayInfo.primaryText}
            </span>
            <span className="text-muted-foreground max-w-32 truncate text-xs leading-tight lg:max-w-none">
              {displayInfo.secondaryText.length > 20
                ? `${displayInfo.secondaryText.substring(0, 20)}...`
                : displayInfo.secondaryText}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-2 sm:w-64"
        sideOffset={8}
      >
        <DropdownMenuItem className="cursor-pointer p-3">
          <UserIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer p-3">
          <GearIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Configurações</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer p-3 text-red-400 transition-colors duration-200 hover:bg-red-900/10"
          onClick={handleLogout}
        >
          <SignOutIcon className="mr-2 h-4 w-4 flex-shrink-0 text-red-400" />
          <span className="truncate">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
