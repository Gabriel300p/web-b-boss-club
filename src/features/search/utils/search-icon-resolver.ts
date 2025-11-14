/**
 * 🎨 Search Icon Resolver
 * Reconstrói ícones de resultados de busca baseado no tipo
 */

import type { IconProps } from "@phosphor-icons/react";
import {
  BuildingsIcon,
  FileTextIcon,
  GearIcon,
  HouseIcon,
  QuestionIcon,
  ScissorsIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import type { SearchableEntity } from "../types/search.types";

/**
 * � Mapeamento de rotas → ícones
 * Sincronizado com useSearchPages.ts e SidebarNavigation.tsx
 */
const PAGE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  "/home": HouseIcon,
  "/units": BuildingsIcon,
  "/barbershop-staff": UsersIcon,
  "/services": ScissorsIcon,
  "/records": FileTextIcon,
  "/settings": GearIcon,
  "/help": QuestionIcon,
};

/**
 * �🔍 Mapeia um tipo de entidade para seu ícone correspondente
 *
 * @param type - Tipo da entidade (page, staff, service, etc)
 * @param id - ID da entidade (para páginas, é o href)
 * @returns Componente de ícone do Phosphor
 */
export function getIconForSearchResult(
  type: SearchableEntity,
  id?: string,
): React.ComponentType<IconProps> {
  switch (type) {
    case "page":
      // Para páginas, o ID é o href (/home, /barbershop-staff, etc)
      if (id && PAGE_ICONS[id]) {
        return PAGE_ICONS[id];
      }
      // Fallback: ícone genérico
      return HouseIcon;

    case "staff":
      return UsersIcon;

    case "service":
      return ScissorsIcon;

    case "unit":
      return BuildingsIcon;

    case "appointment":
      return FileTextIcon;

    default:
      return UsersIcon; // Fallback genérico
  }
}

/**
 * 🔄 Converte um resultado serializável de volta para SearchResult completo
 * Reconstrói o ícone baseado no tipo
 */
export function deserializeSearchResult(serialized: {
  id: string;
  type: SearchableEntity;
  title: string;
  description: string;
  score: number;
  href?: string;
  shortcut?: string;
  section?: "principal" | "outros";
  status?: string;
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
}): {
  id: string;
  type: SearchableEntity;
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  score: number;
  href?: string;
  shortcut?: string;
  section?: "principal" | "outros";
  status?: string;
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
} {
  // Para páginas, usar href como ID para buscar ícone
  // Para staff, usar o id real
  const iconId = serialized.type === "page" ? serialized.href : serialized.id;

  return {
    ...serialized,
    icon: getIconForSearchResult(serialized.type, iconId),
  };
}
