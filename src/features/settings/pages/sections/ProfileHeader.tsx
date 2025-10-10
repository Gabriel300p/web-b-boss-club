import { CameraIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { BarbershopProfile } from "../../types/settings.types";

interface ProfileHeaderProps {
  profile: BarbershopProfile;
  onChangePhoto?: () => void;
}

export function ProfileHeader({ profile, onChangePhoto }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-6 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-primary flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-4xl shadow-lg">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>💈</span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {profile.name}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  profile.isOpen
                    ? "animate-pulse bg-green-500"
                    : "bg-neutral-400 dark:bg-neutral-600"
                }`}
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {profile.isOpen ? "Disponível para agendamentos" : "Fechado"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onChangePhoto}
        disabled={!onChangePhoto}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
      >
        <CameraIcon size={18} weight="bold" />
        Trocar foto
      </motion.button>
    </motion.div>
  );
}
