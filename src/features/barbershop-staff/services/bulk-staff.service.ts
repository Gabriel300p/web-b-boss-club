/**
 * 🔄 Bulk Operations Service
 * Operações em massa para colaboradores
 */
import { apiService } from "@shared/services/api.service";

// 📋 Types
export interface BulkOperationError {
  id: string;
  message: string;
}

export interface BulkOperationResult {
  success: number;
  failed: number;
  total: number;
  errors?: BulkOperationError[];
  updated_ids: string[];
  skipped?: number;
  skipped_ids?: string[];
}

export interface BulkStaffIdsRequest {
  ids: string[];
}

// 🚀 Ativar colaboradores em massa
export async function bulkActivateStaff(
  ids: string[],
): Promise<BulkOperationResult> {
  const response = await apiService.patch<BulkOperationResult>(
    "/barbershop-staff/bulk/activate",
    { ids },
  );
  return response.data;
}

// 🛑 Inativar colaboradores em massa
export async function bulkDeactivateStaff(
  ids: string[],
): Promise<BulkOperationResult> {
  const response = await apiService.patch<BulkOperationResult>(
    "/barbershop-staff/bulk/deactivate",
    { ids },
  );
  return response.data;
}
