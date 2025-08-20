import type { ZodErrorMap } from "zod";
import { z } from "zod";

// Pass-through global error map (placeholder for future global i18n)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zodI18nErrorMap = ((_issue: any, ctx: any) => ({
  message: ctx.defaultError,
})) as ZodErrorMap;
z.setErrorMap(zodI18nErrorMap);
