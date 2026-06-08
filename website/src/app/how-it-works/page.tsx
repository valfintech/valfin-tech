import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import {
  detailedSteps,
  handoff,
  howItWorksFaq,
  howItWorksHero,
  setup,
  underTheHood,
} from "@/content/how-it-works";

const TITLE = "How It Works — Valfin";
const DESCRIPTION =
  "A look underneath the hood: how Valfin answers, qualifies, follows up, and books every lead that reaches your business — without asking your team to learn anything new.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow justify-center">{howItWorksHero.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {howItWorksHero.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
              {howItWorksHero.subheadline}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed steps */}
      <section className="section-padding border-t border-ink-700/60 pt-16 sm:pt-20">
        <div className="section-container">
          <div className="space-y-16 sm:space-y-20">
            {detailedSteps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.04} className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
                <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-accent-400/70 sm:text-5xl">
                    {step.number}
                  </span>
                  <div className="h-px flex-1 bg-ink-700 lg:hidden" />
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink-300">{step.description}</p>
                  <p className="mt-4 text-base leading-relaxed text-ink-400">{step.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Human handoff */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl rounded-2xl border border-ink-700 bg-ink-900/50 p-8 text-center sm:p-12">
            <p className="text-eyebrow justify-center">{handoff.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              {handoff.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-300">{handoff.body}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Under the hood */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow="Underneath it all" headline="What makes it able to do this well" />
          <ScrollRevealGroup className="mt-12 grid gap-6 sm:grid-cols-3" staggerAmount={0.06}>
            {underTheHood.map((pillar) => (
              <ScrollRevealItem key={pillar.title}>
                <div className="h-full rounded-xl border border-ink-700 bg-ink-900/40 p-6">
                  <h3 className="text-lg font-semibold text-ink-50">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{pillar.description}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Setup process */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow={setup.eyebrow} headline={setup.headline} />
          <ScrollRevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerAmount={0.06}>
            {setup.steps.map((step) => (
              <ScrollRevealItem key={step.number}>
                <div className="h-full rounded-xl border border-ink-700 bg-ink-900/30 p-6">
                  <span className="text-sm font-semibold text-accent-400">{step.number}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink-50">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.description}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow="Common questions" headline="What people ask before they trust us with their phone number" />
          <ScrollReveal delay={0.05} className="mt-10 max-w-3xl">
            <Accordion className="w-full">
              {howItWorksFaq.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`} className="border-ink-700">
                  <AccordionTrigger className="text-left text-base font-medium text-ink-50 hover:text-accent-400 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-ink-400">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-ink-700/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,var(--accent-600)_0%,transparent_70%)] opacity-[0.18]"
        />
        <div className="section-container section-padding text-center">
          <ScrollReveal className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl">
              See what this would change for your business specifically
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-200">
              Run your numbers through the calculator, or talk to us directly — either way, you&apos;ll walk away with a
              clearer picture than you have right now.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink
                href="/calculator"
                size="lg"
                className="bg-accent-500 text-white shadow-[0_0_0_1px_var(--accent-600)] transition-all hover:bg-accent-400 hover:shadow-[0_0_24px_-4px_var(--accent-500)]"
              >
                See what slow follow-up is costing you
                <ArrowRight className="ml-1 size-4" />
              </ButtonLink>
              <ButtonLink href="/company#contact" variant="ghost" size="lg" className="text-ink-200 hover:bg-ink-800 hover:text-ink-50">
                Talk to us
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
