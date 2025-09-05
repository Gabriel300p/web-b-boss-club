import { SkeletonCircle, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para tabela genérica com suporte a modo escuro
export function TableSkeleton({
  columns = 5,
  rows = 5,
  hasActions = true,
}: {
  columns?: number;
  rows?: number;
  hasActions?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Header */}
      <div
        className="grid gap-4 border-b border-neutral-200 pb-2 dark:border-neutral-800"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }, (_, i) => (
          <SkeletonLine
            key={i}
            width={`${60 + (i % 3) * 20}%`}
            className="bg-neutral-200 dark:bg-neutral-800"
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="grid gap-4 border-b border-neutral-100 py-3 dark:border-neutral-800"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns - (hasActions ? 1 : 0) }, (_, j) => (
            <SkeletonLine
              key={j}
              width={`${70 + (j % 4) * 15}%`}
              className="bg-neutral-200 dark:bg-neutral-800"
            />
          ))}
          {hasActions && (
            <div className="flex gap-2">
              <SkeletonCircle
                size={24}
                className="bg-neutral-200 dark:bg-neutral-800"
              />
              <SkeletonCircle
                size={24}
                className="bg-neutral-200 dark:bg-neutral-800"
              />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
