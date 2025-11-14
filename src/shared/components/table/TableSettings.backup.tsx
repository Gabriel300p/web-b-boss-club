/**
 * ⚙️ TableSettings Component - BACKUP VERSION
 * Complete table configuration component with drag-and-drop column reordering
 * and visibility management with localStorage persistence
 *
 * 🎨 Dark mode optimized with consistent UI patterns
 * 🚀 Enhanced drag and drop with better UX
 * ♿ Improved accessibility and keyboard navigation
 */

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowClockwise,
  GearIcon,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { SortableItem } from "@shared/components/table/SortableItem";
import { Button } from "@shared/components/ui/button";
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const { showToast } = useToast();

  const {
    settings,
    appliedColumns,
    updateSettings,
    resetSettings,
    saveSettings,
  } = useTableSettings(tableId, columnsFromApi);

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for better responsiveness
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Filter columns based on search term
  const filteredColumns = useMemo(() => {
    if (!searchTerm) return appliedColumns;

    return appliedColumns.filter((column) =>
      column.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [appliedColumns, searchTerm]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag end - reorder columns
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active and over columns
    const activeColumn = appliedColumns.find((col) => col.id === activeId);
    const overColumn = appliedColumns.find((col) => col.id === overId);

    // Don't allow reordering if either column is fixed
    if (activeColumn?.fixed || overColumn?.fixed) {
      return;
    }

    // Get current order from appliedColumns (which respects the current order)
    const currentOrder = appliedColumns.map((col) => col.id);
    const oldIndex = currentOrder.indexOf(activeId);
    const newIndex = currentOrder.indexOf(overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      updateSettings({ order: newOrder });
    }
  };

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

  // Get active column for drag overlay
  const activeColumn = activeId
    ? appliedColumns.find((col) => col.id === activeId)
    : null;

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
              Arraste para reordenar e marque para mostrar/ocultar colunas
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

          {/* Sortable Column List */}
          <div className="max-h-64 space-y-2 overflow-y-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredColumns.map((col) => col.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredColumns.length === 0 ? (
                  <div className="py-6 text-center text-sm text-neutral-400">
                    Nenhuma coluna encontrada
                  </div>
                ) : (
                  filteredColumns.map((column) => (
                    <SortableItem
                      key={column.id}
                      id={column.id}
                      column={column}
                      isVisible={settings.visibility[column.id] ?? false}
                      onToggleVisibility={handleToggleVisibility}
                      isDragging={activeId === column.id}
                    />
                  ))
                )}
              </SortableContext>

              {/* Drag Overlay */}
              <DragOverlay>
                {activeColumn && (
                  <div className="rounded-md border border-neutral-600/70 bg-neutral-800 p-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6" /> {/* Spacer for drag handle */}
                      <div className="text-sm font-medium text-neutral-200">
                        {activeColumn.label}
                      </div>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
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
