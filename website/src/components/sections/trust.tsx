import { SectionHeader } from "@/components/sections/section-header";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { trust } from "@/content/homepage";

export function Trust() {
  return (
    <section className="section-padding border-t border-ink-700/60 bg-ink-900/30">
      <div className="section-container">
        <SectionHeader eyebrow={trust.eyebrow} headline={trust.headline} />

        <ScrollRevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3" staggerAmount={0.08}>
          {trust.pillars.map((pillar) => (
            <ScrollRevealItem key={pillar.title}>
              <SpotlightCard className="h-full rounded-xl border border-ink-700 bg-ink-900/50 p-7">
                <h3 className="text-base font-semibold text-ink-50">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{pillar.description}</p>
              </SpotlightCard>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
