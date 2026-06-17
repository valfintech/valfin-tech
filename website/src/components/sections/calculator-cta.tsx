import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function CalculatorCta() {
  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-accent-500/20 bg-gradient-to-br from-accent-600/8 via-transparent to-transparent px-8 py-12 text-center sm:px-14 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,var(--accent-600)_0%,transparent_70%)] opacity-[0.07]"
            />

            <h2 className="mx-auto max-w-xl text-2xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-3xl">
              See exactly what slow follow-up is costing your business.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-400">
              Two inputs. Sixty seconds. Your real number, not a guess.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ButtonLink
                href="/calculator"
                size="lg"
                className="bg-accent-500 text-white shadow-[0_0_0_1px_var(--accent-600)] transition-all hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-[0_8px_24px_-4px_var(--accent-500)]"
              >
                Calculate My Number
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
              <p className="text-sm text-ink-500">No email required.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
