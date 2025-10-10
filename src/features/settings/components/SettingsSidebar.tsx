import { useAuth } from "@/features/auth/_index";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { SettingsTab, SettingsTabConfig } from "../types/settings.types";

interface SettingsSidebarProps {
  tabs: SettingsTabConfig[];
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onLogout?: () => void;
}

export function SettingsSidebar({
  tabs,
  activeTab,
  onTabChange,
  onLogout,
}: SettingsSidebarProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="flex h-full flex-col justify-between">
      {/* Tabs Navigation */}
      <nav className="flex-1 space-y-1">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isAvailable = tab.available;

          return (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => isAvailable && onTabChange(tab.id)}
              disabled={!isAvailable}
              whileHover={isAvailable ? { x: 4 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm"
                  : isAvailable
                    ? "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
                    : "cursor-not-allowed text-neutral-400 opacity-50 dark:text-neutral-600"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="bg-primary-600 dark:bg-primary-500 absolute top-0 left-0 h-full w-1 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <span className="flex-1">{tab.label}</span>

              {!isAvailable && (
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-700 dark:text-neutral-500">
                  Em breve
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <ArrowSquareOutIcon size={20} weight="bold" />
          <span>Sair</span>
        </motion.button>
      )}
    </aside>
  );
}
