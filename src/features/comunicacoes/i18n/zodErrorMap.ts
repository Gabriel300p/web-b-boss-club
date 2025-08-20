import i18n from "@/app/i18n/init";
import type { ZodErrorMap, ZodTypeAny } from "zod";

// Localized error map (wrapped cast to satisfy evolving zod types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const comunicacoesErrorMap = ((issue: any, ctx: any) => {
  const t = i18n.getFixedT(i18n.language, "comunicacoes");
  const path: (string | number)[] = Array.isArray(issue?.path)
    ? issue.path
    : [];
  switch (issue.code) {
    case "too_small": {
      const min = Number(issue.minimum ?? 0);
      if (path.includes("titulo")) {
        return { message: t("validation.title.min", { count: min }) };
      }
      if (path.includes("autor")) {
        return { message: t("validation.author.min", { count: min }) };
      }
      if (path.includes("descricao")) {
        return { message: t("validation.description.min", { count: min }) };
      }
      return { message: ctx.defaultError };
    }
    case "too_big": {
      const max = Number(issue.maximum ?? 0);
      if (path.includes("titulo")) {
        return { message: t("validation.title.max", { count: max }) };
      }
      if (path.includes("autor")) {
        return { message: t("validation.author.max", { count: max }) };
      }
      if (path.includes("descricao")) {
        return { message: t("validation.description.max", { count: max }) };
      }
      return { message: ctx.defaultError };
    }
    case "invalid_enum_value": {
      if (path.includes("tipo")) {
        return { message: t("validation.type.enum") };
      }
      return { message: ctx.defaultError };
    }
    default: {
      return { message: issue.message || ctx.defaultError };
    }
  }
}) as ZodErrorMap;

export function applyComunicacoesErrorMap<T extends ZodTypeAny>(schema: T): T {
  (schema as unknown as { _def: { errorMap?: ZodErrorMap } })._def.errorMap =
    comunicacoesErrorMap;
  return schema;
}
