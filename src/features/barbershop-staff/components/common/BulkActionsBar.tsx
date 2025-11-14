import { Button } from "@/shared/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, Power, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StaffStatusModal } from "../dialogs/StaffStatusModal";

export type BulkActionType = "activate" | "inactivate";

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onActivate?: (ids: string[]) => void;
  onInactivate?: (ids: string[]) => void;
  onDownloadCSV?: () => void;
  isLimitReached?: boolean;
  maxLimit?: number;
  totalRecords?: number;
  isAllPagesSelected?: boolean;
  onToggleAllPages?: () => void;
  isLoadingAllPages?: boolean;
  isActivating?: boolean;
  isInactivating?: boolean;
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
  onInactivate,
  onDownloadCSV,
  isLimitReached = false,
  maxLimit = 500,
  totalRecords,
  isLoadingAllPages = false,
  isActivating = false,
  isInactivating = false,
  isExportingCSV = false,
}: BulkActionsBarProps) {
  const { t } = useTranslation("barbershop-staff");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<BulkActionType>("activate");

  // 🎯 Loading state global (qualquer operação em andamento)
  const isLoading =
    isActivating || isInactivating || isLoadingAllPages || isExportingCSV;

  // 🎯 Handlers de diálogo
  const handleOpenDialog = (action: BulkActionType) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (dialogAction === "activate") {
      onActivate?.(selectedIds);
    } else {
      onInactivate?.(selectedIds);
    }
    setDialogOpen(false);
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex flex-col gap-3 rounded-lg border border-neutral-700/70 bg-neutral-800/95 px-5 py-3 shadow-lg ring-1 shadow-neutral-900/50 ring-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {/* Contador de selecionados */}
              <div className="flex items-center gap-2 border-r border-neutral-700 pr-4">
                <div className="flex flex-col">
                  {/* 🎯 Contador com destaque em amarelo */}
                  <span className="text-sm font-semibold text-neutral-300">
                    <span className="text-yellow-400">{selectedCount}</span>
                    {" de "}
                    {totalRecords}
                    {" selecionado"}
                    {selectedCount !== 1 && "s"}
                  </span>
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
                  className="gap-2 transition-all hover:bg-green-600/20 hover:text-green-400 hover:shadow-md hover:shadow-green-500/20"
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

                {/* Inativar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog("inactivate")}
                  disabled={!onInactivate || isLoading}
                  className="gap-2 transition-all hover:bg-red-600/20 hover:text-red-400 hover:shadow-md hover:shadow-red-500/20"
                  title={
                    !onInactivate
                      ? t("bulkActions.comingSoon")
                      : t("bulkActions.inactivate")
                  }
                >
                  {isInactivating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {t("bulkActions.inactivate")}
                  </span>
                </Button>

                {/* Download CSV */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownloadCSV}
                  disabled={!onDownloadCSV || isLoading}
                  className="gap-2 transition-all hover:bg-yellow-600/20 hover:text-yellow-400 hover:shadow-md hover:shadow-yellow-500/20"
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
          </div>
        </motion.div>
      )}

      {/* 🎯 Modal de confirmação (StaffStatusModal unificado) */}
      <StaffStatusModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
        count={selectedCount}
        isBulk={true}
        isActivating={dialogAction === "activate"}
        staff={null}
      />
    </AnimatePresence>
  );
}
