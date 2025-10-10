import { motion } from "framer-motion";

interface ComingSoonSectionProps {
  title: string;
  description?: string;
}

export function ComingSoonSection({
  title,
  description = "Esta funcionalidade está sendo desenvolvida e estará disponível em breve.",
}: ComingSoonSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700"
      >
        <span className="text-5xl">🚧</span>
      </motion.div>

      <h2 className="mb-3 text-2xl font-bold text-neutral-900 dark:text-white">
        {title}
      </h2>
      <p className="max-w-md text-neutral-600 dark:text-neutral-400">
        {description}
      </p>

      <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          💡 Em desenvolvimento - Fique atento às próximas atualizações!
        </p>
      </div>
    </motion.div>
  );
}
