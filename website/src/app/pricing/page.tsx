import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { pricingFaq, pricingPage, pricingPlans } from "@/content/pricing";
import { breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const TITLE = "Pricing - Valfin";
const DESCRIPTION =
  "Priced against what slow follow-up is already costing your business, not against what software usually costs. See your number, then talk to us about what fits.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
      <JsonLd data={faqPageSchema(pricingFaq)} />
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow justify-center">{pricingPage.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {pricingPage.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">{pricingPage.subheadline}</p>
            <div className="mt-6">
              <ButtonLink
                href={pricingPage.calculatorPrompt.href}
                variant="ghost"
                className="h-auto w-full max-w-full justify-center whitespace-normal text-wrap py-2.5 text-center text-accent-400 hover:bg-ink-800 hover:text-accent-300 sm:w-auto"
              >
                {pricingPage.calculatorPrompt.label}
                <ArrowRight className="ml-1 hidden size-4 shrink-0 sm:inline-flex" />
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="section-container">
          <SectionHeader
            eyebrow={pricingPage.tiersIntro.eyebrow}
            headline={pricingPage.tiersIntro.headline}
            subheadline={pricingPage.tiersIntro.subheadline}
            className="mb-10 sm:mb-12"
          />
          <ScrollRevealGroup className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2" staggerAmount={0.06}>
            {pricingPlans.map((plan) => (
              <ScrollRevealItem key={plan.name}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border p-8",
                    plan.isFeatured
                      ? "border-accent-500/50 bg-gradient-to-b from-accent-500/[0.08] to-ink-900/40 shadow-[0_0_40px_-12px_var(--accent-500)]"
                      : "border-ink-700 bg-ink-900/40"
                  )}
                >
                  {plan.isFeatured ? (
                    <span className="mb-4 inline-block w-fit rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-400">
                      Most Businesses Start Here
                    </span>
                  ) : null}
                  <h2 className="text-xl font-semibold text-ink-50">{plan.name}</h2>
                  <p className="mt-1.5 text-sm text-ink-400">{plan.tagline}</p>

                  <div className="mt-6">
                    <p className="text-3xl font-semibold tracking-tight text-ink-50">{plan.priceLabel}</p>
                    {plan.priceNote ? <p className="mt-1 text-sm text-ink-400">{plan.priceNote}</p> : null}
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-ink-400">{plan.description}</p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-200">
                        <Check className="mt-0.5 size-4 flex-shrink-0 text-accent-400" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-2">
                    <ButtonLink
                      href={plan.cta.href}
                      size="lg"
                      className={cn(
                        "w-full",
                        plan.isFeatured
                          ? "bg-accent-500 text-white hover:-translate-y-0.5 hover:bg-accent-400"
                          : "border border-ink-700 bg-transparent text-ink-50 hover:bg-ink-800"
                      )}
                    >
                      {plan.cta.label}
                    </ButtonLink>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow="Questions about pricing" headline="What businesses ask before they commit to anything" />
          <ScrollReveal delay={0.05} className="mt-10 max-w-3xl">
            <Accordion className="w-full">
              {pricingFaq.map((item, index) => (
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

      <section className="relative overflow-hidden border-t border-ink-700/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,var(--accent-600)_0%,transparent_70%)] opacity-[0.18]"
        />
        <div className="section-container section-padding text-center">
          <ScrollReveal className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl">
              Still not sure where you&apos;d land?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-200">
              See what slow follow-up is already costing you: that number tends to make this whole page much
              easier to think about.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink
                href="/calculator"
                size="lg"
                className="bg-accent-500 text-white shadow-[0_0_0_1px_var(--accent-600)] transition-all hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-[0_8px_24px_-4px_var(--accent-500)]"
              >
                See my number
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
