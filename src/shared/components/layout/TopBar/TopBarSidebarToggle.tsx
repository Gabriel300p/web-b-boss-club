import { CaretLeftIcon, ListIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { useSidebar } from "@shared/contexts/SidebarContext";
import { cn } from "@shared/lib/utils";
import { useEffect, useState } from "react";

interface TopbarSidebarToggleProps {
  className?: string;
}

export function TopbarSidebarToggle({ className }: TopbarSidebarToggleProps) {
  const { isOpen, toggle, isCollapsed, toggleCollapsed } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      // Em mobile, toggle o sidebar aberto/fechado
      toggle();
    } else {
      // Em desktop, toggle o estado colapsado
      toggleCollapsed();
    }
  };

  const getAriaLabel = () => {
    if (isMobile) {
      return isOpen ? "Fechar sidebar" : "Abrir sidebar";
    } else {
      return isCollapsed ? "Expandir sidebar" : "Colapsar sidebar";
    }
  };

  const getAriaExpanded = () => {
    if (isMobile) {
      return isOpen;
    } else {
      return !isCollapsed;
    }
  };

  const getIconRotation = () => {
    if (isMobile) {
      return isOpen && "rotate-180";
    } else {
      return isCollapsed && "rotate-180";
    }
  };

  const renderIcon = () => {
    if (isMobile) {
      // Em mobile, usa ícone de menu (lista)
      return (
        <ListIcon
          weight="bold"
          className="size-5 transition-transform duration-200"
        />
      );
    } else {
      // Em desktop, usa ícone de seta com rotação
      return (
        <CaretLeftIcon
          weight="bold"
          className={cn(
            "size-5 transition-transform duration-200",
            getIconRotation(),
          )}
        />
      );
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn(
        "size-11 rounded-md border border-neutral-800 text-neutral-200 transition-colors hover:bg-neutral-700",
        className,
      )}
      aria-label={getAriaLabel()}
      aria-expanded={getAriaExpanded()}
    >
      {renderIcon()}
    </Button>
  );
}
