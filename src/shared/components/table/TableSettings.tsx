/**
 * ⚙️ TableSettings Component - SIMPLIFIED VERSION
 * Simple table configuration component with column visibility management
 * and localStorage persistence
 *
 * 🎨 Dark mode optimized with consistent UI patterns
 * 👁️ Focus on show/hide columns functionality
 * ♿ Improved accessibility and keyboard navigation
 */

import {
  ArrowClockwise,
  GearIcon,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Input } from "@shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { Separator } from "@shared/components/ui/separator";
import { useTableSettings } from "@shared/hooks/useTableSettings";
import { useToast } from "@shared/hooks/useToast";
import type { TableSettingsProps } from "@shared/types/table.types";

export const TableSettings = ({
  tableId,
  columnsFromApi,
  onChange,
  className,
}: TableSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { showToast } = useToast();

  const {
    settings,
    appliedColumns,
    updateSettings,
    resetSettings,
    saveSettings,
  } = useTableSettings(tableId, columnsFromApi);

  // Filter columns based on search term
  const filteredColumns = useMemo(() => {
    if (!searchTerm) return appliedColumns;

    return appliedColumns.filter((column) =>
      column.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [appliedColumns, searchTerm]);

  // Handle column visibility toggle
  const handleToggleVisibility = (columnId: string) => {
    const newVisibility = {
      ...settings.visibility,
      [columnId]: !settings.visibility[columnId],
    };
    updateSettings({ visibility: newVisibility });
  };

  // Handle reset to defaults
  const handleReset = () => {
    resetSettings();
    showToast({
      title: "Configurações resetadas",
      description:
        "As configurações da tabela foram restauradas para o padrão.",
      type: "success",
    });
  };

  // Handle save and close
  const handleSaveAndClose = () => {
    try {
      saveSettings();
      onChange({
        order: settings.order,
        visibility: settings.visibility,
      });
      setIsOpen(false);
      showToast({
        title: "Configurações salvas",
        description: "As configurações da tabela foram salvas com sucesso.",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      showToast({
        title: "Erro ao salvar",
        description:
          "Não foi possível salvar as configurações. Tente novamente.",
        type: "error",
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="md"
          className={cn(
            "gap-2 border-neutral-700/70 bg-neutral-900/50 py-2.5 text-sm text-neutral-200 transition-all duration-200 hover:border-neutral-600/70 hover:bg-neutral-800/70 hover:text-neutral-100 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20",
            className,
          )}
          aria-label="Configurar colunas da tabela"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <GearIcon className="size-6" weight="bold" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 border-neutral-700/70 bg-neutral-900 p-0 shadow-xl"
        align="end"
        role="dialog"
        aria-labelledby="table-settings-title"
        aria-describedby="table-settings-description"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-4">
            <h3
              id="table-settings-title"
              className="text-sm font-semibold text-neutral-100"
            >
              Configurar Colunas
            </h3>
            <p
              id="table-settings-description"
              className="text-xs text-neutral-400"
            >
              Marque para mostrar/ocultar colunas da tabela
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <MagnifyingGlass className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Buscar colunas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
              variant="search"
              aria-label="Buscar colunas"
            />
          </div>

          {/* Column List */}
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {filteredColumns.length === 0 ? (
              <div className="py-6 text-center text-sm text-neutral-400">
                Nenhuma coluna encontrada
              </div>
            ) : (
              filteredColumns.map((column) => (
                <div
                  key={column.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md border border-neutral-700/50 bg-neutral-800/50 p-3 transition-all duration-200 hover:border-neutral-600/70 hover:bg-neutral-700/50",
                    column.fixed && "border-neutral-600/70 bg-neutral-900/50",
                  )}
                >
                  {/* Visibility Checkbox */}
                  <div className="flex items-center">
                    <Checkbox
                      id={`visibility-${column.id}`}
                      checked={settings.visibility[column.id] ?? false}
                      onCheckedChange={() => handleToggleVisibility(column.id)}
                      disabled={column.fixed}
                      aria-describedby={
                        column.fixed
                          ? `fixed-indicator-${column.id}`
                          : undefined
                      }
                    />
                  </div>

                  {/* Column Label */}
                  <div className="flex-1">
                    <label
                      htmlFor={`visibility-${column.id}`}
                      className={cn(
                        "cursor-pointer text-sm font-medium text-neutral-200 transition-colors hover:text-neutral-100",
                        column.fixed && "text-neutral-400",
                      )}
                    >
                      {column.label}
                    </label>
                  </div>

                  {/* Fixed Column Indicator */}
                  {column.fixed && (
                    <div
                      id={`fixed-indicator-${column.id}`}
                      className="flex items-center text-neutral-500"
                      title="Coluna fixa - não pode ser ocultada"
                    >
                      <span className="text-xs">Fixa</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <Separator className="my-4 border-neutral-700/50" />

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
            >
              <ArrowClockwise className="h-4 w-4" />
              Reset
            </Button>

            <Button
              size="sm"
              onClick={handleSaveAndClose}
              className="gap-2 bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-400/20"
            >
              Salvar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
