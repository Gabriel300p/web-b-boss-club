import { useAuth } from "@features/auth/hooks/useAuth";
import {
  Buildings,
  FileText,
  Gear,
  House,
  Question,
  Scissors,
  Users,
  type IconProps,
} from "@phosphor-icons/react";
import { useSidebar } from "@shared/contexts/SidebarContext";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { SidebarSection } from "./SidebarSection";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  href: string;
  section: "principal" | "outros";
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    label: "Início",
    icon: House,
    href: "/home",
    section: "principal",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
  {
    id: "units",
    label: "Unidades",
    icon: Buildings,
    href: "/units",
    section: "principal",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER"],
  },
  {
    id: "barbers",
    label: "Barbeiros",
    icon: Users,
    href: "/barbers",
    section: "principal",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER"],
  },
  {
    id: "services",
    label: "Serviços",
    icon: Scissors,
    href: "/services",
    section: "principal",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER"],
  },
  {
    id: "records",
    label: "Atendimentos",
    icon: FileText,
    href: "/records",
    section: "principal",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Gear,
    href: "/settings",
    section: "outros",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
  {
    id: "help",
    label: "Ajuda",
    icon: Question,
    href: "/help",
    section: "outros",
    roles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
];

export function SidebarNavigation({ isCollapsed }: SidebarNavigationProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { close } = useSidebar();

  if (!user) return null;

  // Filtrar itens baseado no role do usuário
  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user.role),
  );

  // Agrupar por seção
  const principalItems = filteredItems.filter(
    (item) => item.section === "principal",
  );
  const outrosItems = filteredItems.filter((item) => item.section === "outros");

  const handleItemClick = (href: string) => {
    // Fechar sidebar em mobile
    close();

    // Navegar para a rota
    navigate({ to: href });
  };

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto p-4">
      {/* Seção Principal */}
      <SidebarSection
        title="Principal"
        isCollapsed={isCollapsed}
        items={principalItems}
        currentPath={location.pathname}
        onItemClick={handleItemClick}
      />

      {/* Seção Outros */}
      <SidebarSection
        title="Outros"
        isCollapsed={isCollapsed}
        items={outrosItems}
        currentPath={location.pathname}
        onItemClick={handleItemClick}
      />
    </nav>
  );
}
