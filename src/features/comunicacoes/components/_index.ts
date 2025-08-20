import { lazy } from "react";

// 🎯 Strategic Component Exports for Comunicacoes Feature
// Core components: loaded immediately, Heavy modal components: lazy-loaded

// Always-needed components (loaded immediately)
export { createColumns } from "./table/columns";
export { DataTable } from "./table/DataTable";
export { ComunicacoesToolbar } from "./toolbar/ComunicacoesToolbar";

// 🚀 Lazy-loaded Modal Components (only load when modals are opened)
export const ModalComunicacao = lazy(() =>
  import("./dialogs/ModalComunicacao").then((module) => ({
    default: module.ModalComunicacao,
  })),
);

export const ModalDeleteConfirm = lazy(() =>
  import("./dialogs/ModalDeleteConfirm").then((module) => ({
    default: module.ModalDeleteConfirm,
  })),
);

// 📝 For single imports (better tree-shaking), prefer direct imports:
// import { ModalComunicacao } from '@features/comunicacoes/components/ModalComunicacao';
// import { DataTable } from '@features/comunicacoes/components/DataTable';
