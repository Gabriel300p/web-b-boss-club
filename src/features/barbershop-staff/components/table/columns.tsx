import i18n from "@/app/i18n/init";
import TableSort from "@shared/components/ui/table-sort";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";
import { StaffActions, type StaffActionHandlers } from "./columns-actions";

// 🎯 Interface para props das colunas
type StaffColumnsProps = StaffActionHandlers;

// 🚀 Optimized column creation for barbershop staff
export const createColumns = ({
  onView,
  onEdit,
  onToggleStatus,
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
      id: "first_name",
      accessorKey: "first_name",
      header: ({ column }) => (
        <TableSort column={column} className="ml-5">
          {t("fields.name")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const staff = row.original;
        const lastName =
          staff.last_name && typeof staff.last_name === "string"
            ? staff.last_name
            : "";
        const fullName = `${staff.first_name} ${lastName}`.trim();
        const displayName =
          staff.display_name && typeof staff.display_name === "string"
            ? staff.display_name
            : fullName;

        return (
          <div className="ml-5 cursor-pointer font-medium text-neutral-100 hover:text-neutral-200">
            {displayName}
          </div>
        );
      },
    },
    {
      id: "user.email",
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
          <div className="text-center font-medium text-neutral-400">
            {staff.user.email}
          </div>
        );
      },
    },
    {
      id: "role_in_shop",
      accessorKey: "role_in_shop",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.role")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const role = row.getValue("role_in_shop") as string;

        // Definir cores baseadas no role (modo escuro)
        const getRoleStyles = (role: string) => {
          switch (role) {
            case "BARBER":
              return "bg-blue-900/30 text-blue-400 border border-blue-700/50";
            case "BARBERSHOP_OWNER":
              return "bg-purple-900/30 text-purple-400 border border-purple-700/50";
            case "SUPER_ADMIN":
              return "bg-red-900/30 text-red-400 border border-red-700/50";
            case "CLIENT":
              return "bg-green-900/30 text-green-400 border border-green-700/50";
            case "PENDING":
              return "bg-yellow-900/30 text-yellow-400 border border-yellow-700/50";
            default:
              return "bg-neutral-800/50 text-neutral-300 border border-neutral-600/50";
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
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.status")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        // Definir cores baseadas no status (modo escuro)
        const getStatusStyles = (status: string) => {
          switch (status) {
            case "ACTIVE":
              return "bg-green-900/30 text-green-400 border border-green-700/50";
            case "INACTIVE":
              return "bg-gray-900/30 text-gray-400 border border-gray-700/50";
            case "SUSPENDED":
              return "bg-yellow-900/30 text-yellow-400 border border-yellow-700/50";
            case "TERMINATED":
              return "bg-red-900/30 text-red-400 border border-red-700/50";
            default:
              return "bg-neutral-800/50 text-neutral-300 border border-neutral-600/50";
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
      id: "is_available",
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
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                isAvailable
                  ? "border-green-700/50 bg-green-900/30 text-green-400"
                  : "border-red-700/50 bg-red-900/30 text-red-400"
              }`}
            >
              {isAvailable
                ? t("availability.available")
                : t("availability.unavailable")}
            </span>
          </div>
        );
      },
    },
    {
      id: "hire_date",
      accessorKey: "hire_date",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.hireDate")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const hireDate = row.getValue("hire_date");

        // Verificar se é uma string válida e não é objeto vazio
        if (
          !hireDate ||
          typeof hireDate !== "string" ||
          hireDate.trim() === ""
        ) {
          return <div className="text-center text-sm text-neutral-400">-</div>;
        }

        try {
          const date = new Date(hireDate);
          // Verificar se a data é válida
          if (isNaN(date.getTime())) {
            return (
              <div className="text-center text-sm text-neutral-400">-</div>
            );
          }

          return (
            <div className="text-center text-sm text-neutral-500">
              {format(date, "dd/MM/yyyy", { locale: ptBR })}
            </div>
          );
        } catch (error) {
          console.error(error);
          return <div className="text-center text-sm text-neutral-400">-</div>;
        }
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("fields.actions")}</div>,
      cell: ({ row }) => {
        const staff = row.original;
        const handlers = { onView, onEdit, onToggleStatus };

        return (
          <div className="flex justify-center">
            <StaffActions staff={staff} handlers={handlers} t={t} />
          </div>
        );
      },
    },
  ];
};
