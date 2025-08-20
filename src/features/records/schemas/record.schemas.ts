/**
 * 📝 Generic Record Schema Definitions
 * Base types and validation for the generic records feature
 */
import { z } from "zod";

// Base record type that can be extended
export const baseRecordSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1, "title.required"),
  autor: z.string().min(1, "author.required"),
  tipo: z.enum(["Comunicado", "Aviso", "Notícia"], {
    message: "type.required",
  }),
  descricao: z.string().min(1, "description.required"),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

// Form schema for creating/editing records
export const recordFormSchema = baseRecordSchema.omit({
  id: true,
  dataCriacao: true,
  dataAtualizacao: true,
});

// Types
export type BaseRecord = z.infer<typeof baseRecordSchema>;
export type RecordForm = z.infer<typeof recordFormSchema>;

// Generic record type that can be extended for specific domains
export type GenericRecord = BaseRecord & {
  // Extensible metadata
  metadata?: Record<string, unknown>;
  tags?: string[];
  category?: string;
  status?: "draft" | "published" | "archived";
};

// Form type for generic records
export type GenericRecordForm = Omit<
  GenericRecord,
  "id" | "dataCriacao" | "dataAtualizacao"
>;

// Re-export communication types for backward compatibility
export type Comunicacao = BaseRecord;
export type ComunicacaoForm = RecordForm;

// Export schemas for backward compatibility
export const comunicacaoSchema = baseRecordSchema;
export const comunicacaoFormSchema = recordFormSchema;
