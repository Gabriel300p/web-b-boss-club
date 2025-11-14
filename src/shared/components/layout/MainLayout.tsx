import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { TopBar } from "./TopBar/TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-3 lg:p-5">{children}</main>
      </div>
    </div>
  );
}
