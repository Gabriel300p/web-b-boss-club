import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly icon: string;
  }>;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
        Categorias
      </h2>
      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={() => onSelectCategory(null)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
            selectedCategory === null
              ? "border-primary-500 bg-primary-50 text-primary-700 shadow-primary-500/25 dark:bg-primary-900/30 dark:text-primary-400 dark:shadow-primary-500/20 shadow-lg"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
          }`}
        >
          Todas
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-primary-500/25 dark:bg-primary-900/30 dark:text-primary-400 dark:shadow-primary-500/20 shadow-lg"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
