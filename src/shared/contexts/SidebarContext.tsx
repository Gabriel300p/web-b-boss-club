import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const value: SidebarContextType = {
    isOpen,
    isCollapsed,
    toggle,
    open,
    close,
    toggleCollapsed,
    setCollapsed,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}
