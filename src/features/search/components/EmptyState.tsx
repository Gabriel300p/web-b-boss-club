/**
 * 🎨 EmptyState Component
 * Estado vazio inteligente com sugestões contextuais
 */

import {
  ClockClockwiseIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // 🌍 FASE 10

interface EmptyStateProps {
  type: "no-results" | "no-history" | "initial";
  query?: string;
  onClearHistory?: () => void; // Reservado para uso futuro
}

/**
 * 🎨 Estado vazio inteligente
 *
 * Tipos:
 * - "no-results": Sem resultados para a busca (mostra sugestões)
 * - "no-history": Histórico vazio (incentiva usar a busca)
 * - "initial": Estado inicial sem busca (dicas de uso)
 *
 * Features (FASE 9):
 * - Sugestões contextuais baseadas no tipo
 * - Ilustrações apropriadas
 * - CTAs relevantes
 * - Mensagens motivacionais
 * - Acessibilidade completa
 *
 * Features (FASE 10):
 * - Internacionalização completa pt-BR/en-US
 */
export function EmptyState({ type, query }: EmptyStateProps) {
  const { t } = useTranslation("search"); // 🌍 FASE 10

  // 🔍 FASE 9: Sem resultados para busca
  if (type === "no-results" && query) {
    // Detectar tipo de busca para sugestões inteligentes
    const isNumeric = /^\d+$/.test(query);
    const isEmail = /@/.test(query);
    const hasSpaces = query.includes(" ");

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
        role="status"
        aria-live="polite"
      >
        {/* Ícone */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <MagnifyingGlassIcon className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        {/* Título */}
        <h3 className="mb-2 text-base font-semibold text-neutral-900 dark:text-white">
          {t("search.emptyState.noResults.title")}
        </h3>

        {/* Descrição */}
        <p className="mb-6 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
          {t("search.emptyState.noResults.description")}{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            "{query}"
          </span>
        </p>

        {/* 🎯 FASE 9: Sugestões contextuais inteligentes */}
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="mb-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t("search.emptyState.noResults.tipsTitle")}
          </p>
          <ul className="space-y-2 text-left text-xs text-neutral-600 dark:text-neutral-400">
            {isNumeric && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>{t("search.emptyState.noResults.tips.numeric")}</span>
              </li>
            )}
            {isEmail && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>{t("search.emptyState.noResults.tips.email")}</span>
              </li>
            )}
            {hasSpaces && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>{t("search.emptyState.noResults.tips.multiWord")}</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              <span>{t("search.emptyState.noResults.tips.general")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              <span>{t("search.emptyState.noResults.tips.spelling")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              <span>{t("search.emptyState.noResults.tips.keywords")}</span>
            </li>
          </ul>
        </div>

        {/* Sugestões rápidas */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-500">
            {t("search.emptyState.noResults.popularPages")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {t("search.emptyState.noResults.suggestions.staff")}
            </span>
            <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {t("search.emptyState.noResults.suggestions.appointments")}
            </span>
            <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {t("search.emptyState.noResults.suggestions.settings")}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 📜 FASE 9: Histórico vazio (nunca usou a busca)
  if (type === "no-history") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
        role="status"
      >
        {/* Ícone */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
          <ClockClockwiseIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
        </div>

        {/* Título */}
        <h3 className="mb-2 text-base font-semibold text-neutral-900 dark:text-white">
          {t("search.emptyState.noHistory.title")}
        </h3>

        {/* Descrição */}
        <p className="mb-6 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
          {t("search.emptyState.noHistory.description")}
        </p>

        {/* 🎯 FASE 9: Incentivo com ícone motivacional */}
        <div className="w-full max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/10">
          <div className="mb-2 flex items-center justify-center gap-2">
            <SparkleIcon
              className="h-4 w-4 text-yellow-600 dark:text-yellow-500"
              weight="fill"
            />
            <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-400">
              {t("search.emptyState.noHistory.motivational.title")}
            </p>
          </div>
          <p className="text-xs text-yellow-800 dark:text-yellow-500">
            {t("search.emptyState.noHistory.motivational.description")}
          </p>
        </div>

        {/* Atalhos úteis */}
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t("search.emptyState.noHistory.shortcuts")}
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">
                {t("search.emptyState.noHistory.shortcuts.openSearch")}
              </span>
              <kbd className="rounded bg-neutral-200 px-2 py-1 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Ctrl+K
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">
                {t("search.emptyState.noHistory.shortcuts.navigate")}
              </span>
              <kbd className="rounded bg-neutral-200 px-2 py-1 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                ↑ ↓
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">
                {t("search.emptyState.noHistory.shortcuts.clear")}
              </span>
              <kbd className="rounded bg-neutral-200 px-2 py-1 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Ctrl+Backspace
              </kbd>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ✨ FASE 9: Estado inicial (modal aberto sem query e sem histórico)
  if (type === "initial") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        {/* Ícone com gradiente */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20">
          <MagnifyingGlassIcon
            className="h-10 w-10 text-yellow-600 dark:text-yellow-500"
            weight="duotone"
          />
        </div>

        {/* Título */}
        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
          {t("search.emptyState.initial.title")}
        </h3>

        {/* Descrição */}
        <p className="mb-8 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
          {t("search.emptyState.initial.description")}
        </p>

        {/* 🎯 FASE 9: Categorias disponíveis */}
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800">
              <UsersIcon
                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                weight="duotone"
              />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
              {t("search.emptyState.initial.categories.staff.title")}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {t("search.emptyState.initial.categories.staff.description")}
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                weight="duotone"
              />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
              {t("search.emptyState.initial.categories.pages.title")}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {t("search.emptyState.initial.categories.pages.description")}
            </p>
          </div>
        </div>

        {/* Dica de começar */}
        <div className="mt-8 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
          <SparkleIcon className="h-4 w-4" weight="fill" />
          <span>{t("search.emptyState.initial.hint")}</span>
        </div>
      </motion.div>
    );
  }

  return null;
}
