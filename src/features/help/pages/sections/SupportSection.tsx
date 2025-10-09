import { SupportChannels } from "../../components/SupportChannels";
import type { SupportChannel } from "../../data/faqData";

interface SupportSectionProps {
  channels: SupportChannel[];
}

export function SupportSection({ channels }: SupportSectionProps) {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50/50 px-4 py-16 dark:border-neutral-800 dark:bg-neutral-900/30">
      <div className="mx-auto max-w-4xl">
        <SupportChannels channels={channels} />
      </div>
    </section>
  );
}
