import { cn } from "@shared/lib/utils";
import { TopBarNotifications } from "./TopBarNotifications";
import { TopBarSearch } from "./TopBarSearch";
import { TopBarSidebarToggle } from "./TopBarSidebarToggle";
import { TopBarUserMenu } from "./TopBarUserMenu";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <header
      className={cn("bg-neutral-900 text-neutral-200 shadow-md", className)}
    >
      <div className="xs:px-3 xs:py-3 flex items-center justify-between px-2 py-2 sm:px-4 md:px-8 md:py-4 lg:pr-12 lg:pl-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <TopBarSidebarToggle />
          <TopBarSearch />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 sm:gap-5">
          <TopBarNotifications />
          <div className="hidden h-6 w-px bg-neutral-600 sm:block" />
          <TopBarUserMenu />
        </div>
      </div>
    </header>
  );
}
