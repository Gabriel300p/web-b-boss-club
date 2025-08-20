import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonLine,
} from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para tabela de records
export function RecordTableSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
      data-testid="skeleton-records-table"
      aria-label="Carregando tabela de records"
    >
      {/* Table header */}
      <div className="grid grid-cols-6 gap-4 border-b pb-2">
        <SkeletonLine width="80%" className="h-4" />
        <SkeletonLine width="60%" className="h-4" />
        <SkeletonLine width="70%" className="h-4" />
        <SkeletonLine width="90%" className="h-4" />
        <SkeletonLine width="65%" className="h-4" />
        <SkeletonLine width="50%" className="h-4" />
      </div>

      {/* Table rows */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="grid grid-cols-6 gap-4 border-b border-slate-100 py-3"
        >
          <SkeletonLine width="85%" className="h-4" />
          <SkeletonLine width="70%" className="h-4" />
          <SkeletonLine width="60%" className="h-4" />
          <SkeletonLine width="95%" className="h-4" />
          <SkeletonLine width="50%" className="h-4" />
          <div className="flex gap-2">
            <SkeletonCircle size={20} />
            <SkeletonCircle size={20} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// 🎯 Skeleton para header da página
export function RecordHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
      data-testid="skeleton-records-header"
      aria-label="Carregando cabeçalho de records"
    >
      <div className="space-y-2">
        <SkeletonLine width="100px" className="h-3" />
        <SkeletonLine width="200px" className="h-6" />
      </div>
      <SkeletonBox width="140px" height={40} className="rounded" />
    </motion.div>
  );
}

// 🎯 Skeleton para área de busca
export function RecordSearchSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
      data-testid="skeleton-records-search"
      aria-label="Carregando filtros de records"
    >
      <div className="flex items-center justify-between">
        <SkeletonBox width="300px" height={40} className="rounded" />
        <SkeletonLine width="80px" className="h-4" />
      </div>

      <div className="flex gap-2">
        <SkeletonBox width="120px" height={32} className="rounded-sm" />
        <SkeletonBox width="140px" height={32} className="rounded-sm" />
        <SkeletonBox width="160px" height={32} className="rounded-sm" />
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton para modal de record
export function RecordModalSkeleton() {
  return (
    <div className="space-y-4 p-4" data-testid="skeleton-records-modal">
      <div className="space-y-2">
        <SkeletonLine width="60px" className="h-4" />
        <SkeletonBox width="100%" height={40} className="rounded" />
      </div>

      <div className="space-y-2">
        <SkeletonLine width="40px" className="h-4" />
        <SkeletonBox width="100%" height={40} className="rounded" />
      </div>

      <div className="space-y-2">
        <SkeletonLine width="35px" className="h-4" />
        <SkeletonBox width="100%" height={40} className="rounded" />
      </div>

      <div className="space-y-2">
        <SkeletonLine width="70px" className="h-4" />
        <SkeletonBox width="100%" height={80} className="rounded" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <SkeletonBox width="80px" height={36} className="rounded" />
        <SkeletonBox width="100px" height={36} className="rounded" />
      </div>
    </div>
  );
}

// 🎯 Skeleton completo da página de records
export function RecordPageSkeleton() {
  return (
    <div
      className="mx-auto space-y-6 rounded-xl bg-white p-8 shadow-lg"
      data-testid="skeleton-records-page"
      aria-label="Carregando página de records"
    >
      <RecordHeaderSkeleton />

      {/* Divider skeleton */}
      <SkeletonLine width="100%" className="my-6 h-px" />

      <RecordSearchSkeleton />
      <RecordTableSkeleton />
    </div>
  );
}

// 🎯 Skeleton para estados de erro
export function RecordErrorSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-4 py-8"
      data-testid="skeleton-records-error"
      aria-label="Erro ao carregar records"
    >
      <SkeletonCircle size={64} />
      <div className="space-y-2 text-center">
        <SkeletonLine width="200px" className="h-5" />
        <SkeletonLine width="150px" className="h-4" />
      </div>
      <SkeletonBox width="120px" height={36} className="rounded" />
    </motion.div>
  );
}
