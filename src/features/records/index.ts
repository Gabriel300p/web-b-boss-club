/**
 * 📝 Records Feature - Bridge Module
 * Provides generic record functionality and backward compatibility
 */

// ===== NEW GENERIC RECORDS FUNCTIONALITY =====
export * from "./hooks/useRecords";
export * from "./records";
export * from "./services/record.service";

// Export specific schemas to avoid conflicts
export {
  baseRecordSchema,
  recordFormSchema,
  type BaseRecord,
  type GenericRecord,
  type GenericRecordForm,
  type RecordForm,
} from "./schemas/record.schemas";

// Export new records page
export { default as RecordsPage } from "./pages/RecordsPage";

// ===== BACKWARD COMPATIBILITY EXPORTS =====
// Re-export select comunicacoes functionality for backward compatibility
export { ModalComunicacao } from "../comunicacoes/components/dialogs/ModalComunicacao";
export { ModalDeleteConfirm } from "../comunicacoes/components/dialogs/ModalDeleteConfirm";
export { createColumns } from "../comunicacoes/components/table/columns";
export { DataTable } from "../comunicacoes/components/table/DataTable";
export { ComunicacoesToolbar } from "../comunicacoes/components/toolbar/ComunicacoesToolbar";
export { useComunicacoes } from "../comunicacoes/hooks/useComunicacoes";
export { useSearch } from "../comunicacoes/hooks/useSearch";

// Export specific types for compatibility
export type {
  Comunicacao,
  ComunicacaoForm,
} from "../comunicacoes/schemas/comunicacao.schemas";

// Default export for the page
export { default as ComunicacoesPage } from "../comunicacoes/pages/ComunicacoesPage";
