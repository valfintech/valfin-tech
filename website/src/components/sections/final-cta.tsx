import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { finalCta } from "@/content/homepage";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-ink-700/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,var(--accent-600)_0%,transparent_70%)] opacity-[0.18]"
      />
      <div className="section-container section-padding text-center">
        <ScrollReveal className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
            {finalCta.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-200">{finalCta.subheadline}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href={finalCta.primaryCta.href}
              size="lg"
              className="bg-accent-500 text-white shadow-[0_0_0_1px_var(--accent-600)] transition-all hover:bg-accent-400 hover:shadow-[0_0_24px_-4px_var(--accent-500)]"
            >
              {finalCta.primaryCta.label}
              <ArrowRight className="ml-1 size-4" />
            </ButtonLink>
            <ButtonLink
              href={finalCta.secondaryCta.href}
              variant="ghost"
              size="lg"
              className="text-ink-200 hover:text-ink-50 hover:bg-ink-800"
            >
              {finalCta.secondaryCta.label}
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-ink-400">{finalCta.microcopy}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
