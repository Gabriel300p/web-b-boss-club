/**
 * 🌐 Barbershop Staff Service
 * CRUD operations for barbershop staff management
 */
import { apiService } from "@shared/services/api.service";
import type {
  BarbershopStaff,
  CreateStaffFormData,
  CreateStaffResponse,
  StaffFilters,
  StaffListResponse,
  StaffStatsResponse,
  UpdateStaffFormData,
} from "../schemas/barbershop-staff.schemas";

// 🔍 Query parameters builder
function buildQueryParams(filters: StaffFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Basic filters
  if (filters.status) params.append("status", filters.status);
  if (filters.is_available !== undefined)
    params.append("is_available", String(filters.is_available));
  if (filters.barbershop_id)
    params.append("barbershop_id", filters.barbershop_id);
  if (filters.role_in_shop) params.append("role_in_shop", filters.role_in_shop);

  // Advanced filters
  if (filters.search) params.append("search", filters.search);
  if (filters.hired_after) params.append("hired_after", filters.hired_after);
  if (filters.hired_before) params.append("hired_before", filters.hired_before);
  if (filters.available_for_booking !== undefined) {
    params.append(
      "available_for_booking",
      String(filters.available_for_booking),
    );
  }

  // Pagination and sorting
  params.append("page", String(filters.page || 1));
  params.append("limit", String(filters.limit || 10));
  params.append("sort_by", filters.sort_by || "created_at");
  params.append("sort_order", filters.sort_order || "desc");

  return params;
}

// 📊 Fetch staff list with filters
export async function fetchStaffList(
  filters: StaffFilters = {},
): Promise<StaffListResponse> {
  const defaultFilters: StaffFilters = {
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  };
  const mergedFilters = { ...defaultFilters, ...filters };
  const params = buildQueryParams(mergedFilters);
  const response = await apiService.get<StaffListResponse>(
    `/barbershop-staff?${params.toString()}`,
  );
  return response.data;
}

// 📈 Fetch staff statistics
export async function fetchStaffStats(
  barbershopId?: string,
): Promise<StaffStatsResponse> {
  const params = new URLSearchParams();
  if (barbershopId) params.append("barbershop_id", barbershopId);

  const response = await apiService.get<StaffStatsResponse>(
    `/barbershop-staff/stats?${params.toString()}`,
  );
  return response.data;
}

// 🔍 Fetch single staff member
export async function fetchStaffById(id: string): Promise<BarbershopStaff> {
  const response = await apiService.get<BarbershopStaff>(
    `/barbershop-staff/${id}`,
  );
  return response.data;
}

// ➕ Create new staff member
export async function createStaff(
  data: CreateStaffFormData,
): Promise<CreateStaffResponse> {
  const response = await apiService.post<CreateStaffResponse>(
    "/barbershop-staff",
    data,
  );
  return response.data;
}

// 📝 Update staff member
export async function updateStaff(
  id: string,
  data: UpdateStaffFormData,
): Promise<BarbershopStaff> {
  const response = await apiService.patch<BarbershopStaff>(
    `/barbershop-staff/${id}`,
    data,
  );
  return response.data;
}

// 🗑️ Delete staff member
export async function deleteStaff(id: string): Promise<void> {
  await apiService.delete(`/barbershop-staff/${id}`);
}

// 🔄 Toggle staff status (ACTIVE ↔️ INACTIVE)
export async function toggleStaffStatus(id: string): Promise<BarbershopStaff> {
  const response = await apiService.delete<BarbershopStaff>(
    `/barbershop-staff/${id}`,
  );
  return response.data;
}

// 🎯 Fetch all staff IDs (for bulk selection)
export async function fetchAllStaffIds(
  filters: StaffFilters = {},
): Promise<string[]> {
  const params = buildQueryParams({
    ...filters,
    limit: 500, // Limite máximo
    page: 1,
  });
  const response = await apiService.get<StaffListResponse>(
    `/barbershop-staff?${params.toString()}`,
  );
  return response.data.data.map((staff) => staff.id);
}

// 🚀 Score V3: Tipos
export interface ScoreV3Response {
  staffId: string;
  staffName: string;
  daysWorking: number;
  barbershopSize: "SMALL" | "MEDIUM" | "LARGE";
  sizeConfidence: number;
  targetAttendances: number;
  rampMultiplier: number;
  score: number;
  scoreLevel:
    | "critical"
    | "needs_improvement"
    | "regular"
    | "good"
    | "excellent";
  color: string;
  breakdown: {
    ratingScore: number;
    volumeScore: number;
    totalBonuses: number;
    bonusDetails: {
      recency: number;
      consistency: number;
      validation: number;
      ticketAverage: number;
      retention: number;
    };
  };
  metrics: {
    averageRating: number | null;
    totalReviews: number;
    totalAttendances: number;
    attendancePercentage: number;
  };
  comparisonV2: {
    scoreV2: number;
    improvement: number;
    improvementPercentage: number;
  };
}

// 🚀 Score V3: Fetch score with dynamic targets
export async function fetchStaffScoreV3(
  staffId: string,
): Promise<ScoreV3Response> {
  const response = await apiService.get<ScoreV3Response>(
    `/barbershop-staff/${staffId}/score-v3`,
  );
  return response.data;
}

// 📊 Score V3: Tipos do Breakdown Detalhado
export interface ScoreComponent {
  value: number;
  percentage: number;
  description: string;
  icon?: string;
}

export interface BonusDetails {
  name: string;
  value: number;
  achieved: boolean;
  reason: string;
  progress: number;
  tip?: string;
}

export interface PenaltyDetails {
  name: string;
  value: number;
  applied: boolean;
  reason: string;
  tip?: string;
}

export interface ScoreBreakdownDetailed {
  // Base info
  score: number;
  scoreLevel: "critical" | "good" | "excellent";
  color: "green" | "yellow" | "red";
  lastUpdated: string;

  // Quick breakdown (para tooltip)
  quickBreakdown: {
    rating: ScoreComponent;
    volume: ScoreComponent;
    totalBonuses: number;
    totalPenalties: number;
  };

  // Detailed breakdown (para modal)
  detailedBreakdown: {
    rating: {
      component: ScoreComponent;
      averageRating: number;
      totalReviews: number;
      starDistribution: {
        "5": number;
        "4": number;
        "3": number;
        "2": number;
        "1": number;
      };
    };
    volume: {
      component: ScoreComponent;
      totalAttendances: number;
      targetAttendances: number;
      achievementPercentage: number;
      dailyAverage: number;
    };
    bonuses: {
      recency: BonusDetails;
      consistency: BonusDetails;
      validation: BonusDetails;
      momentum: BonusDetails;
    };
    penalties: {
      lowRating: PenaltyDetails;
      inactivity: PenaltyDetails;
    };
    calculation: {
      formula: string;
      steps: Array<{
        step: number;
        description: string;
        calculation: string;
        result: number;
      }>;
    };
  };

  // History
  history: Array<{
    date: string;
    score: number;
    level: string;
  }>;

  // Insights
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };

  // V3 specific (retornado pelo backend mas não está no tipo base)
  staffId?: string;
  staffName?: string;
  insufficientData?: boolean;
  insufficientDataReason?: string;
  barbershopSize?: "SMALL" | "MEDIUM" | "LARGE";
  targetAttendances?: number;
  isInRampPeriod?: boolean;
  daysWorking?: number;
}

// 📊 Score V3: Fetch breakdown detalhado (para modal)
export async function getStaffScoreBreakdown(
  staffId: string,
): Promise<ScoreBreakdownDetailed> {
  const response = await apiService.get<ScoreBreakdownDetailed>(
    `/barbershop-staff/${staffId}/score-breakdown`,
  );
  console.log("📊 [Frontend] Resposta da API breakdown:", response.data);
  console.log(
    "📊 [Frontend] detailedBreakdown:",
    response.data.detailedBreakdown,
  );
  return response.data;
}

// Export service object
export const barbershopStaffService = {
  fetchStaffList,
  fetchStaffStats,
  fetchStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  fetchAllStaffIds,
  fetchStaffScoreV3,
  getStaffScoreBreakdown,
};
