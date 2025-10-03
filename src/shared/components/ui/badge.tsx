/**
 * 🏷️ Badge Component
 * Componente genérico de badge reutilizável com variantes de cor e tamanho
 */
import { cn } from "@shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-green-900/30 text-green-400",
        danger: "bg-red-900/30 text-red-400",
        warning: "bg-yellow-900/30 text-yellow-400",
        info: "bg-blue-900/30 text-blue-400",
        neutral: "bg-gray-900/30 text-gray-400",
        purple: "bg-purple-900/30 text-purple-400",
        cyan: "bg-cyan-900/30 text-cyan-400",
        default: "bg-neutral-800/50 text-neutral-300",
      },
      size: {
        sm: "rounded-xl px-2 py-0.5 text-[10px]",
        md: "rounded-2xl px-2.5 py-0.5 text-xs",
        lg: "rounded-2xl px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const dotVariants = cva("rounded-full", {
  variants: {
    variant: {
      success: "bg-green-400",
      danger: "bg-red-400",
      warning: "bg-yellow-400",
      info: "bg-blue-400",
      neutral: "bg-gray-400",
      purple: "bg-purple-400",
      cyan: "bg-cyan-400",
      default: "bg-neutral-300",
    },
    size: {
      sm: "h-1 w-1",
      md: "h-1.5 w-1.5",
      lg: "h-2 w-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  label: string;
  withDot?: boolean;
}

function Badge({
  className,
  variant,
  size,
  label,
  withDot = false,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {withDot && <span className={cn(dotVariants({ variant, size }))} />}
      <span>{label}</span>
    </div>
  );
}

// 🔄 Componente legado para compatibilidade com código existente
interface BadgeWithoutDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

function BadgeWithoutDot({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeWithoutDotProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), "rounded-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge, BadgeWithoutDot };
