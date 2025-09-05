import type { ReactNode } from "react";
import Sidebar from "./sidebar/Sidebar";
import TopBar from "./topbar/TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <div className="h-[calc(100vh-0rem)]">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main>{children}</main>
      </div>
    </div>
  );
}
