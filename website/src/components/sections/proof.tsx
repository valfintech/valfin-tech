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
            <Badge
              variant="outline"
              className="border-accent-500/40 bg-accent-500/10 text-accent-400"
            >
              {featured.industryTag}
            </Badge>

            <h3 className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              {featured.headline}
            </h3>

            <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {featured.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-ink-50">{stat.value}</dd>
                  <p className="mt-1 text-sm text-ink-400">{stat.label}</p>
                </div>
              ))}
            </dl>

            <blockquote className="mt-8 border-l-2 border-accent-500/50 pl-5">
              <p className="text-lg italic leading-relaxed text-ink-200">&ldquo;{featured.quote}&rdquo;</p>
              <footer className="mt-2 text-sm text-ink-400">— {featured.attribution}</footer>
            </blockquote>

            <Link
              href={featured.href}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
            >
              Read exactly how it happened
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {featured.isPlaceholder ? (
              <p className="mt-6 text-xs text-ink-600">
                Figures shown are placeholders pending verified numbers from the flagship deployment.
              </p>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
