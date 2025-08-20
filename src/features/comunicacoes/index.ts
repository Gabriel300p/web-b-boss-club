// 🎯 Public API for Comunicacoes Feature
// Main exports for clean imports

// Types (most commonly used)
export type {
  Comunicacao,
  ComunicacaoForm,
} from "./schemas/comunicacao.schemas";

// Pages
export { default as ComunicacoesPage } from "./pages/ComunicacoesPage";

// Schemas (for external validation)
export {
  comunicacaoSchema,
  type ComunicacaoFormData,
} from "./schemas/comunicacao.schemas";

// Main components (if reused in other features)
export { ModalComunicacao } from "./components/dialogs/ModalComunicacao";

// Note: For better performance and explicitness:
// - Specific hooks: import from '@features/comunicacoes/hooks/useSpecificHook'
// - Internal components: import from '@features/comunicacoes/components/SpecificComponent'
// - Services: import from '@features/comunicacoes/services/specificService'
