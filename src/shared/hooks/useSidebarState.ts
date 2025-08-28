import { useEffect, useState } from "react";

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Persistir estado colapsado no localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Salvar estado colapsado no localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return {
    isCollapsed,
    toggleCollapsed,
    setCollapsed,
  };
}
