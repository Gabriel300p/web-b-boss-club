import i18n from "@/app/i18n/init";
import { PencilSimpleLineIcon, XCircleIcon } from "@shared/components/icons";
import { Button } from "@shared/components/ui/button";
import TableSort from "@shared/components/ui/table-sort";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Comunicacao } from "../../schemas/comunicacao.schemas";

interface ColumnsProps {
  onEdit: (comunicacao: Comunicacao) => void;
  onDelete: (comunicacao: Comunicacao) => void;
}

// 🚀 Optimized column creation
export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Comunicacao>[] => {
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
        <div className="text-center font-medium text-slate-600">
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
      accessorKey: "dataCriacao",
      header: ({ column }) => (
        <TableSort column={column} align="center">
          {t("fields.createdAt")}
        </TableSort>
      ),
      cell: ({ row }) => {
        const date = row.getValue("dataCriacao") as Date;
        return (
          <div className="text-center text-sm font-medium text-slate-600">
            {format(date, "dd/MM/yyyy", { locale: ptBR })}
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
          <div className="text-center text-sm font-medium text-slate-600">
            {format(date, "dd/MM/yyyy", { locale: ptBR })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: t("fields.actions"),
      size: 120, // Define uma largura fixa para a coluna
      cell: ({ row }) => {
        const comunicacao = row.original;

        return (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 -mr-1 h-10 w-10 p-0 transition-colors"
              aria-label={t("actions.edit", {
                defaultValue: "Editar comunicação",
              })}
              onClick={() => onEdit(comunicacao)}
            >
              <PencilSimpleLineIcon className="size-5" weight="fill" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              aria-label={t("actions.delete", {
                defaultValue: "Excluir comunicação",
              })}
              onClick={() => onDelete(comunicacao)}
            >
              <XCircleIcon weight="fill" className="size-5" />
            </Button>
          </div>
        );
      },
    },
  ];
};
