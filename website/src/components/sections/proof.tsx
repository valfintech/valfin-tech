import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { proof } from "@/content/homepage";

export function Proof() {
  const { featured } = proof;

  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <SectionHeader eyebrow={proof.eyebrow} headline={proof.headline} subheadline={proof.intro} />

        <ScrollReveal delay={0.1} className="mt-12">
          <div className="rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-900 to-ink-900/40 p-8 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-accent-500/40 bg-accent-500/10 text-accent-400"
              >
                {featured.industryTag}
              </Badge>
              <Badge variant="outline" className="border-ink-600 bg-ink-800/60 text-ink-300">
                {featured.status}
              </Badge>
            </div>

            <h3 className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              {featured.headline}
            </h3>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-400">{featured.body}</p>

            <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {featured.metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-ink-700/80 bg-ink-900/50 p-5">
                  <dt className="text-sm font-semibold text-ink-50">{metric.label}</dt>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{metric.note}</p>
                </div>
              ))}
            </dl>

            <blockquote className="mt-8 border-l-2 border-accent-500/50 pl-5">
              <p className="text-base leading-relaxed text-ink-200">{featured.commitment}</p>
            </blockquote>

            <Link
              href={featured.href}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
            >
              See exactly how we&apos;re measuring this
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
