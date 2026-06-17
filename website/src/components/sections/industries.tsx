import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { industries } from "@/content/homepage";

export function Industries() {
  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <SectionHeader
          eyebrow={industries.eyebrow}
          headline={industries.headline}
        />

        <ScrollRevealGroup className="mt-12 flex flex-wrap gap-3" staggerAmount={0.03}>
          {industries.list.map((name) => (
            <ScrollRevealItem key={name}>
              <span className="inline-flex items-center rounded-full border border-ink-700 bg-ink-900/50 px-4 py-2 text-sm text-ink-200 transition-colors hover:border-accent-500/40 hover:text-ink-50">
                {name}
              </span>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>

        <ScrollReveal delay={0.1} className="mt-10">
          <p className="text-lg font-medium text-ink-50">{industries.closingLine}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
