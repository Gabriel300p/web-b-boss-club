import { SkeletonBox, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para a toolbar de filtros
export function FilterToolbarSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Search bar skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonBox width="320px" height={40} className="rounded-md" />
        <SkeletonLine width="120px" className="h-4" />
      </div>

      {/* Filter buttons skeleton */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SkeletonBox width="80px" height={40} className="rounded-md" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton individual para filtro
export function FilterSkeleton({ width = "80px" }: { width?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <SkeletonBox width={width} height={40} className="rounded-md" />
    </motion.div>
  );
}

// 🎯 Skeleton para DatePicker
export function DatePickerSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <SkeletonBox width="140px" height={40} className="rounded-md" />
    </motion.div>
  );
}
