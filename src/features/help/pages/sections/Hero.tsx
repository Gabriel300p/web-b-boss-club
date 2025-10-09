import { motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";
import { SearchBar } from "../../components/SearchBar";

interface HeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
  totalCount: number;
}

export function Hero({
  searchTerm,
  onSearchChange,
  resultsCount,
  totalCount,
}: HeroProps) {
  return (
    <section className="from-primary-50 to-primary-50/30 relative overflow-hidden rounded-xl bg-gradient-to-br via-white px-4 py-20 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      <motion.div
        className="from-primary-500/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="from-primary-100 to-primary-50 shadow-primary-500/20 dark:from-primary-900/30 dark:to-primary-800/20 dark:shadow-primary-500/10 mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-br p-4 shadow-lg"
        >
          <MessageCircleQuestion className="text-primary-600 dark:text-primary-400 h-12 w-12" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl dark:text-white"
        >
          Como podemos ajudar?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 text-lg text-neutral-600 dark:text-neutral-400"
        >
          Encontre respostas rápidas ou entre em contato conosco
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            resultsCount={resultsCount}
            totalCount={totalCount}
          />
        </motion.div>
      </div>
    </section>
  );
}
