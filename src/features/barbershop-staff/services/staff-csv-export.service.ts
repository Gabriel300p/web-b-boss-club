/**
 * 📊 Staff CSV Export Service
 * Serviço para exportação de colaboradores em CSV com todas as colunas
 */

import {
  exportToCSVWithMetadata,
  generateTimestamp,
} from "@shared/utils/csv.utils";
import { numberToCurrency } from "@shared/utils/currency.utils";
import { format } from "date-fns";
import type { BarbershopStaff } from "../schemas/barbershop-staff.schemas";

/**
 * Interface para linha do CSV com todas as colunas
 */
interface StaffCSVRow {
  // Dados básicos
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
  status: string;

  // Role e unidades
  cargo: string;
  unidades: string;
  unidade_principal: string;

  // Datas
  data_contratacao: string;
  data_criacao: string;

  // Métricas
  total_atendimentos: string;
  avaliacao_media: string;
  total_avaliacoes: string;
  receita_total: string;

  // Score
  score_total: string;
}

/**
 * Mapeia status para português
 */
function mapStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    SUSPENDED: "Suspenso",
    TERMINATED: "Desligado",
  };
  return statusMap[status] || status;
}

/**
 * Mapeia role para português
 */
function mapRole(role: string): string {
  const roleMap: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    BARBERSHOP_OWNER: "Proprietário",
    BARBER: "Barbeiro",
    CLIENT: "Cliente",
    PENDING: "Pendente",
  };
  return roleMap[role] || role;
}

/**
 * Formata data para o CSV
 */
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  try {
    return format(new Date(date), "dd/MM/yyyy");
  } catch {
    return "";
  }
}

/**
 * Converte colaborador para linha do CSV
 */
async function staffToCSVRow(staff: BarbershopStaff): Promise<StaffCSVRow> {
  // Dados básicos já disponíveis no objeto staff
  const analytics = {
    total_attendances: staff.total_attendances || 0,
    average_rating: staff.average_rating || null,
    total_revenue: staff.total_revenue || 0,
    score: staff.score || null,
    total_reviews: staff._count?.reviews || 0,
  };

  return {
    // Dados básicos
    nome: staff.first_name || "",
    sobrenome: staff.last_name || "",
    email: staff.user.email || "",
    telefone: staff.phone || "",
    cpf: staff.user.cpf || "",
    status: mapStatus(staff.status),

    // Role e unidades
    cargo: mapRole(staff.role_in_shop),
    unidades: staff.units?.map((u) => u.name).join("; ") || "",
    unidade_principal: staff.units?.find((u) => u.is_primary)?.name || "",

    // Datas
    data_contratacao: formatDate(staff.hire_date),
    data_criacao: formatDate(staff.created_at),

    // Métricas
    total_atendimentos: analytics.total_attendances.toString(),
    avaliacao_media: analytics.average_rating
      ? analytics.average_rating.toFixed(2)
      : "0",
    total_avaliacoes: analytics.total_reviews.toString(),
    receita_total: numberToCurrency(analytics.total_revenue || 0),

    // Score
    score_total: analytics.score?.toString() || "0",
  };
}

/**
 * Exporta colaboradores selecionados para CSV
 * Processa em chunks para melhor feedback visual em listas grandes
 */
export async function exportStaffToCSV(
  staffList: BarbershopStaff[],
  exportedBy?: string,
): Promise<void> {
  if (staffList.length === 0) {
    throw new Error("Nenhum colaborador selecionado para exportar");
  }

  // Para listas grandes, processar em chunks com pequeno delay
  // Isso permite que a UI atualize o loading state
  const CHUNK_SIZE = 100;
  const csvRows: StaffCSVRow[] = [];

  for (let i = 0; i < staffList.length; i += CHUNK_SIZE) {
    const chunk = staffList.slice(i, i + CHUNK_SIZE);
    const chunkRows = await Promise.all(
      chunk.map((staff) => staffToCSVRow(staff)),
    );
    csvRows.push(...chunkRows);

    // Pequeno delay para não bloquear a UI thread
    if (i + CHUNK_SIZE < staffList.length) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  // Gerar nome do arquivo com timestamp
  const timestamp = generateTimestamp();
  const filename = `colaboradores-${timestamp}.csv`;

  // Calcular estatísticas para metadados
  const activeCount = csvRows.filter((row) => row.status === "Ativo").length;
  const inactiveCount = csvRows.filter(
    (row) => row.status === "Inativo",
  ).length;

  // Exportar com metadados
  exportToCSVWithMetadata(
    csvRows as unknown as Record<string, unknown>[],
    filename,
    {
      exportedBy,
      totalRecords: staffList.length,
      customFields: {
        Ativos: activeCount.toString(),
        Inativos: inactiveCount.toString(),
        Sistema: "B-Boss Club - Gestão de Barbearias",
      },
    },
  );
}
