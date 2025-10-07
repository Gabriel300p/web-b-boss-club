import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Power, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onDownloadCSV?: () => void;
  isLimitReached?: boolean;
  maxLimit?: number;
  totalRecords?: number;
  isAllPagesSelected?: boolean;
  onToggleAllPages?: () => void;
  isLoadingAllPages?: boolean;
}

/**
 * 🎯 Barra de ações em lote para staff members
 *
 * Features:
 * - Animação slide up com Framer Motion
 * - Contador de itens selecionados
 * - Botões de ações em lote (desabilitados na Fase 1)
 * - Posicionamento fixed bottom
 * - Design responsivo
 */
export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onActivate,
  onDeactivate,
  onDownloadCSV,
  isLimitReached = false,
  maxLimit = 500,
  totalRecords,
  isAllPagesSelected = false,
  onToggleAllPages,
  isLoadingAllPages = false,
}: BulkActionsBarProps) {
  const { t } = useTranslation("barbershop-staff");

  // 🎯 Mostrar opção de selecionar todas as páginas apenas se:
  // 1. Tem mais registros que o selecionado atualmente
  // 2. Tem a função onToggleAllPages disponível
  const showSelectAllPages =
    totalRecords &&
    totalRecords > selectedCount &&
    !isAllPagesSelected &&
    onToggleAllPages;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex flex-col gap-3 rounded-lg border border-neutral-700 bg-neutral-800/95 px-6 py-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {/* Contador de selecionados */}
              <div className="flex items-center gap-2 border-r border-neutral-700 pr-4">
                <div className="bg-primary-500/20 text-primary-400 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                  {selectedCount}
                </div>
                <span className="text-sm font-medium text-neutral-200">
                  {t("bulkActions.itemsSelected", { count: selectedCount })}
                </span>
                {isLimitReached && (
                  <span className="ml-2 text-xs text-yellow-500">
                    {t("bulkActions.limitReached", { limit: maxLimit })}
                  </span>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex items-center gap-2">
                {/* Ativar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onActivate}
                  disabled={!onActivate}
                  className="gap-2"
                  title={
                    !onActivate
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.activate")
                  }
                >
                  <Power className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("bulkActions.activate")}
                  </span>
                </Button>

                {/* Desativar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDeactivate}
                  disabled={!onDeactivate}
                  className="gap-2"
                  title={
                    !onDeactivate
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.deactivate")
                  }
                >
                  <Power className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("bulkActions.deactivate")}
                  </span>
                </Button>

                {/* Download CSV */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownloadCSV}
                  disabled={!onDownloadCSV}
                  className="gap-2"
                  title={
                    !onDownloadCSV
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.downloadCSV")
                  }
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("bulkActions.downloadCSV")}
                  </span>
                </Button>

                {/* Separador */}
                <div className="mx-1 h-6 w-px bg-neutral-700" />

                {/* Limpar seleção */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="gap-2 text-neutral-400 hover:text-neutral-200"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("bulkActions.clearSelection")}
                  </span>
                </Button>
              </div>
            </div>

            {/* 🎯 Toggle para selecionar todas as páginas */}
            {showSelectAllPages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 border-t border-neutral-700 pt-3"
              >
                <Switch
                  checked={isAllPagesSelected}
                  onCheckedChange={onToggleAllPages}
                  disabled={isLoadingAllPages}
                />
                <label className="text-sm text-neutral-300">
                  {isLoadingAllPages
                    ? t("bulkActions.loadingAllPages")
                    : t("bulkActions.selectAllPages", {
                        total: Math.min(totalRecords || 0, maxLimit),
                      })}
                </label>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
