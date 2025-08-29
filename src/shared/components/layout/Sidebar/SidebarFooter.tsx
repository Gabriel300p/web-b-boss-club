import { useAuth } from "@features/auth/hooks/useAuth";
import { cn } from "@shared/lib/utils";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { user } = useAuth();

  if (!user) return null;

  // Mock data para a barbearia (será substituído por API real)
  const barbershopData = {
    name: user.role === "BARBERSHOP_OWNER" ? user.name : "Barbearia",
    status: "Aberto",
    isOpen: true,
  };

  return (
    <div className="px-4 pb-8">
      <div
        className={cn(
          "rounded-lg bg-neutral-800 transition-all duration-300 ease-out",
          isCollapsed ? "p-2" : "px-4 py-2.5",
        )}
      >
        <div className="flex items-center gap-3.5">
          {/* Avatar/Logo da barbearia */}
          <div className="bg-primary flex size-10 flex-shrink-0 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-base font-bold">
              {barbershopData.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Informações da barbearia */}
          <div
            className={cn(
              "space-y-0.5 overflow-hidden transition-all duration-300 ease-out",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <h4 className="truncate font-medium text-white">
              {barbershopData.name}
            </h4>

            {/* Status com indicador */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  barbershopData.isOpen ? "bg-emerald-400" : "bg-red-400",
                )}
              />
              <span className="text-xs text-neutral-400">
                {barbershopData.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
