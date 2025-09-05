import { type IconProps } from "@phosphor-icons/react";
import { sidebarItemVariants } from "@shared/components/animations/variants";
import { cn } from "@shared/lib/utils";
import { motion } from "framer-motion";

interface SidebarItemProps {
  item: {
    id: string;
    label: string;
    icon: React.ComponentType<IconProps>;
    href: string;
  };
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  index: number;
}

export function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onClick,
  index,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={sidebarItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.1 }}
    >
      <button
        onClick={onClick}
        className={cn(
          "group flex w-full cursor-pointer items-center rounded-lg text-left transition-all duration-200 ease-out",
          // Estados base
          "hover:opacity-80",
          // Estado ativo
          isActive ? "bg-primary/5 text-primary" : "text-neutral-300",
          // Espaçamento e alinhamento baseado no estado colapsado
          isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Ícone */}
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors duration-200",
            isActive
              ? "text-primary"
              : "text-neutral-400 group-hover:text-white",
            isCollapsed && "mx-auto",
          )}
          weight={isActive ? "fill" : "regular"}
        />

        {/* Label com animação */}
        {!isCollapsed && (
          <motion.span
            className="font-medium transition-all duration-300 ease-out"
            initial={false}
          >
            {item.label}
          </motion.span>
        )}
      </button>
    </motion.div>
  );
}
