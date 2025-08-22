import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Static resources (can later be code-split per namespace)
import enUSCommon from "./locales/en-US/common.json";
import enUSRecords from "./locales/en-US/records.json";
import ptBRCommon from "./locales/pt-BR/common.json";
import ptBRRecords from "./locales/pt-BR/records.json";
// Feature-specific namespaces (statically bundled for now)
import enUSAuth from "@/features/auth/locales/en.json";
import ptBRAuth from "@/features/auth/locales/pt.json";
import enUSComunicacoes from "@/features/comunicacoes/i18n/en-US.json";
import ptBRComunicacoes from "@/features/comunicacoes/i18n/pt-BR.json";

export const DEFAULT_LOCALE = "pt-BR";
export const FALLBACK_LOCALE = "en-US";
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, FALLBACK_LOCALE];

// Language detection (simple): query > localStorage > navigator
function detectLocale(): string {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const params = new URLSearchParams(window.location.search);
  const qp = params.get("lang");
  if (qp && SUPPORTED_LOCALES.includes(qp)) return qp;
  const stored = localStorage.getItem("lang");
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
  const nav = navigator.language;
  if (SUPPORTED_LOCALES.includes(nav)) return nav;
  return DEFAULT_LOCALE;
}

export function setLocale(lang: string) {
  if (!SUPPORTED_LOCALES.includes(lang)) return;
  i18n.changeLanguage(lang);
  try {
    localStorage.setItem("lang", lang);
  } catch {
    /* noop */
  }
}

const resources = {
  "pt-BR": {
    common: ptBRCommon,
    records: ptBRRecords,
    comunicacoes: ptBRComunicacoes,
    auth: ptBRAuth,
  },
  "en-US": {
    common: enUSCommon,
    records: enUSRecords,
    comunicacoes: enUSComunicacoes,
    auth: enUSAuth,
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: detectLocale(),
      fallbackLng: FALLBACK_LOCALE,
      defaultNS: "common",
      ns: ["common", "records", "comunicacoes", "auth"],
      interpolation: { escapeValue: false },
      returnEmptyString: false,
      initImmediate: true,
      detection: { order: [] },
    })
    .catch((err: unknown) => {
      console.error("i18n init error", err);
    });
}

export default i18n;
