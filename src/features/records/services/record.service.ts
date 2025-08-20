/**
 * 🌐 Generic Record Service
 * CRUD operations for the generic records feature
 */
import type { BaseRecord, RecordForm } from "../schemas/record.schemas";

// Mock data for development
const mockRecords: BaseRecord[] = [
  {
    id: "1",
    titulo: "Welcome to Records",
    autor: "System Admin",
    tipo: "Comunicado",
    descricao:
      "This is a sample record to demonstrate the generic records feature.",
    dataCriacao: new Date("2024-01-15"),
    dataAtualizacao: new Date("2024-01-15"),
  },
  {
    id: "2",
    titulo: "Feature Update",
    autor: "Development Team",
    tipo: "Notícia",
    descricao:
      "The records feature has been successfully generalized for reuse across different domains.",
    dataCriacao: new Date("2024-01-16"),
    dataAtualizacao: new Date("2024-01-16"),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// CRUD operations
export async function fetchRecords(): Promise<BaseRecord[]> {
  await delay(500);
  return [...mockRecords];
}

export async function createRecord(data: RecordForm): Promise<BaseRecord> {
  await delay(300);
  const newRecord: BaseRecord = {
    id: `record-${Date.now()}`,
    ...data,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
  };
  mockRecords.push(newRecord);
  return newRecord;
}

export async function updateRecord(
  id: string,
  data: RecordForm,
): Promise<BaseRecord> {
  await delay(300);
  const index = mockRecords.findIndex((record) => record.id === id);
  if (index === -1) {
    throw new Error(`Record with id ${id} not found`);
  }
  const updatedRecord: BaseRecord = {
    ...mockRecords[index],
    ...data,
    dataAtualizacao: new Date(),
  };
  mockRecords[index] = updatedRecord;
  return updatedRecord;
}

export async function deleteRecord(id: string): Promise<void> {
  await delay(200);
  const index = mockRecords.findIndex((record) => record.id === id);
  if (index === -1) {
    throw new Error(`Record with id ${id} not found`);
  }
  mockRecords.splice(index, 1);
}
