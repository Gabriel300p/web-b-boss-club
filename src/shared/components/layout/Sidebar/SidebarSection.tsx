import { type IconProps } from "@phosphor-icons/react";
import { sidebarContentVariants } from "@shared/components/animations/variants";
import { cn } from "@shared/lib/utils";
import { motion } from "framer-motion";
import { SidebarItem } from "./SidebarItem";

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<IconProps>;
    href: string;
  }>;
  currentPath: string;
  onItemClick: (href: string) => void;
}

export function SidebarSection({
  title,
  isCollapsed,
  items,
  currentPath,
  onItemClick,
}: SidebarSectionProps) {
  if (items.length === 0) return null;

  return (
    <motion.div
      variants={sidebarContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      {/* Título da seção com animação */}
      <div
        className={cn(
          "ease-ou overflow-hidden transition-all duration-300",
          isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100",
        )}
      >
        <h3 className="px-3 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          {title}
        </h3>
      </div>

      {/* Lista de itens */}
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={currentPath === item.href}
            isCollapsed={isCollapsed}
            onClick={() => onItemClick(item.href)}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
