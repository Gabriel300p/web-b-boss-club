// 🎯 Centralized Skeleton Components Export
// Organizes all skeleton components in one place for easy imports

// ===== BASIC SKELETON COMPONENTS =====
export * from "../ui/skeleton";

// ===== GENERIC SKELETON LAYOUTS =====
export { AdvancedLoadingSkeleton } from "./AdvancedLoadingSkeleton";
export { CardListSkeleton } from "./CardListSkeleton";
export { FormSkeleton } from "./FormSkeleton";
export { RouteSkeleton } from "./RouteSkeleton";
export { TableSkeleton } from "./TableSkeleton";

// ===== SKELETON CATEGORIES FOR EASY ACCESS =====
export const SkeletonTypes = {
  // Basic components
  Line: "SkeletonLine",
  Box: "SkeletonBox",
  Circle: "SkeletonCircle",

  // Layout skeletons
  Route: "RouteSkeleton",
  Table: "TableSkeleton",
  Form: "FormSkeleton",
  CardList: "CardListSkeleton",
  Advanced: "AdvancedLoadingSkeleton",

  // Feature-specific
  CommunicationPage: "CommunicationPageSkeleton",
  CommunicationTable: "CommunicationTableSkeleton",
} as const;

// ===== USAGE EXAMPLES =====
/*
🎯 COMO USAR:

// Import individual skeletons:
import { 
  SkeletonLine, 
  RouteSkeleton, 
  TableSkeleton,
  CommunicationTableSkeleton 
} from "@shared/components/skeletons";

// Import múltiplos:
import { 
  FormSkeleton, 
  CardListSkeleton, 
  AdvancedLoadingSkeleton 
} from "@shared/components/skeletons";

📁 ORGANIZAÇÃO FINAL:
├── 🔹 Basic: SkeletonLine, SkeletonBox, SkeletonCircle
├── 🔸 Individual Files: RouteSkeleton.tsx, TableSkeleton.tsx, FormSkeleton.tsx, CardListSkeleton.tsx, AdvancedLoadingSkeleton.tsx
└── 🔷 Feature-Specific: CommunicationPageSkeleton, CommunicationTableSkeleton

✅ VANTAGENS:
- Import único centralizado
- Arquivos separados e organizados
- Sem código duplicado
- Fácil de encontrar e manter
- Estrutura limpa e escalável
*/
