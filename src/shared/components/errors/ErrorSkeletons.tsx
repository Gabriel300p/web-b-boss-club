/**
 * 💀 Error Boundary Skeletons
 * Loading states for error handling components
 */
import { SkeletonBox, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton for Error Boundary fallback
export function ErrorBoundarySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-neutral-50 p-8"
    >
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        {/* Error icon placeholder */}
        <div className="flex justify-center">
          <SkeletonBox width={64} height={64} className="rounded-full" />
        </div>

        {/* Error title */}
        <div className="space-y-2 text-center">
          <SkeletonLine width="80%" className="mx-auto h-6" />
          <SkeletonLine width="60%" className="mx-auto h-4" />
        </div>

        {/* Error description */}
        <div className="space-y-2">
          <SkeletonLine width="100%" className="h-4" />
          <SkeletonLine width="90%" className="h-4" />
          <SkeletonLine width="70%" className="h-4" />
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 pt-4">
          <SkeletonBox width={100} height={40} className="rounded-md" />
          <SkeletonBox width={120} height={40} className="rounded-md" />
        </div>
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton for Toast loading state
export function ToastSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex w-full max-w-md items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg"
    >
      {/* Icon */}
      <SkeletonBox width={20} height={20} className="mt-0.5 rounded-full" />

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Title */}
        <SkeletonLine width="80%" className="h-4" />

        {/* Message */}
        <SkeletonLine width="100%" className="h-3" />
        <SkeletonLine width="60%" className="h-3" />
      </div>

      {/* Close button */}
      <SkeletonBox width={20} height={20} className="rounded" />
    </motion.div>
  );
}
