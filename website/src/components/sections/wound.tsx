import { SectionHeader } from "@/components/sections/section-header";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { wound } from "@/content/homepage";

export function Wound() {
  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <SectionHeader eyebrow={wound.eyebrow} headline={wound.headline} />
        <ScrollRevealItem className="mt-6 max-w-2xl">
          <p className="text-lg leading-relaxed text-ink-200">{wound.body}</p>
        </ScrollRevealItem>

        <ScrollRevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3" as="div">
          {wound.stats.map((stat) => (
            <ScrollRevealItem key={stat.label}>
              <div className="h-full rounded-xl border border-ink-700 bg-ink-900/50 p-7">
                <p className="text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
                  {stat.numericValue ? (
                    <AnimatedCounter
                      value={stat.numericValue}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      decimals={stat.decimals}
                    />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{stat.label}</p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
