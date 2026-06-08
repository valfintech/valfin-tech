import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { reframe } from "@/content/homepage";

export function Reframe() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <SectionHeader eyebrow={reframe.eyebrow} headline={reframe.headline} />
            <ScrollReveal delay={0.05} className="mt-6 max-w-xl">
              <p className="text-lg leading-relaxed text-ink-200">{reframe.body}</p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2">
            <ScrollReveal delay={0.1}>
              <div className="flex h-full flex-col justify-center rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-600/10 to-transparent p-8">
                <p className="text-xl font-medium leading-snug text-ink-50 sm:text-2xl">
                  {reframe.closingLine}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
