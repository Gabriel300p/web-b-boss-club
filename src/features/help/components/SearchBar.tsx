import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount: number;
  totalCount: number;
}

export function SearchBar({
  value,
  onChange,
  resultsCount,
  totalCount,
}: SearchBarProps) {
  const hasSearch = value.length > 0;

  return (
    <div className="w-full">
      <div className="relative">
        <motion.div
          animate={hasSearch ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        </motion.div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Busque sua dúvida..."
          className="focus:border-primary-500 focus:ring-primary-500/20 focus:shadow-primary-500/10 dark:focus:border-primary-400 dark:focus:shadow-primary-500/20 w-full rounded-xl border border-neutral-200 bg-white py-4 pr-12 pl-12 text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-300 focus:shadow-lg focus:ring-4 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
        />
        <AnimatePresence>
          {hasSearch && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-center text-sm"
          >
            {resultsCount > 0 ? (
              <p className="text-neutral-600 dark:text-neutral-400">
                Encontramos{" "}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  {resultsCount}
                </span>{" "}
                {resultsCount === 1 ? "resultado" : "resultados"} de{" "}
                {totalCount}
              </p>
            ) : (
              <p className="text-neutral-600 dark:text-neutral-400">
                Nenhum resultado encontrado para "{value}"
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
