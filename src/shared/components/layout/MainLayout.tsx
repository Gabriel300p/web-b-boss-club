import type { ReactNode } from "react";
import { TopBar } from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <TopBar />
      <main className="mx-4 flex-1 py-6 md:mx-8 md:py-8 lg:mx-16 lg:py-12">
        {children}
      </main>
    </div>
  );
}
