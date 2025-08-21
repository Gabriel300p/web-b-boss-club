import { setLocale, SUPPORTED_LOCALES } from "@/app/i18n/init";
import { Button } from "@shared/components/ui/button";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  code: string;
  label: string;
}

const OPTIONS: LanguageOption[] = [
  { code: "pt-BR", label: "PT" },
  { code: "en-US", label: "EN" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = i18n.language;

  const change = useCallback((code: string) => {
    if (!SUPPORTED_LOCALES.includes(code)) return;
    setLocale(code);
    setOpen(false);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <Button
        variant="ghost"
        className="px-2 py-1 text-xs font-semibold"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current === "pt-BR" ? "PT-BR" : "EN-US"}
      </Button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-1 min-w-[4rem] overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg"
        >
          {OPTIONS.map((opt) => (
            <li key={opt.code}>
              <button
                type="button"
                role="option"
                aria-selected={current === opt.code}
                onClick={() => change(opt.code)}
                className={`w-full px-3 py-1 text-left text-xs text-gray-600 hover:bg-neutral-100 ${current === opt.code ? "font-bold" : ""}`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
