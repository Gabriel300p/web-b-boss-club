/**
 * 💀 Navigation Skeletons
 * Loading states for navigation components
 */
import { SkeletonBox, SkeletonLine } from "@shared/components/ui/skeleton";
import { motion } from "framer-motion";

// 🎯 Skeleton for TopBar
export function TopBarSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm"
    >
      {/* Left side - Logo/Brand */}
      <div className="flex items-center gap-3">
        <SkeletonBox width={32} height={32} className="rounded" />
        <SkeletonLine width="120px" className="h-5" />
      </div>

      {/* Center - Navigation items */}
      <div className="hidden items-center gap-6 md:flex">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonLine key={i} width="80px" className="h-4" />
        ))}
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-3">
        <SkeletonBox width={32} height={32} className="rounded-full" />
        <SkeletonBox width={100} height={32} className="rounded-md" />
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton for Sidebar
export function SidebarSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 space-y-6 border-r bg-white p-6 shadow-sm"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <SkeletonBox width={28} height={28} className="rounded" />
        <SkeletonLine width="100px" className="h-5" />
      </div>

      {/* Navigation sections */}
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {/* Section title */}
            <SkeletonLine width="60px" className="h-3 opacity-60" />

            {/* Section items */}
            <div className="space-y-1">
              {Array.from({ length: 3 }, (_, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3 p-2">
                  <SkeletonBox width={16} height={16} className="rounded" />
                  <SkeletonLine width="80px" className="h-4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="absolute right-6 bottom-6 left-6">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <SkeletonBox width={32} height={32} className="rounded-full" />
          <div className="space-y-1">
            <SkeletonLine width="80px" className="h-3" />
            <SkeletonLine width="60px" className="h-3 opacity-60" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 🎯 Skeleton for Breadcrumb
export function BreadcrumbSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <SkeletonLine width="60px" className="h-4" />
          {i < 2 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </motion.div>
  );
}
