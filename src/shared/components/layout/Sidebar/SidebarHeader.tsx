import { cn } from "@/shared/lib/utils";
import LogoComplete from "@shared/assets/logo/logo-complete.svg";
import LogoSimple from "@shared/assets/logo/logo-simple.png";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        isCollapsed ? "justify-center px-2 py-3.5" : "px-6 pt-5 pb-8",
      )}
    >
      {/* Logo placeholder */}
      {!isCollapsed ? (
        <img src={LogoComplete} alt="Logo" className="h-fit w-40" />
      ) : (
        <img src={LogoSimple} alt="Logo" className="size-10" />
      )}
    </div>
  );
}
