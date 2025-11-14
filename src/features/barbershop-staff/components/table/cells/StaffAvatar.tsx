/**
 * 👤 Staff Avatar Component
 * Avatar com fallback de iniciais para colaboradores da barbearia
 */
import type { FC } from "react";

interface StaffAvatarProps {
  firstName: string;
  lastName?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const StaffAvatar: FC<StaffAvatarProps> = ({
  firstName,
  lastName,
  avatarUrl,
  size = "md",
}) => {
  /**
   * Gera as iniciais do nome
   * - Se tiver last_name: primeira letra de cada
   * - Se não tiver: só a primeira letra do first_name
   */
  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase();

    if (lastName && typeof lastName === "string" && lastName.trim()) {
      const lastInitial = lastName.charAt(0).toUpperCase();
      return `${firstInitial}${lastInitial}`;
    }

    return firstInitial;
  };

  /**
   * Gera uma cor única mas consistente baseada no nome
   * Usa cores pastéis suaves que combinam com modo escuro
   */
  // const getAvatarColor = () => {
  //   const fullName = `${firstName}${lastName || ""}`.toLowerCase();

  //   // Gera um hash simples do nome
  //   let hash = 0;
  //   for (let i = 0; i < fullName.length; i++) {
  //     hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
  //   }

  //   // Paleta de cores pastéis escuras/dessaturadas para modo escuro
  //   // Cores suaves, não muito vibrantes, que ficam elegantes no fundo escuro
  //   const pastelColors = [
  //     { bg: "bg-amber-900/50", text: "text-amber-200/80" }, // Âmbar suave
  //     { bg: "bg-emerald-900/50", text: "text-emerald-200/80" }, // Verde esmeralda
  //     { bg: "bg-sky-900/50", text: "text-sky-200/80" }, // Azul céu
  //     { bg: "bg-violet-900/50", text: "text-violet-200/80" }, // Violeta
  //     { bg: "bg-rose-900/50", text: "text-rose-200/80" }, // Rosa
  //     { bg: "bg-cyan-900/50", text: "text-cyan-200/80" }, // Ciano
  //     { bg: "bg-orange-900/50", text: "text-orange-200/80" }, // Laranja
  //     { bg: "bg-teal-900/50", text: "text-teal-200/80" }, // Teal
  //     { bg: "bg-indigo-900/50", text: "text-indigo-200/80" }, // Índigo
  //     { bg: "bg-fuchsia-900/50", text: "text-fuchsia-200/80" }, // Fúcsia
  //   ];

  //   const index = Math.abs(hash) % pastelColors.length;
  //   return pastelColors[index];
  // };

  // const colors = getAvatarColor();

  // Tamanhos do avatar
  const sizeClasses = {
    sm: "size-8 text-sm",
    md: "size-11 text-base",
    lg: "size-12 text-lg",
  };

  // Se tiver avatar_url, mostra a imagem
  if (avatarUrl) {
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 ${sizeClasses[size]}`}
      >
        <img
          src={avatarUrl}
          alt={`${firstName} ${lastName || ""}`}
          className="size-full object-cover"
          onError={(e) => {
            // Se a imagem falhar ao carregar, esconde ela e mostra as iniciais
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="font-bold text-neutral-400">${getInitials()}</span>`;
            }
          }}
        />
      </div>
    );
  }

  // Fallback: mostra as iniciais
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 ${sizeClasses[size]}`}
    >
      <span className={`font-bold text-neutral-400`}>{getInitials()}</span>
    </div>
  );
};

export default StaffAvatar;
