import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function EmptyState({ searchTerm, onClearSearch }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800"
    >
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
        Nenhum resultado encontrado
      </h3>
      <p className="mb-6 text-neutral-600 dark:text-neutral-400">
        Não encontramos nada para "{searchTerm}". Tente outras palavras ou entre
        em contato conosco.
      </p>
      <button
        onClick={onClearSearch}
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 mx-auto flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors"
      >
        Limpar busca
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
