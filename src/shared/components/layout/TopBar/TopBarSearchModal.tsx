import {
  ArrowRightIcon,
  CalendarIcon,
  ChartBarIcon,
  FileTextIcon,
  GearIcon,
  PaletteIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/components/ui/command";
import { useState } from "react";

interface TopBarSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Dados mock para as páginas do sistema
const systemPages = [
  {
    id: "docs",
    title: "Documentação",
    description: "Guia completo do sistema",
    icon: FileTextIcon,
    category: "pages",
  },
  {
    id: "components",
    title: "Componentes",
    description: "Biblioteca de componentes UI",
    icon: PaletteIcon,
    category: "pages",
  },
  {
    id: "users",
    title: "Usuários",
    description: "Gestão de usuários e permissões",
    icon: UsersIcon,
    category: "pages",
  },
  {
    id: "appointments",
    title: "Agendamentos",
    description: "Sistema de agendamentos",
    icon: CalendarIcon,
    category: "pages",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Relatórios e métricas",
    icon: ChartBarIcon,
    category: "pages",
  },
  {
    id: "settings",
    title: "Configurações",
    description: "Configurações do sistema",
    icon: GearIcon,
    category: "pages",
  },
];

export function TopBarSearchModal({
  open,
  onOpenChange,
}: TopBarSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = systemPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (pageId: string) => {
    // Aqui você pode implementar a navegação para a página selecionada
    console.log(`Navegando para: ${pageId}`);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Pesquisar no sistema..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Páginas">
            {filteredPages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => handleSelect(page.id)}
                className="hover:bg-accent flex cursor-pointer items-center gap-3 px-4 py-3"
              >
                <page.icon className="text-muted-foreground h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{page.title}</div>
                  <div className="text-muted-foreground text-sm">
                    {page.description}
                  </div>
                </div>
                <ArrowRightIcon className="text-muted-foreground h-4 w-4" />
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Começar">
            <CommandItem
              onSelect={() => handleSelect("introduction")}
              className="hover:bg-accent flex cursor-pointer items-center gap-3 px-4 py-3"
            >
              <FileTextIcon className="text-muted-foreground h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">Introdução</div>
                <div className="text-muted-foreground text-sm">
                  Primeiros passos no sistema
                </div>
              </div>
              <ArrowRightIcon className="text-muted-foreground h-4 w-4" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
