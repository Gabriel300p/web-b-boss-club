import { FAQAccordion } from "../../components/FAQAccordion";
import type { FAQItem } from "../../data/faqData";

interface FAQListProps {
  items: FAQItem[];
  searchTerm: string;
  selectedCategory: string | null;
  categories: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly icon: string;
  }>;
}

export function FAQList({
  items,
  searchTerm,
  selectedCategory,
  categories,
}: FAQListProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          {searchTerm
            ? "Resultados da busca"
            : selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : "Perguntas Frequentes"}
        </h2>
      </div>
      <FAQAccordion items={items} searchTerm={searchTerm} />
    </>
  );
}
