/**
 * 🔍 useSearchPages Hook
 * Busca local de páginas do sistema com filtro por permissões
 */

import { useAuth } from "@features/auth/hooks/useAuth";
import {
  BuildingsIcon,
  FileTextIcon,
  GearIcon,
  HouseIcon,
  QuestionIcon,
  ScissorsIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import type { PageSearchResult } from "../types/search.types";
import {
  calculateRelevanceScore,
  filterByMinScore,
  sortByRelevance,
} from "../utils/search-scorer";

/**
 * 📄 Definição de todas as páginas do sistema
 * IMPORTANTE: Manter sincronizado com SidebarNavigation.tsx
 */
const SYSTEM_PAGES: Omit<PageSearchResult, "score">[] = [
  {
    id: "home",
    type: "page",
    title: "Início",
    description: "Dashboard principal do sistema",
    icon: HouseIcon,
    href: "/home",
    section: "principal",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
  {
    id: "units",
    type: "page",
    title: "Unidades",
    description: "Gestão de unidades e filiais",
    icon: BuildingsIcon,
    href: "/units",
    section: "principal",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER"],
  },
  {
    id: "barbershop-staff",
    type: "page",
    title: "Barbeiros",
    description: "Gestão de funcionários e barbeiros",
    icon: UsersIcon,
    href: "/barbershop-staff",
    section: "principal",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER"],
  },
  {
    id: "services",
    type: "page",
    title: "Serviços",
    description: "Catálogo de serviços oferecidos",
    icon: ScissorsIcon,
    href: "/services",
    section: "principal",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER"],
  },
  {
    id: "records",
    type: "page",
    title: "Atendimentos",
    description: "Histórico de atendimentos e agendamentos",
    icon: FileTextIcon,
    href: "/records",
    section: "principal",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
  {
    id: "settings",
    type: "page",
    title: "Configurações",
    description: "Configurações do sistema e perfil",
    icon: GearIcon,
    href: "/settings",
    section: "outros",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
  {
    id: "help",
    type: "page",
    title: "Ajuda",
    description: "Central de ajuda e documentação",
    icon: QuestionIcon,
    href: "/help",
    section: "outros",
    requiredRoles: ["SUPER_ADMIN", "BARBERSHOP_OWNER", "BARBER", "CLIENT"],
  },
];

/**
 * 🎯 Hook para buscar páginas do sistema
 *
 * @param query - Termo de busca
 * @param maxResults - Máximo de resultados (default: 5)
 * @returns Páginas filtradas e ordenadas por relevância
 */
export function useSearchPages(query: string, maxResults: number = 5) {
  const { user } = useAuth();

  // Filtrar páginas por permissão do usuário (SEM useMemo para evitar serialização)
  const accessiblePages = !user
    ? []
    : SYSTEM_PAGES.filter((page) =>
        page.requiredRoles.includes(
          user.role as PageSearchResult["requiredRoles"][number],
        ),
      );

  // Aplicar busca e scoring (SEM useMemo para evitar serialização de funções)
  let results: PageSearchResult[];
  let totalMatches = 0; // Total de resultados que passaram pelo filtro

  if (!query || query.trim().length === 0) {
    // Sem query: retornar páginas principais
    const principals = accessiblePages
      .filter((page) => page.section === "principal")
      .slice(0, maxResults);

    results = principals.map((page) => ({
      ...page,
      score: 0,
    }));
    totalMatches = principals.length;
  } else {
    // Com query: aplicar scoring
    const scored = accessiblePages.map((page) => ({
      ...page,
      score: calculateRelevanceScore(query, page.title, page.description),
    }));

    // Filtrar e ordenar
    const filtered = filterByMinScore(scored, 10);
    const sorted = sortByRelevance(filtered);

    totalMatches = sorted.length; // Total de resultados válidos
    results = sorted.slice(0, maxResults);
  }

  return {
    results,
    totalAccessible: accessiblePages.length,
    hasMore: totalMatches > maxResults, // Só tem mais se total de matches > limite
  };
}
