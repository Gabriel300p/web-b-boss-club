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

  // Gerar iniciais para o avatar
  const getInitials = () => {
    if (
      displayInfo.isBarbershopOwner &&
      displayInfo.primaryText !== "Barbearia"
    ) {
      // Para barbearia, usar as primeiras letras do nome
      return displayInfo.primaryText
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } else {
      // Para usuários, usar as primeiras letras do nome ou email
      return displayInfo.primaryText
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  };

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
            "h-auto p-0 text-neutral-100 transition-colors hover:bg-neutral-700",
            "flex items-center gap-3 rounded-md",
            className,
          )}
          aria-label="Menu do usuário"
        >
          {/* Avatar */}
          <div className="bg-primary flex size-9 flex-shrink-0 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-base font-bold">
              {getInitials()}
            </span>
          </div>

          {/* Informações do usuário */}
          <div className="flex flex-col items-start gap-1 text-left">
            <span className="text-sm leading-tight font-medium">
              {displayInfo.primaryText}
            </span>
            <span className="text-muted-foreground text-xs leading-tight">
              {displayInfo.secondaryText.length > 20
                ? `${displayInfo.secondaryText.substring(0, 20)}...`
                : displayInfo.secondaryText}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2" sideOffset={8}>
        <DropdownMenuItem className="cursor-pointer p-3">
          <UserIcon className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer p-3">
          <GearIcon className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer p-3 text-red-400 transition-colors duration-200 hover:bg-red-900/10"
          onClick={handleLogout}
        >
          <SignOutIcon className="mr-2 h-4 w-4 text-red-400" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
