import i18n from "@/app/i18n/init";
import { Badge } from "@shared/components/ui/badge";
import TableSort from "@shared/components/ui/table-sort";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getAvailabilityBadge,
  getRoleBadge,
  getStatusBadge,
} from "../../helpers/column.helper";
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
        const badgeConfig = getRoleBadge(role, t);

        return (
          <div className="flex justify-center">
            <Badge {...badgeConfig} />
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
        const badgeConfig = getStatusBadge(status, t);

        return (
          <div className="flex justify-center">
            <Badge {...badgeConfig} />
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
        const badgeConfig = getAvailabilityBadge(isAvailable, t);

        return (
          <div className="flex justify-center">
            <Badge {...badgeConfig} />
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
