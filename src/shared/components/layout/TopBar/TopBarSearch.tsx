import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";
import { useEffect, useState } from "react";
import { TopBarSearchModal } from "./TopBarSearchModal";

interface TopBarSearchProps {
  className?: string;
}

export function TopBarSearch({ className }: TopBarSearchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Atalho Ctrl+K para abrir busca
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "border border-neutral-800 px-3 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-100",
          "min-w-sm justify-start gap-2 rounded-md",
          className,
        )}
        aria-label="Pesquisar no sistema"
      >
        <MagnifyingGlass className="h-4 w-4" />
        <span className="text-sm">Pesquisar...</span>
        <kbd className="ml-auto rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-300">
          Ctrl + K
        </kbd>
      </Button>

      <TopBarSearchModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
