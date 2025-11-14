import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SettingsSidebar } from "../components/SettingsSidebar";
import { mockBarbershopProfile, settingsTabs } from "../data/settingsData";
import type { BarbershopProfile, SettingsTab } from "../types/settings.types";
import {
  ComingSoonSection,
  ProfileHeader,
  ProfileInformation,
} from "./sections/_index";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profile, setProfile] = useState<BarbershopProfile>(
    mockBarbershopProfile,
  );

  const handleSaveProfile = (data: Partial<BarbershopProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    // TODO: Add toast notification
    console.log("Profile saved:", data);
  };

  const handleLogout = () => {
    // TODO: Implement logout
    console.log("Logout");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ProfileHeader profile={profile} />
            <ProfileInformation profile={profile} onSave={handleSaveProfile} />
          </div>
        );
      case "system":
        return <ComingSoonSection title="Definições do sistema" />;
      case "notifications":
        return <ComingSoonSection title="Notificações" />;
      case "templates":
        return <ComingSoonSection title="Templates" />;
      case "payments":
        return <ComingSoonSection title="Pagamentos" />;
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="mb-5 text-3xl font-bold text-neutral-900 dark:text-white">
        Configurações
      </h1>
      <div className="flex flex-col gap-5 rounded-xl bg-neutral-900 p-5 lg:p-6">
        {/* Mobile Tabs (Horizontal Scroll) */}
        <div className="mb-6 overflow-x-auto lg:hidden">
          <div className="flex gap-2 pb-2">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isAvailable = tab.available;

              return (
                <motion.button
                  key={tab.id}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  onClick={() => isAvailable && setActiveTab(tab.id)}
                  disabled={!isAvailable}
                  className={`relative flex-shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary-600 shadow-primary-500/25 text-white shadow-lg"
                      : isAvailable
                        ? "bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                        : "cursor-not-allowed bg-neutral-100 text-neutral-400 opacity-50 dark:bg-neutral-800 dark:text-neutral-600"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {!isAvailable && (
                    <span className="ml-2 text-xs opacity-75">Em breve</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="flex gap-6">
          {/* Sidebar - Hidden on Mobile */}
          <div className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-6">
              <SettingsSidebar
                tabs={settingsTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
