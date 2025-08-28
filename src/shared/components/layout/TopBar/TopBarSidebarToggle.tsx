import { CaretLeftIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { useSidebar } from "@shared/contexts/SidebarContext";
import { cn } from "@shared/lib/utils";

interface TopBarSidebarToggleProps {
  className?: string;
}

export function TopBarSidebarToggle({ className }: TopBarSidebarToggleProps) {
  const { isOpen, toggle } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn(
        "size-12 rounded-md border border-neutral-800 text-neutral-200 transition-colors hover:bg-neutral-700",
        className,
      )}
      aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
      aria-expanded={isOpen}
    >
      <CaretLeftIcon
        weight="bold"
        className={cn(
          "size-5 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </Button>
  );
}
