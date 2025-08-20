import { z } from "zod";
import { applyComunicacoesErrorMap } from "../i18n/zodErrorMap";

// 🎯 Schema principal para Comunicação (entidade completa)
export const comunicacaoSchema = applyComunicacoesErrorMap(
  z.object({
    id: z.string(),
    titulo: z
      .string()
      .min(1, { message: "validation.title.required" })
      .min(3, { message: "validation.title.min" })
      .max(100, { message: "validation.title.max" }),
    autor: z
      .string()
      .min(1, { message: "validation.author.required" })
      .min(2, { message: "validation.author.min" })
      .max(50, { message: "validation.author.max" }),
    tipo: z.enum(["Comunicado", "Aviso", "Notícia"], {
      message: "validation.type.enum",
    }),
    descricao: z
      .string()
      .min(1, { message: "validation.description.required" })
      .min(10, { message: "validation.description.min" })
      .max(1000, { message: "validation.description.max" }),
    dataCriacao: z.date(),
    dataAtualizacao: z.date(),
  }),
);

// 🎯 Schema para formulário (sem id e datas - gerados automaticamente)
export const comunicacaoFormSchema = applyComunicacoesErrorMap(
  z.object({
    titulo: z
      .string()
      .min(1, { message: "validation.title.required" })
      .min(3, { message: "validation.title.min" })
      .max(100, { message: "validation.title.max" })
      .trim(), // Sanitização automática
    autor: z
      .string()
      .min(1, { message: "validation.author.required" })
      .min(2, { message: "validation.author.min" })
      .max(50, { message: "validation.author.max" })
      .trim(), // Sanitização automática
    tipo: z.enum(["Comunicado", "Aviso", "Notícia"], {
      message: "validation.type.enum",
    }),
    descricao: z
      .string()
      .min(1, { message: "validation.description.required" })
      .min(10, { message: "validation.description.min" })
      .max(1000, { message: "validation.description.max" })
      .trim(), // Sanitização automática
  }),
);

// 🎯 Schema para criação (igual ao form, mas pode ter id opcional para otimistic updates)
export const comunicacaoCreateSchema = comunicacaoFormSchema.extend({
  id: z.string().optional(),
});

// 🎯 Schema para atualização (todos os campos opcionais exceto pelo menos um)
export const comunicacaoUpdateSchema = applyComunicacoesErrorMap(
  comunicacaoFormSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "validation.update.atLeastOne",
    }),
);

// 🎯 Tipos inferidos dos schemas (única fonte da verdade)
export type Comunicacao = z.infer<typeof comunicacaoSchema>;
export type ComunicacaoForm = z.infer<typeof comunicacaoFormSchema>;
export type ComunicacaoCreate = z.infer<typeof comunicacaoCreateSchema>;
export type ComunicacaoUpdate = z.infer<typeof comunicacaoUpdateSchema>;

// 🎯 Para retrocompatibilidade (deprecated - usar os novos tipos)
/** @deprecated Use ComunicacaoForm instead */
export type ComunicacaoFormData = ComunicacaoForm;
