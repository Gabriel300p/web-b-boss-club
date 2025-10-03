import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { TopBar } from "./TopBar/TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      {/* Sidebar fixa */}
      <Sidebar />
      
      {/* Container principal com topbar fixa e conteúdo scrollável */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TopBar fixa */}
        <TopBar />
        
        {/* Main content scrollável */}
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
