import { useAuth } from "@features/auth/hooks/useAuth";
import { sidebarBackdropVariants } from "@shared/components/animations/variants";
import { useSidebar } from "@shared/contexts/SidebarContext";
import { cn } from "@shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isOpen, close, isCollapsed } = useSidebar();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Backdrop para mobile com animação */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-backdrop"
            variants={sidebarBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar com animação de entrada */}
      <aside
        className={cn(
          "text-neutral-10 fixed top-0 left-0 z-50 h-screen w-64 overflow-hidden bg-neutral-900 py-2 lg:relative lg:h-full",
          // Estado colapsado em desktop
          isCollapsed && "lg:w-20",
          // Controle de visibilidade em mobile
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 ease-in-out lg:transition-all",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader isCollapsed={isCollapsed} />
          <SidebarNavigation isCollapsed={isCollapsed} />
          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  );
}
