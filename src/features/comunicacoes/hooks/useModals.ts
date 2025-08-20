import { useState } from "react";
import type { Comunicacao } from "../schemas/comunicacao.schemas";

export function useModals() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedComunicacao, setSelectedComunicacao] =
    useState<Comunicacao | null>(null);

  const openAddModal = () => {
    setSelectedComunicacao(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (comunicacao: Comunicacao) => {
    setSelectedComunicacao(comunicacao);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (comunicacao: Comunicacao) => {
    setSelectedComunicacao(comunicacao);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedComunicacao(null);
  };

  return {
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedComunicacao,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
  };
}
