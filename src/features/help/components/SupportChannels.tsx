import WhatsappLogo from "@/shared/assets/logo/whatsapp.svg";
import {
  ClockIcon as Clock,
  ArrowSquareOutIcon as ExternalLink,
  FacebookLogoIcon as Facebook,
  InstagramLogoIcon as Instagram,
  EnvelopeSimpleIcon as Mail,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { SupportChannel } from "../data/faqData";

interface SupportChannelsProps {
  channels: SupportChannel[];
}

const iconMap = {
  whatsapp: WhatsappLogo,
  mail: Mail,
  clock: Clock,
  instagram: Instagram,
  facebook: Facebook,
};

export function SupportChannels({ channels }: SupportChannelsProps) {
  const handleChannelClick = (channel: SupportChannel) => {
    if (channel.link === "#") return;
    window.open(channel.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
          Precisa de mais ajuda?
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Nossa equipe está pronta para atender você
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel, index) => {
          const Icon = iconMap[channel.icon as keyof typeof iconMap];
          const isPrimary = channel.isPrimary;
          const isClickable = channel.link !== "#";

          return (
            <motion.button
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleChannelClick(channel)}
              disabled={!isClickable}
              className={`group relative overflow-hidden rounded-xl border p-6 text-left transition-all ${
                isPrimary
                  ? "border-primary-500 from-primary-500 to-primary-600 shadow-primary-500/25 hover:shadow-primary-500/30 dark:from-primary-600 dark:to-primary-700 bg-gradient-to-br shadow-lg hover:shadow-xl"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Efeito de gradiente no fundo */}
              {isPrimary && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              )}

              <div className="relative flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-lg p-2 ${
                      isPrimary
                        ? "bg-white/20"
                        : "bg-neutral-100 dark:bg-neutral-700"
                    }`}
                  >
                    {/*
                      Support both React icon components (Phosphor) and raw SVG imports.
                      Some bundlers return the SVG path (string) instead of a React component.
                      If Icon is a string, render an <img/>; otherwise treat it as a component.
                    */}
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={`${channel.name} logo`}
                        className={`h-6 w-6 ${
                          isPrimary ? "object-contain" : "object-contain"
                        }`}
                      />
                    ) : (
                      <Icon
                        size={24}
                        weight="bold"
                        className={`${
                          isPrimary
                            ? "text-white"
                            : "text-neutral-700 dark:text-neutral-300"
                        }`}
                      />
                    )}
                  </div>
                  {isClickable && (
                    <ExternalLink
                      size={18}
                      weight="bold"
                      className={`opacity-0 transition-opacity group-hover:opacity-100 ${
                        isPrimary
                          ? "text-white/80"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                  )}
                </div>

                <div>
                  <h3
                    className={`mb-1 font-semibold ${
                      isPrimary
                        ? "text-white"
                        : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {channel.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isPrimary
                        ? "text-white/90"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {channel.description}
                  </p>
                </div>

                {isPrimary && (
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
                    <span>Falar agora</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
