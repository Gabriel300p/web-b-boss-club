import i18n from "@/app/i18n/init";
import { Badge } from "@shared/components/ui/badge";
import { Checkbox } from "@shared/components/ui/checkbox";
import TableSort from "@shared/components/ui/table-sort";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStatusBadge } from "../../helpers/column.helper";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";
import { StaffActions, type StaffActionHandlers } from "./columns-actions";
import { PerformanceCell } from "./PerformanceCell";
import StaffAvatar from "./StaffAvatar";
import { UnitsCell } from "./UnitsCell";

// 🎯 Interface para props das colunas
type StaffColumnsProps = StaffActionHandlers & {
  // Bulk selection props (optional - Fase 1)
  enableBulkSelection?: boolean;
};

// 🚀 Optimized column creation for barbershop staff
export const createColumns = ({
  onView,
  onEdit,
  onToggleStatus,
  enableBulkSelection = false,
}: StaffColumnsProps): ColumnDef<BarbershopStaff>[] => {
  const t = i18n.getFixedT(i18n.language, "barbershop-staff");

  const columns: ColumnDef<BarbershopStaff>[] = [];

  // 🎯 Checkbox column (TanStack Table nativo)
  if (enableBulkSelection) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t("bulkActions.selectAll")}
          />
        </div>
      ),
      cell: ({ row, table }) => {
        // 🔍 DEBUG: Check table state directly
        const tableState = table.getState().rowSelection;
        const isInTableState = tableState[row.id] === true;
        return (
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              checked={isInTableState}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value);
              }}
              aria-label={t("bulkActions.selectRow")}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    });
  }

  columns.push(
    // 1. Nome/Email (staff_info)
    {
      id: "staff_info",
      accessorKey: "first_name",
      header: ({ column }) => (
        <TableSort column={column}>
          {t("fields.name")} / {t("fields.email")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const staff = row.original;

        // Usa display_name se existir, senão concatena first_name + last_name
        const displayName =
          staff.display_name ||
          `${staff.first_name}${staff.last_name ? ` ${staff.last_name}` : ""}`.trim();

        const email = staff.user?.email || "";
        const avatarUrl = staff.user?.avatar_url || null;

        return (
          <div className="flex items-center gap-3">
            <StaffAvatar
              firstName={staff.first_name}
              lastName={staff.last_name}
              avatarUrl={avatarUrl}
            />
            <div className="flex flex-col">
              <span className="font-medium text-neutral-100">
                {displayName}
              </span>
              <span className="text-sm text-neutral-400">{email}</span>
            </div>
          </div>
        );
      },
    },

    // 2. 🆕 Unidades (units)
    {
      id: "units",
      accessorKey: "units",
      header: () => <div className="text-center">{t("fields.units")}</div>,
      cell: ({ row }) => {
        const units = row.original.units || [];
        return (
          <div className="flex w-full justify-center">
            <UnitsCell units={units} />
          </div>
        );
      },
      enableSorting: false,
    },

    // 3. 🆕 Performance (total_attendances + average_rating)
    {
      id: "performance",
      accessorKey: "total_attendances",
      header: ({ column }) => (
        <TableSort column={column}>{t("fields.performance")}</TableSort>
      ),
      cell: ({ row }) => {
        const totalAttendances = row.original.total_attendances || 0;
        const averageRating = row.original.average_rating || null;

        return (
          <PerformanceCell
            totalAttendances={totalAttendances}
            averageRating={averageRating}
          />
        );
      },
      enableSorting: true,
    },

    // 4. 🆕 Receita Total (total_revenue)
    {
      id: "total_revenue",
      accessorKey: "total_revenue",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.totalRevenue")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const revenue = row.original.total_revenue || 0;

        return (
          <div className="text-center">
            <span className="text-sm font-medium text-neutral-100">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Math.abs(revenue))}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },

    // 6. 🆕 Data de Admissão (hire_date) - Melhor formatação
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
            <div className="text-center text-sm text-neutral-100">
              {format(date, "dd/MM/yyyy", { locale: ptBR })}
            </div>
          );
        } catch (error) {
          console.error(error);
          return <div className="text-center text-sm text-neutral-400">-</div>;
        }
      },
      enableSorting: true,
    },

    // 5. Status
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
    // 7. Ações
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
      enableSorting: false,
      enableHiding: false,
    },
  );

  return columns;
};
