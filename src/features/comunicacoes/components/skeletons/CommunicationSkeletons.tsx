import {
  Skeleton,
  SkeletonBox,
  SkeletonCircle,
  SkeletonLine,
} from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para a tabela de comunicações
export function CommunicationTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 rounded-lg border border-slate-200 p-5"
    >
      {/* Header da tabela */}
      <div className="grid grid-cols-5 gap-4 border-b pb-2">
        <SkeletonLine width="80%" />
        <SkeletonLine width="60%" />
        <SkeletonLine width="70%" />
        <SkeletonLine width="90%" />
        <SkeletonLine width="50%" />
      </div>

      {/* Linhas da tabela */}
      {Array.from({ length: rows }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="grid grid-cols-5 gap-4 border-b border-gray-100 py-3"
        >
          <SkeletonLine width="85%" />
          <SkeletonLine width="65%" />
          <SkeletonLine width="75%" />
          <SkeletonLine width="95%" />
          <div className="flex gap-2">
            <SkeletonCircle size={24} />
            <SkeletonCircle size={24} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// 🎯 Skeleton para o header da página
export function CommunicationHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex items-center justify-between"
    >
      <div className="space-y-2">
        <SkeletonLine width="100px" className="h-4" />
        <Skeleton width="200px" height={32} />
      </div>
      <SkeletonBox width="160px" height={40} />
    </motion.div>
  );
}

// 🎯 Skeleton para a barra de busca
export function CommunicationSearchSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4"
    >
      <SkeletonBox width="300px" height={40} />
    </motion.div>
  );
}

// 🎯 Skeleton para modal de comunicação
export function CommunicationModalSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 p-6"
    >
      {/* Título do modal */}
      <SkeletonLine width="200px" className="h-6" />

      {/* Campos do formulário */}
      <div className="space-y-4">
        <div>
          <SkeletonLine width="80px" className="mb-2 h-4" />
          <SkeletonBox width="100%" height={40} />
        </div>

        <div>
          <SkeletonLine width="60px" className="mb-2 h-4" />
          <SkeletonBox width="100%" height={40} />
        </div>

        <div>
          <SkeletonLine width="70px" className="mb-2 h-4" />
          <SkeletonBox width="100%" height={40} />
        </div>

        <div>
          <SkeletonLine width="90px" className="mb-2 h-4" />
          <SkeletonBox width="100%" height={120} />
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <SkeletonBox width="80px" height={40} />
        <SkeletonBox width="100px" height={40} />
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton completo da página de comunicações
export function CommunicationPageSkeleton() {
  return (
    <div
      className="mx-auto space-y-6 rounded-xl bg-white p-8 shadow-lg"
      data-testid="skeleton-page"
      aria-label="Carregando página de comunicações"
    >
      <CommunicationHeaderSkeleton />

      {/* Divider skeleton */}
      <Skeleton width="100%" height={1} className="my-6" />

      <CommunicationSearchSkeleton />
      <CommunicationTableSkeleton />
    </div>
  );
}

// 🎯 Skeleton para estados de erro
export function CommunicationErrorSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-4 py-12"
    >
      <SkeletonCircle size={64} />
      <SkeletonLine width="250px" className="h-6" />
      <SkeletonLine width="180px" className="h-4" />
      <SkeletonBox width="120px" height={40} className="mt-4" />
    </motion.div>
  );
}
