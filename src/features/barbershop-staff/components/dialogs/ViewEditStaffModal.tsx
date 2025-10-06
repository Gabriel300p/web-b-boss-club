/**
 * 🔍✏️ View/Edit Staff Modal - Modal unificada para visualizar/editar
 * Modal com sidebar (sem progress) + formulário usando StaffForm
 */
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { EyeIcon, PencilIcon, UserIcon } from "lucide-react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useBarbershopStaff,
  useStaffDetail,
} from "../../hooks/useBarbershopStaff";
import type { CreateStaffMinimalFormData } from "../../schemas/barbershop-staff.schemas";
import { StaffForm, type StaffFormMode } from "../form/StaffForm";

interface ViewEditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string | null;
  mode: "view" | "edit";
}

/**
 * Modal para visualizar ou editar colaborador
 */
export const ViewEditStaffModal = memo(function ViewEditStaffModal({
  isOpen,
  onClose,
  staffId,
  mode,
}: ViewEditStaffModalProps) {
  const { t } = useTranslation("barbershop-staff");
  const [isUpdating, setIsUpdating] = useState(false);

  // 🎯 Buscar dados do staff usando useStaffDetail
  const { updateStaff } = useBarbershopStaff();
  const { staff: staffData, isLoading, error } = useStaffDetail(staffId || "");

  // 🎯 React Query já gerencia o refetch automaticamente quando staffId muda

  // Handler de submit do formulário
  const handleFormSubmit = async (data: CreateStaffMinimalFormData) => {
    if (!staffId || mode === "view") return;

    setIsUpdating(true);

    try {
      // Split nome completo em first_name e last_name
      const nameParts = data.full_name.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ") || undefined;

      // Atualizar staff
      await updateStaff(staffId, {
        first_name,
        last_name,
        phone: data.phone?.trim() || undefined,
        status: data.status,
        internal_notes: data.description?.trim() || undefined,
      });

      // Fechar modal após sucesso
      onClose();
    } catch (error) {
      console.error("Error updating staff:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // 🎯 Determinar título e ícone da sidebar
  const getSidebarContent = () => {
    if (mode === "view") {
      return {
        title: t("modals.viewStaff.title", {
          defaultValue: "Visualizar Colaborador",
        }),
        subtitle: t("modals.viewStaff.subtitle", {
          defaultValue: "Informações detalhadas do colaborador",
        }),
        icon: EyeIcon,
      };
    }
    return {
      title: t("modals.editStaff.title", {
        defaultValue: "Editar Colaborador",
      }),
      subtitle: t("modals.editStaff.subtitle", {
        defaultValue: "Atualize as informações do colaborador",
      }),
      icon: PencilIcon,
    };
  };

  const sidebarContent = getSidebarContent();
  const IconComponent = sidebarContent.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="h-[85vh] !w-[50vw] !max-w-[1400px] gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <div className="flex h-full w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
          {/* Sidebar - Informações */}
          <div className="w-[280px] flex-shrink-0 border-r border-neutral-800 bg-neutral-950 p-6">
            {/* Header da Sidebar */}
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAC82B]/10">
                  <IconComponent className="h-5 w-5 text-[#FAC82B]" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAC82B]/10">
                  <UserIcon className="h-5 w-5 text-[#FAC82B]" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-neutral-50">
                {sidebarContent.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                {sidebarContent.subtitle}
              </p>
            </div>

            {/* Informações do Staff */}
            {staffData && !isLoading && (
              <div className="space-y-4">
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                  <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    {t("modals.viewStaff.staffInfo", {
                      defaultValue: "Informações",
                    })}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-neutral-500">
                        {t("fields.name")}
                      </p>
                      <p className="text-sm font-medium text-neutral-200">
                        {[staffData.first_name, staffData.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">
                        {t("fields.email")}
                      </p>
                      <p className="text-sm font-medium text-neutral-200">
                        {staffData.user?.email || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">
                        {t("fields.role")}
                      </p>
                      <p className="text-sm font-medium text-neutral-200">
                        {t(`roles.${staffData.role_in_shop.toLowerCase()}`, {
                          defaultValue: staffData.role_in_shop,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {mode === "edit" && (
                  <div className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-4">
                    <p className="text-xs text-amber-400">
                      {t("modals.editStaff.hint", {
                        defaultValue:
                          "CPF e email não podem ser alterados por questões de segurança.",
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FAC82B] border-t-transparent" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-lg border border-red-800/30 bg-red-950/20 p-4">
                <p className="text-xs text-red-400">
                  {t("modals.viewStaff.error", {
                    defaultValue: "Erro ao carregar dados do colaborador",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Conteúdo - Formulário */}
          <div className="flex-1 overflow-hidden">
            {staffData && !isLoading && (
              <StaffForm
                mode={mode as StaffFormMode}
                initialData={staffData}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isLoading={isUpdating}
              />
            )}

            {/* Loading state do formulário */}
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#FAC82B] border-t-transparent" />
                  <p className="text-sm text-neutral-400">
                    {t("modals.viewStaff.loading", {
                      defaultValue: "Carregando dados...",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Error state do formulário */}
            {error && !isLoading && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-red-400">
                    {t("modals.viewStaff.error", {
                      defaultValue: "Erro ao carregar dados do colaborador",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
