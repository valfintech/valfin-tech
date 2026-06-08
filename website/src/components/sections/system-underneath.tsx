import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { systemUnderneath } from "@/content/homepage";

export function SystemUnderneath() {
  return (
    <section className="section-padding border-t border-ink-700/60 bg-ink-900/30">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <SectionHeader eyebrow={systemUnderneath.eyebrow} headline={systemUnderneath.headline} />
            <ScrollReveal delay={0.05} className="mt-6 max-w-xl">
              <p className="text-lg leading-relaxed text-ink-200">{systemUnderneath.body}</p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2">
            <ScrollRevealGroup className="flex flex-col gap-4" staggerAmount={0.08}>
              {systemUnderneath.pillars.map((pillar) => (
                <ScrollRevealItem key={pillar.title}>
                  <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-6">
                    <h3 className="text-base font-semibold text-ink-50">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{pillar.description}</p>
                  </div>
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
