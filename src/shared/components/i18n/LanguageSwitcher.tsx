import { setLocale, SUPPORTED_LOCALES } from "@/app/i18n/init";
import { ANIMATION_DURATION } from "@/shared/animations";
import { CaretDownIcon } from "@phosphor-icons/react";
import FlagBr from "@shared/assets/flags/flag-br.svg";
import FlagUs from "@shared/assets/flags/flag-us.svg";
import { Button } from "@shared/components/ui/button";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
  description: string;
}

const OPTIONS: LanguageOption[] = [
  {
    code: "pt-BR",
    label: "PT",
    flag: FlagBr,
    description: "Português (Brasil)",
  },
  {
    code: "en-US",
    label: "EN",
    flag: FlagUs,
    description: "English (US)",
  },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = i18n.language;
  const currentOpt = OPTIONS.find((o) => o.code === current) ?? OPTIONS[0];

  const change = useCallback((code: string) => {
    if (!SUPPORTED_LOCALES.includes(code)) return;
    setLocale(code);
    setOpen(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: ANIMATION_DURATION.slower,
        ease: "easeInOut",
      }}
      className="relative inline-block text-left"
    >
      <Button
        variant="outline"
        className="px-3 py-1.5 text-xs font-semibold"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img src={currentOpt.flag} alt={currentOpt.label} className="h-8 w-8" />
        <CaretDownIcon className="size-4 text-neutral-300" weight="bold" />
      </Button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-1 w-3xs space-y-2 overflow-hidden rounded-md border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        >
          {OPTIONS.map((opt) => (
            <li key={opt.code} className="">
              <button
                type="button"
                role="option"
                aria-selected={current === opt.code}
                onClick={() => change(opt.code)}
                className={`flex w-full cursor-pointer items-center gap-3 px-3 py-1 text-left text-sm text-neutral-600 transition-opacity duration-300 hover:opacity-60 dark:text-neutral-200 ${
                  current === opt.code ? "font-bold" : ""
                }`}
              >
                <img src={opt.flag} alt={opt.label} className="h-6 w-6" />
                {opt.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
