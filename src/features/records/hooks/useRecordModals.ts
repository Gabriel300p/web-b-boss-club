import { useCallback, useState } from "react";
import type { BaseRecord } from "../schemas/record.schemas";

export function useRecordModals() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BaseRecord | null>(null);

  const openAddModal = useCallback(() => {
    setSelectedRecord(null);
    setIsAddModalOpen(true);
  }, []);

  const openEditModal = useCallback((record: BaseRecord) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((record: BaseRecord) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRecord(null);
  }, []);

  return {
    // State
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedRecord,

    // Actions
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
  };
}
