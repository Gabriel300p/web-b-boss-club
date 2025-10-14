import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, Power, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfirmBulkActionDialog,
  type BulkActionType,
} from "../dialogs/ConfirmBulkActionDialog";

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onActivate?: (ids: string[]) => void;
  onDeactivate?: (ids: string[]) => void;
  onDownloadCSV?: () => void;
  isLimitReached?: boolean;
  maxLimit?: number;
  totalRecords?: number;
  isAllPagesSelected?: boolean;
  onToggleAllPages?: () => void;
  isLoadingAllPages?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
  isExportingCSV?: boolean;
}

/**
 * 🎯 Barra de ações em lote para staff members
 *
 * Features:
 * - Animação slide up com Framer Motion
 * - Contador de itens selecionados
 * - Botões de ações em lote com confirmação
 * - Loading states durante operações
 * - Posicionamento fixed bottom
 * - Design responsivo
 */
export function BulkActionsBar({
  selectedCount,
  selectedIds,
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
  isActivating = false,
  isDeactivating = false,
  isExportingCSV = false,
}: BulkActionsBarProps) {
  const { t } = useTranslation("barbershop-staff");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<BulkActionType>("activate");

  // 🎯 Loading state global (qualquer operação em andamento)
  const isLoading =
    isActivating || isDeactivating || isLoadingAllPages || isExportingCSV;

  // 🎯 Handlers de diálogo
  const handleOpenDialog = (action: BulkActionType) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    setDialogOpen(false);
    if (dialogAction === "activate") {
      onActivate?.(selectedIds);
    } else {
      onDeactivate?.(selectedIds);
    }
  };

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
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-200">
                    {t("bulkActions.itemsSelected", { count: selectedCount })}
                  </span>
                  {/* 🎯 Indicador de seleção entre páginas (Opção C) */}
                  {totalRecords && totalRecords > selectedCount && (
                    <span className="text-xs text-neutral-400">
                      {t("bulkActions.ofTotal", {
                        selected: selectedCount,
                        total: totalRecords,
                      })}
                    </span>
                  )}
                  {isAllPagesSelected && (
                    <span className="text-xs text-yellow-500">
                      {t("bulkActions.allPagesSelected")}
                    </span>
                  )}
                </div>
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
                  onClick={() => handleOpenDialog("activate")}
                  disabled={!onActivate || isLoading}
                  className="gap-2"
                  title={
                    !onActivate
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.activate")
                  }
                >
                  {isActivating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {t("bulkActions.activate")}
                  </span>
                </Button>

                {/* Desativar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog("deactivate")}
                  disabled={!onDeactivate || isLoading}
                  className="gap-2"
                  title={
                    !onDeactivate
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.deactivate")
                  }
                >
                  {isDeactivating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {t("bulkActions.deactivate")}
                  </span>
                </Button>

                {/* Download CSV */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownloadCSV}
                  disabled={!onDownloadCSV || isLoading}
                  className="gap-2"
                  title={
                    !onDownloadCSV
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.downloadCSV")
                  }
                >
                  {isExportingCSV ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
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
                  disabled={isLoading}
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

      {/* 🎯 Diálogo de confirmação */}
      <ConfirmBulkActionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
        actionType={dialogAction}
        count={selectedCount}
        isLoading={isActivating || isDeactivating}
      />
    </AnimatePresence>
  );
}
