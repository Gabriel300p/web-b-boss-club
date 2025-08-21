import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonLine,
} from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para carregamento de rota/página - Similar ao layout real
export function RouteSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Breadcrumb skeleton */}
      <div className="mx-4 pt-6 md:mx-8 md:pt-8 lg:mx-16 lg:pt-12">
        <SkeletonLine width="100px" className="h-4" />
      </div>

      {/* Page content skeleton */}
      <main className="mx-4 py-6 md:mx-8 md:py-8 lg:mx-16 lg:py-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          {/* Header skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <SkeletonLine width="150px" className="h-7" />
            <SkeletonBox width="140px" height={36} className="rounded" />
          </div>

          {/* Search bar skeleton */}
          <div className="mb-6">
            <SkeletonBox width="300px" height={40} className="rounded" />
          </div>

          {/* Table skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
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
                className="grid grid-cols-6 gap-4 border-b border-slate-100 py-3 dark:border-slate-700"
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
        </div>
      </main>
    </div>
  );
}
