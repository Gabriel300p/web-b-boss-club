/**
 * 📊 Staff CSV Export Service
 * Serviço para exportação de colaboradores em CSV com todas as colunas
 */

import { exportToCSV, generateTimestamp } from "@shared/utils/csv.utils";
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

  // Score breakdown (se disponível)
  score_total: string;
  score_atendimentos: string;
  score_avaliacao: string;
  score_receita: string;
  rank_posicao: string;
  rank_percentil: string;
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
    receita_total: analytics.total_revenue
      ? `R$ ${analytics.total_revenue.toFixed(2)}`
      : "R$ 0,00",

    // Score (simplificado - score total disponível diretamente)
    score_total: analytics.score?.toString() || "0",
    score_atendimentos: "-",
    score_avaliacao: "-",
    score_receita: "-",
    rank_posicao: "-",
    rank_percentil: "-",
  };
}

/**
 * Exporta colaboradores selecionados para CSV
 */
export async function exportStaffToCSV(
  staffList: BarbershopStaff[],
): Promise<void> {
  if (staffList.length === 0) {
    throw new Error("Nenhum colaborador selecionado para exportar");
  }

  // Converter todos os colaboradores para linhas do CSV
  const csvRows = await Promise.all(
    staffList.map((staff) => staffToCSVRow(staff)),
  );

  // Gerar nome do arquivo com timestamp
  const timestamp = generateTimestamp();
  const filename = `colaboradores-${timestamp}.csv`;

  // Exportar (casting para Record<string, unknown>[] para compatibilidade)
  exportToCSV(csvRows as unknown as Record<string, unknown>[], filename);
}
