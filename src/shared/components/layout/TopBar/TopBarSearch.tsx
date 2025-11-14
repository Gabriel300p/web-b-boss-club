import { SearchModal } from "@features/search/_index";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";
import { useEffect, useState } from "react";

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
          "border border-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-100",
          "justify-start gap-2 rounded-md",
          // Mobile: botão quadrado apenas com ícone
          "flex size-11 items-center justify-center sm:min-w-64 sm:px-3",
          className,
        )}
        aria-label="Pesquisar no sistema"
      >
        <MagnifyingGlassIcon className="size-5 flex-shrink-0" />
        <span className="hidden truncate text-sm sm:inline">Pesquisar...</span>
        <kbd className="ml-auto hidden rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-300 md:inline">
          Ctrl + K
        </kbd>
      </Button>

      <SearchModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
