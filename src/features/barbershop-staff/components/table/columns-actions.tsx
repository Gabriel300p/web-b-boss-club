import {
  DotsThreeOutlineIcon,
  EyeIcon,
  PowerIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { PencilSimpleLineIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import { memo } from "react";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";

// 🎯 Tipos de ações disponíveis
const StaffActionType = {
  VIEW: "view",
  EDIT: "edit",
  TOGGLE_STATUS: "toggle_status",
} as const;

type StaffActionType = (typeof StaffActionType)[keyof typeof StaffActionType];

// 🎯 Interface para handlers de ações
export interface StaffActionHandlers {
  onView: (staff: BarbershopStaff) => void;
  onEdit: (staff: BarbershopStaff) => void;
  onToggleStatus: (staff: BarbershopStaff) => void;
}

// 🎯 Interface para item de ação
interface ActionItem {
  type: StaffActionType;
  label: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  iconWeight?: string;
  isVisible: (staff: BarbershopStaff) => boolean;
  className?: string;
  textClassName?: string;
}

// 🎯 Função utilitária para obter ações disponíveis
const getAvailableActions = (
  staff: BarbershopStaff,
  t: (key: string, options?: { defaultValue?: string }) => string,
): ActionItem[] => {
  const isActive = staff.status === "ACTIVE";

  // Construir nome do staff com fallback robusto
  const firstName = staff.first_name || "";
  const lastName = staff.last_name || "";
  const displayName = staff.display_name || "";
  const staffName =
    displayName || `${firstName} ${lastName}`.trim() || "este barbeiro";

  // Construir labels ANTES de passar para t()
  const inactivateLabel = `Inativar ${staffName}`;
  const activateLabel = `Ativar ${staffName}`;

  // 🎯 Grupo 1: Ações de visualização e edição
  const viewEditActions: ActionItem[] = [
    {
      type: StaffActionType.VIEW,
      label: t("actions.view", { defaultValue: "Visualizar" }),
      icon: EyeIcon as React.ComponentType<{
        className?: string;
        weight?: string;
      }>,
      isVisible: () => true,
      className: "text-white hover:bg-neutral-700/50",
      textClassName: "text-neutral-100 font-semibold",
      iconWeight: "bold",
    },
    {
      type: StaffActionType.EDIT,
      label: t("actions.edit", {
        defaultValue: "Alterar informações do barbeiro",
      }),
      icon: PencilSimpleLineIcon as React.ComponentType<{
        className?: string;
        weight?: string;
      }>,
      isVisible: () => true,
      className: "text-white hover:bg-neutral-700/50",
      textClassName: "text-white font-semibold",
      iconWeight: "bold",
    },
  ];

  // 🎯 Grupo 2: Ações de status
  const statusActions: ActionItem[] = [
    {
      type: StaffActionType.TOGGLE_STATUS,
      label: isActive
        ? t("actions.inactivate", { defaultValue: inactivateLabel })
        : t("actions.activate", { defaultValue: activateLabel }),
      icon: isActive
        ? (TrashIcon as React.ComponentType<{
            className?: string;
            weight?: string;
          }>)
        : (PowerIcon as React.ComponentType<{
            className?: string;
            weight?: string;
          }>),
      isVisible: () => true,
      className: isActive
        ? "text-red-400 hover:bg-red-900/20"
        : "text-green-400 hover:bg-green-900/20",
      textClassName: isActive
        ? "text-red-400 font-semibold"
        : "text-green-400 font-semibold",
      iconWeight: "bold",
    },
  ];

  // 🎯 Combinar ações em grupos
  const actions = [
    ...viewEditActions.filter((action) => action.isVisible(staff)),
    ...statusActions.filter((action) => action.isVisible(staff)),
  ];

  return actions.filter((action) => action.isVisible(staff));
};

// 🎯 Componente de ações com dropdown
export const StaffActions = memo(
  ({
    staff,
    handlers,
    t,
  }: {
    staff: BarbershopStaff;
    handlers: StaffActionHandlers;
    t: (key: string, options?: { defaultValue?: string }) => string;
  }) => {
    const availableActions = getAvailableActions(staff, t);

    const handleAction = (actionType: StaffActionType) => {
      switch (actionType) {
        case StaffActionType.VIEW:
          handlers.onView(staff);
          break;
        case StaffActionType.EDIT:
          handlers.onEdit(staff);
          break;
        case StaffActionType.TOGGLE_STATUS:
          handlers.onToggleStatus(staff);
          break;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-neutral-300 hover:bg-neutral-600/50 hover:text-neutral-200"
            aria-label={t("actions.more", { defaultValue: "Mais ações" })}
            title={availableActions.map((action) => action.label).join(", ")}
          >
            <DotsThreeOutlineIcon weight="fill" className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-44 border-neutral-700 bg-neutral-800"
        >
          {/* 🎯 Grupo 1: Visualizar e Editar */}
          {availableActions
            .filter(
              (action) =>
                action.type === StaffActionType.VIEW ||
                action.type === StaffActionType.EDIT,
            )
            .map((action) => {
              const IconComponent = action.icon;
              return (
                <DropdownMenuItem
                  key={action.type}
                  onClick={() => handleAction(action.type)}
                  className={`cursor-pointer ${action.className || ""} py-2.5 focus:bg-neutral-700/50`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      weight={action.iconWeight}
                      className={`h-4 w-4 ${action.textClassName?.split(" ")[0] || "text-white"}`}
                    />
                    <span className={action.textClassName || ""}>
                      {action.label}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}

          {/* 🎯 Separador entre grupos */}
          {availableActions.some(
            (action) =>
              action.type === StaffActionType.VIEW ||
              action.type === StaffActionType.EDIT,
          ) &&
            availableActions.some(
              (action) => action.type === StaffActionType.TOGGLE_STATUS,
            ) && <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-700" />}

          {/* 🎯 Grupo 2: Ativar/Inativar */}
          {availableActions
            .filter((action) => action.type === StaffActionType.TOGGLE_STATUS)
            .map((action) => {
              const IconComponent = action.icon;
              return (
                <DropdownMenuItem
                  key={action.type}
                  onClick={() => handleAction(action.type)}
                  className={`cursor-pointer ${action.className || ""} py-2.5 focus:bg-neutral-700/50`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      weight={action.iconWeight}
                      className={`h-4 w-4 ${action.textClassName?.split(" ")[0] || "text-white"}`}
                    />
                    <span className={action.textClassName || ""}>
                      {action.label}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

StaffActions.displayName = "StaffActions";
