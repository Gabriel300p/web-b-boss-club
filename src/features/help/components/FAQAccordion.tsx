import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import type { FAQItem } from "../data/faqData";

interface FAQAccordionProps {
  items: FAQItem[];
  searchTerm: string;
}

export function FAQAccordion({ items, searchTerm }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 text-neutral-900 dark:bg-yellow-500/30 dark:text-yellow-200"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openId === item.id;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:shadow-neutral-900/50"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {highlightText(item.question, searchTerm)}
                  </h3>
                  {item.isPopular && (
                    <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </span>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5 text-neutral-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    opacity: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900/30">
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {highlightText(item.answer, searchTerm)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
