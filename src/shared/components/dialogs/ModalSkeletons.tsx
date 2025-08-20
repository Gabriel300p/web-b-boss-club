/**
 * 💀 Modal Skeletons
 * Loading states for modal components
 */
import { SkeletonBox, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton for ModalComunicacao
export function ModalComunicacaoSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <SkeletonLine width="200px" className="h-6" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Title field */}
        <div className="space-y-2">
          <SkeletonLine width="80px" className="h-4" />
          <SkeletonBox width="100%" height={40} className="rounded-md" />
        </div>

        {/* Author field */}
        <div className="space-y-2">
          <SkeletonLine width="60px" className="h-4" />
          <SkeletonBox width="100%" height={40} className="rounded-md" />
        </div>

        {/* Type field */}
        <div className="space-y-2">
          <SkeletonLine width="50px" className="h-4" />
          <SkeletonBox width="100%" height={40} className="rounded-md" />
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <SkeletonLine width="100px" className="h-4" />
          <SkeletonBox width="100%" height={100} className="rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-4">
        <SkeletonBox width="80px" height={36} className="rounded-md" />
        <SkeletonBox width="100px" height={36} className="rounded-md" />
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton for ModalDeleteConfirm
export function ModalDeleteConfirmSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <SkeletonLine width="180px" className="h-6" />
        <SkeletonLine width="90%" className="h-4" />
      </div>

      {/* Content */}
      <div className="space-y-2 py-4">
        <SkeletonLine width="100%" className="h-4" />
        <SkeletonLine width="80%" className="h-4" />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-2">
        <SkeletonBox width="80px" height={36} className="rounded-md" />
        <SkeletonBox width="100px" height={36} className="rounded-md" />
      </div>
    </motion.div>
  );
}
