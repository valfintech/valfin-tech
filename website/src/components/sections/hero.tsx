import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ReachOutDiagram } from "@/components/motion/reach-out-diagram";
import { hero } from "@/content/homepage";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background glow — slow, low-opacity, never distracting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--accent-600)_0%,transparent_70%)] opacity-[0.16]"
      />

      <div className="section-container grid grid-cols-1 items-center gap-16 pb-20 pt-20 sm:pt-28 lg:grid-cols-2 lg:pb-28 lg:pt-36">
        <ScrollReveal>
          <p className="text-eyebrow">{hero.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-ink-50 sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
            {hero.subheadline}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink
              href={hero.primaryCta.href}
              size="lg"
              className="bg-accent-500 text-white shadow-[0_0_0_1px_var(--accent-600)] transition-all hover:bg-accent-400 hover:shadow-[0_0_24px_-4px_var(--accent-500)]"
            >
              {hero.primaryCta.label}
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="ghost"
              size="lg"
              className="text-ink-200 hover:text-ink-50 hover:bg-ink-800"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-ink-400">{hero.microcopy}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900/60 p-8 shadow-[0_0_60px_-20px_rgba(91,91,255,0.25)] backdrop-blur-sm">
            <ReachOutDiagram size="hero" />
            <p className="mt-2 text-center text-xs text-ink-400">
              This is what happens, every time, automatically.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
