import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { howItWorks } from "@/content/homepage";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <SectionHeader
          eyebrow={howItWorks.eyebrow}
          headline={howItWorks.headline}
          subheadline={howItWorks.subheadline}
        />

        <ScrollRevealGroup className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerAmount={0.1}>
          {/* Connecting progression line (desktop only) — visualizes lifecycle flow */}
          <div
            aria-hidden="true"
            className="divider-hairline absolute left-0 right-0 top-[88px] hidden lg:block"
          />
          {howItWorks.steps.map((step) => (
            <ScrollRevealItem key={step.number}>
              <div className="relative flex h-full flex-col rounded-xl border border-ink-700 bg-ink-900/50 p-7">
                <span className="text-sm font-semibold tracking-wide text-accent-400">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-50">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{step.description}</p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>

        <ScrollReveal delay={0.1} className="mt-12">
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-ink-50">
            {howItWorks.closingLine}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
