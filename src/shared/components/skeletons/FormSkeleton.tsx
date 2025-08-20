import { SkeletonBox, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton para formulário genérico
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {Array.from({ length: fields }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-2"
        >
          <SkeletonLine width={`${60 + (i % 3) * 20}px`} className="h-4" />
          <SkeletonBox width="100%" height={40} />
        </motion.div>
      ))}

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <SkeletonBox width="80px" height={40} />
        <SkeletonBox width="100px" height={40} />
      </div>
    </motion.div>
  );
}
