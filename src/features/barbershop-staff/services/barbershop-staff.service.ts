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
  const response = await apiService.put<BarbershopStaff>(
    `/barbershop-staff/${id}`,
    data,
  );
  return response.data;
}

// 🗑️ Delete staff member
export async function deleteStaff(id: string): Promise<void> {
  await apiService.delete(`/barbershop-staff/${id}`);
}
