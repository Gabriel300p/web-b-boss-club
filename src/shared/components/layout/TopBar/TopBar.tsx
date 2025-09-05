import { cn } from "@shared/lib/utils";
import { TopbarNotifications } from "./TopbarNotifications";
import { TopbarSearch } from "./TopbarSearch";
import { TopbarSidebarToggle } from "./TopbarSidebarToggle";
import { TopbarUserMenu } from "./TopbarUserMenu";

interface TopbarProps {
  className?: string;
}

export default function Topbar({ className }: TopbarProps) {
  return (
    <header
      className={cn("bg-neutral-900 text-neutral-200 shadow-md", className)}
    >
      <div className="xs:px-3 xs:py-3 flex items-center justify-between px-2 py-2 sm:px-4 md:px-8 md:py-4 lg:pr-12 lg:pl-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <TopbarSidebarToggle />
          <TopbarSearch />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 sm:gap-5">
          <TopbarNotifications />
          <div className="hidden h-6 w-px bg-neutral-600 sm:block" />
          <TopbarUserMenu />
        </div>
      </div>
    </header>
  );
}
