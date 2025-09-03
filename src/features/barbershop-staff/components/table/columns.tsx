import i18n from "@/app/i18n/init";
import { PencilSimpleLineIcon, XCircleIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import TableSort from "@shared/components/ui/table-sort";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";

interface StaffColumnsProps {
  onEdit: (staff: BarbershopStaff) => void;
  onDelete: (staff: BarbershopStaff) => void;
}

// 🚀 Optimized column creation for barbershop staff
export const createStaffColumns = ({
  onEdit,
  onDelete,
}: StaffColumnsProps): ColumnDef<BarbershopStaff>[] => {
  const t = i18n.getFixedT(i18n.language, "barbershop-staff");

  const statusMap: Record<string, string> = {
    ACTIVE: t("status.active", { defaultValue: "Ativo" }),
    INACTIVE: t("status.inactive", { defaultValue: "Inativo" }),
    SUSPENDED: t("status.suspended", { defaultValue: "Suspenso" }),
    TERMINATED: t("status.terminated", { defaultValue: "Demitido" }),
  };

  const roleMap: Record<string, string> = {
    BARBER: t("roles.barber", { defaultValue: "Barbeiro" }),
    BARBERSHOP_OWNER: t("roles.owner", { defaultValue: "Proprietário" }),
    SUPER_ADMIN: t("roles.superAdmin", { defaultValue: "Super Admin" }),
    CLIENT: t("roles.client", { defaultValue: "Cliente" }),
    PENDING: t("roles.pending", { defaultValue: "Pendente" }),
  };

  return [
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <TableSort column={column} className="ml-5">
          {t("fields.name")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const staff = row.original;
        const fullName = `${staff.first_name} ${staff.last_name || ""}`.trim();
        const displayName = staff.display_name || fullName;

        return (
          <div className="text-primary hover:text-primary/80 ml-5 cursor-pointer font-medium">
            {displayName}
          </div>
        );
      },
    },
    {
      accessorKey: "user.email",
      enableSorting: true,
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.email")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="text-center font-medium text-neutral-600">
            {staff.user.email}
          </div>
        );
      },
    },
    {
      accessorKey: "role_in_shop",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.role")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const role = row.getValue("role_in_shop") as string;

        // Definir cores baseadas no role
        const getRoleStyles = (role: string) => {
          switch (role) {
            case "BARBER":
              return "bg-blue-100 text-blue-700";
            case "BARBERSHOP_OWNER":
              return "bg-purple-100 text-purple-700";
            case "SUPER_ADMIN":
              return "bg-red-100 text-red-700";
            case "CLIENT":
              return "bg-green-100 text-green-700";
            case "PENDING":
              return "bg-yellow-100 text-yellow-700";
            default:
              return "bg-neutral-100 text-neutral-700";
          }
        };

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleStyles(
                role,
              )}`}
            >
              {roleMap[role] || role}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.status")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        // Definir cores baseadas no status
        const getStatusStyles = (status: string) => {
          switch (status) {
            case "ACTIVE":
              return "bg-green-100 text-green-700";
            case "INACTIVE":
              return "bg-gray-100 text-gray-700";
            case "SUSPENDED":
              return "bg-yellow-100 text-yellow-700";
            case "TERMINATED":
              return "bg-red-100 text-red-700";
            default:
              return "bg-neutral-100 text-neutral-700";
          }
        };

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(
                status,
              )}`}
            >
              {statusMap[status] || status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "is_available",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.available")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const isAvailable = row.getValue("is_available") as boolean;
        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? "Disponível" : "Indisponível"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "hire_date",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.hireDate")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const hireDate = row.getValue("hire_date") as string;
        if (!hireDate) {
          return <div className="text-center text-sm text-neutral-400">-</div>;
        }
        return (
          <div className="text-center text-sm text-neutral-500">
            {format(new Date(hireDate), "dd/MM/yyyy", { locale: ptBR })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("fields.actions")}</div>,
      cell: ({ row }) => {
        const staff = row.original;

        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(staff)}
              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              aria-label={t("actions.edit")}
              title={t("actions.edit")}
            >
              <PencilSimpleLineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(staff)}
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              aria-label={t("actions.delete")}
              title={t("actions.delete")}
            >
              <XCircleIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
