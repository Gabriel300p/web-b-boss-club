/**
 * 🎬 Animation wrapper components
 * Provides consistent motion animations across the application
 */
import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import {
  fadeInVariants,
  listItemVariants,
  scaleInVariants,
  slideInVariants,
} from "./variants";

// Animation wrapper components
interface AnimatedBoxProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
  variant?: "fadeIn" | "slideIn" | "scaleIn";
}

export function AnimatedBox({
  children,
  variant = "fadeIn",
  className,
  ...props
}: AnimatedBoxProps) {
  const variants = {
    fadeIn: fadeInVariants,
    slideIn: slideInVariants,
    scaleIn: scaleInVariants,
  }[variant];

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function AnimatedList({
  children,
  className,
  itemClassName,
}: AnimatedListProps) {
  return (
    <motion.div initial="hidden" animate="visible" className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={listItemVariants}
          custom={i}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Table row animation wrapper
export function AnimatedTableRow({
  children,
  index = 0,
  className,
  ...props
}: ComponentProps<typeof motion.tr> & { index?: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.tr>
  );
}
