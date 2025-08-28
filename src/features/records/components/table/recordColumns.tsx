import i18n from "@/app/i18n/init";
import { PencilSimpleLineIcon, XCircleIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import TableSort from "@shared/components/ui/table-sort";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BaseRecord } from "../../schemas/record.schemas";

interface RecordColumnsProps {
  onEdit: (record: BaseRecord) => void;
  onDelete: (record: BaseRecord) => void;
}

// 🚀 Optimized column creation for records
export const createRecordColumns = ({
  onEdit,
  onDelete,
}: RecordColumnsProps): ColumnDef<BaseRecord>[] => {
  const t = i18n.getFixedT(i18n.language, "records");
  const typeMap: Record<string, string> = {
    Comunicado: t("form.types.comunicado", { defaultValue: "Comunicado" }),
    Aviso: t("form.types.aviso", { defaultValue: "Aviso" }),
    Notícia: t("form.types.noticia", { defaultValue: "Notícia" }),
  };

  return [
    {
      accessorKey: "titulo",
      header: ({ column }) => (
        <TableSort column={column} className="ml-5">
          {t("fields.title")}
        </TableSort>
      ),
      cell: ({ row }) => (
        <div className="text-primary hover:text-primary/80 ml-5 cursor-pointer font-medium">
          {row.getValue("titulo")}
        </div>
      ),
    },
    {
      accessorKey: "autor",
      enableSorting: true,
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.author")}
        </TableSort>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium text-neutral-600">
          {row.getValue("autor")}
        </div>
      ),
    },
    {
      accessorKey: "tipo",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.type")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const tipo = row.getValue("tipo") as string;

        // Definir cores baseadas no tipo
        const getTypeStyles = (tipo: string) => {
          switch (tipo) {
            case "Comunicado":
              return "bg-sky-100 text-sky-700";
            case "Aviso":
              return "bg-yellow-100 text-yellow-700";
            case "Notícia":
              return "bg-green-100 text-green-700";
            default:
              return "bg-neutral-100 text-neutral-700";
          }
        };

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeStyles(
                tipo,
              )}`}
            >
              {typeMap[tipo] || tipo}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "descricao",
      header: ({ column }) => (
        <TableSort column={column}>{t("fields.description")}</TableSort>
      ),
      cell: ({ row }) => {
        const descricao = row.getValue("descricao") as string;
        return (
          <div className="max-w-xs truncate text-neutral-600" title={descricao}>
            {descricao}
          </div>
        );
      },
    },
    {
      accessorKey: "dataCriacao",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.createdAt")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const date = row.getValue("dataCriacao") as Date;
        return (
          <div className="text-center text-sm text-neutral-500">
            {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
          </div>
        );
      },
    },
    {
      accessorKey: "dataAtualizacao",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.updatedAt")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const date = row.getValue("dataAtualizacao") as Date;
        return (
          <div className="text-center text-sm text-neutral-500">
            {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("fields.actions")}</div>,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(record)}
              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              aria-label={t("actions.edit")}
              title={t("actions.edit")}
            >
              <PencilSimpleLineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(record)}
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
