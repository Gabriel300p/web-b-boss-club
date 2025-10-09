import { useMemo, useState } from "react";
import { faqCategories, faqItems, supportChannels } from "../data/faqData";
import {
  CategoryFilter,
  EmptyState,
  FAQList,
  Hero,
  SupportSection,
} from "./sections/_index";

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let items = faqItems;
    if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(search) ||
          item.answer.toLowerCase().includes(search),
      );
    }

    return items;
  }, [searchTerm, selectedCategory]);

  const hasNoResults = searchTerm.trim() && filteredItems.length === 0;

  return (
    <div className="min-h-screen rounded-xl bg-neutral-900">
      <Hero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={filteredItems.length}
        totalCount={faqItems.length}
      />
      <section className="mx-auto max-w-5xl px-4 py-12">
        {!searchTerm && (
          <CategoryFilter
            categories={faqCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}
        {hasNoResults ? (
          <EmptyState
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
          />
        ) : (
          <FAQList
            items={filteredItems}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={faqCategories}
          />
        )}
      </section>
      <SupportSection channels={supportChannels} />
    </div>
  );
}
