import { SkeletonCircle, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para cards/lista
export function CardListSkeleton({ items = 6 }: { items?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: items }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-3 rounded-lg bg-white p-4 shadow"
        >
          <div className="flex items-center gap-3">
            <SkeletonCircle size={40} />
            <div className="flex-1">
              <SkeletonLine width="70%" />
              <SkeletonLine width="50%" className="mt-1" />
            </div>
          </div>
          <SkeletonLine width="100%" />
          <SkeletonLine width="80%" />
        </motion.div>
      ))}
    </motion.div>
  );
}
