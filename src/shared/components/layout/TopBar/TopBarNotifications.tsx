import { BellIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import { cn } from "@shared/lib/utils";
import { useState } from "react";

interface TopbarNotificationsProps {
  className?: string;
}

export function TopbarNotifications({ className }: TopbarNotificationsProps) {
  const [unreadCount] = useState(3); // Mock: 3 notificações não lidas

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative size-10 bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700",
            className,
          )}
          aria-label="Notificações"
        >
          <BellIcon className="size-6" />

          {/* Badge de notificações não lidas */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 sm:w-96"
        sideOffset={8}
      >
        <div className="border-b p-3 sm:p-4">
          <h3 className="text-sm font-semibold">Notificações</h3>
          <p className="text-muted-foreground text-xs">
            {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto sm:max-h-80">
          {/* Notificação 1 */}
          <DropdownMenuItem className="hover:bg-accent cursor-pointer p-3 sm:p-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    Novo agendamento
                  </p>
                  <p
                    className="text-muted-foreground overflow-hidden text-xs text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    João Silva agendou um horário para hoje às 14:00
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Há 5 minutos
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Notificação 2 */}
          <DropdownMenuItem className="hover:bg-accent cursor-pointer p-3 sm:p-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    Pagamento confirmado
                  </p>
                  <p
                    className="text-muted-foreground overflow-hidden text-xs text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Pagamento do agendamento #1234 foi confirmado
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Há 1 hora
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Notificação 3 */}
          <DropdownMenuItem className="hover:bg-accent cursor-pointer p-3 sm:p-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500"></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    Lembrete de horário
                  </p>
                  <p
                    className="text-muted-foreground overflow-hidden text-xs text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Você tem um agendamento em 30 minutos
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Há 2 horas
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem className="text-muted-foreground hover:text-foreground cursor-pointer text-center text-sm">
            Ver todas as notificações
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
