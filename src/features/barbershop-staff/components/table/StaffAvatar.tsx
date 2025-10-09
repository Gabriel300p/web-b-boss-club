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

  // Tamanhos do avatar
  const sizeClasses = {
    sm: "size-8 text-sm",
    md: "size-10 text-base",
    lg: "size-12 text-lg",
  };

  return (
    <div
      className={`bg-primary flex flex-shrink-0 items-center justify-center rounded-full ${sizeClasses[size]}`}
    >
      <span className="text-primary-foreground font-bold">{getInitials()}</span>
    </div>
  );
};

export default StaffAvatar;
