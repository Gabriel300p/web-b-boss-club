/**
 * 👤 Staff Avatar Component
 * Avatar com fallback de iniciais para colaboradores da barbearia
 */
import type { FC } from "react";

interface StaffAvatarProps {
  firstName: string;
  lastName?: string | null;
  size?: "sm" | "md" | "lg";
}

const StaffAvatar: FC<StaffAvatarProps> = ({
  firstName,
  lastName,
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
  const getAvatarColor = () => {
    const fullName = `${firstName}${lastName || ""}`.toLowerCase();

    // Gera um hash simples do nome
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Paleta de cores pastéis escuras/dessaturadas para modo escuro
    // Cores suaves, não muito vibrantes, que ficam elegantes no fundo escuro
    const pastelColors = [
      { bg: "bg-amber-900/60", text: "text-amber-200" }, // Âmbar suave
      { bg: "bg-emerald-900/60", text: "text-emerald-200" }, // Verde esmeralda
      { bg: "bg-sky-900/60", text: "text-sky-200" }, // Azul céu
      { bg: "bg-violet-900/60", text: "text-violet-200" }, // Violeta
      { bg: "bg-rose-900/60", text: "text-rose-200" }, // Rosa
      { bg: "bg-cyan-900/60", text: "text-cyan-200" }, // Ciano
      { bg: "bg-orange-900/60", text: "text-orange-200" }, // Laranja
      { bg: "bg-teal-900/60", text: "text-teal-200" }, // Teal
      { bg: "bg-indigo-900/60", text: "text-indigo-200" }, // Índigo
      { bg: "bg-fuchsia-900/60", text: "text-fuchsia-200" }, // Fúcsia
    ];

    const index = Math.abs(hash) % pastelColors.length;
    return pastelColors[index];
  };

  const colors = getAvatarColor();

  // Tamanhos do avatar
  const sizeClasses = {
    sm: "size-8 text-sm",
    md: "size-10 text-base",
    lg: "size-12 text-lg",
  };

  return (
    <div
      className={`${colors.bg} flex flex-shrink-0 items-center justify-center rounded-full ${sizeClasses[size]}`}
      // className={`bg-primary flex flex-shrink-0 items-center justify-center rounded-full ${sizeClasses[size]}`}
    >
      <span className={`${colors.text} font-bold`}>{getInitials()}</span>
      {/* <span className={`font-bold text-black`}>{getInitials()}</span> */}
    </div>
  );
};

export default StaffAvatar;
