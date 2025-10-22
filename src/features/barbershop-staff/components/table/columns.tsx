import i18n from "@/app/i18n/init";
import { Badge } from "@shared/components/ui/badge";
import { Checkbox } from "@shared/components/ui/checkbox";
import TableSort from "@shared/components/ui/table-sort";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { getStatusBadge } from "../../helpers/column.helper";
import type { BarbershopStaff } from "../../schemas/barbershop-staff.schemas";
import { PerformanceCell } from "./cells/performance/PerformanceCell";
import { ScoreCellWithModal } from "./cells/score/ScoreCellWithModal";
import StaffAvatar from "./cells/StaffAvatar";
import { UnitsCell } from "./cells/UnitsCell";
import { StaffActions, type StaffActionHandlers } from "./columns-actions";

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
      header: ({ table }) => {
        const allPageRowsSelected = table.getIsAllPageRowsSelected();
        const somePageRowsSelected = table.getIsSomePageRowsSelected();

        // Estado do checkbox:
        // - indeterminate: alguns selecionados
        // - true: todos da página selecionados
        // - false: nenhum selecionado
        const checkedState = allPageRowsSelected
          ? true
          : somePageRowsSelected
            ? "indeterminate"
            : false;

        // Tooltip text baseado no estado
        const tooltipText = allPageRowsSelected
          ? t("bulkActions.deselectAll")
          : somePageRowsSelected
            ? t("bulkActions.selectAllPage")
            : t("bulkActions.selectAll");

        return (
          <div className="flex items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={checkedState}
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label={tooltipText}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                <p>{tooltipText}</p>
                {somePageRowsSelected && !allPageRowsSelected && (
                  <p className="text-neutral-400">
                    ({table.getSelectedRowModel().rows.length} de{" "}
                    {table.getRowModel().rows.length})
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
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
        const staffId = row.original.id;
        return (
          <div className="flex w-full justify-center">
            <UnitsCell staffId={staffId} units={units} />
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
        <TableSort column={column} align="center">
          {t("fields.performance")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const totalAttendances = row.original.total_attendances || 0;
        const averageRating = row.original.average_rating || null;
        const reviewCount = row.original._count?.reviews || 0;

        return (
          <div className="flex w-full justify-center text-center">
            <PerformanceCell
              totalAttendances={totalAttendances}
              averageRating={averageRating}
              reviewCount={reviewCount}
            />
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "score",
      accessorKey: "score",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.score")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const staffId = row.original.id;
        const score = row.original.score
          ? Number(row.original.score)
          : undefined;

        // 🆕 Dados reais para o tooltip
        const averageRating = row.original.average_rating || null;
        const totalReviews = row.original._count?.reviews || 0;
        const totalRevenue = row.original.total_revenue
          ? Number(row.original.total_revenue)
          : 0;
        const totalAttendances = row.original.total_attendances || 0;

        // Pegar nome e email do staff
        const displayName =
          row.original.display_name ||
          `${row.original.first_name}${row.original.last_name ? ` ${row.original.last_name}` : ""}`.trim();
        const email = row.original.user?.email || "";
        const avatarUrl = row.original.user?.avatar_url || null;

        // ✅ Usar o score_level que vem do backend (já calculado com os thresholds corretos)
        const scoreLevel = row.original.score_level || null;

        return (
          <div className="flex w-full justify-center text-center">
            <ScoreCellWithModal
              staffId={staffId}
              staffName={displayName}
              staffPhoto={avatarUrl}
              staffEmail={email}
              score={score !== undefined ? score : null}
              scoreLevel={scoreLevel}
              averageRating={averageRating}
              totalReviews={totalReviews}
              totalRevenue={totalRevenue}
              totalAttendances={totalAttendances}
              // 🎯 Score V3 data from backend
              barbershopSize={row.original.barbershop_size}
              targetAttendances={row.original.target_attendances}
              daysWorking={row.original.days_working}
              rampMultiplier={row.original.ramp_multiplier}
              isInRampPeriod={row.original.is_in_ramp_period}
            />
          </div>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const scoreA = rowA.original.score ? Number(rowA.original.score) : -1;
        const scoreB = rowB.original.score ? Number(rowB.original.score) : -1;
        return scoreA - scoreB;
      },
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
