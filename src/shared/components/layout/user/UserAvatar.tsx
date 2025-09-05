import { type User } from "@/features/auth/_index";
import type { FC } from "react";

interface UserAvatarProps {
  user: User;
}

const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
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
  return (
    <div className="bg-primary flex size-10 flex-shrink-0 items-center justify-center rounded-full">
      <span className="text-primary-foreground text-base font-bold">
        {getInitials()}
      </span>
    </div>
  );
};

export default UserAvatar;
