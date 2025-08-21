import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  width,
  height,
  ...props
}: SkeletonProps) {
  const style = {
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height && {
      height: typeof height === "number" ? `${height}px` : height,
    }),
  };

  return (
    <motion.div
      className={cn(
        "animate-pulse rounded-md",
        "bg-slate-200 dark:bg-slate-700", // Dark mode support
        className,
      )}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      role="status"
      aria-label="Carregando..."
      {...props}
    />
  );
}

// 🎯 Pre-configured skeletons for common use cases
export function SkeletonLine({
  width = "100%",
  className,
}: {
  width?: string | number;
  className?: string;
}) {
  return (
    <Skeleton width={width} height={16} className={cn("mb-2", className)} />
  );
}

export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      width={size}
      height={size}
      className={cn("rounded-full", className)}
    />
  );
}

export function SkeletonBox({
  width = "100%",
  height = 100,
  className,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return <Skeleton width={width} height={height} className={className} />;
}
