import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getIndustryBySlug, industryList } from "@/content/industries";
import { howItWorks } from "@/content/homepage";
import { breadcrumbSchema, industryServiceSchema } from "@/lib/structured-data";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Industry landing page template — one component, every vertical.
 *
 * This is the architectural payoff of keeping industry copy in a typed
 * vocabulary list (`/src/content/industries.ts`): adding a new industry
 * to the site is adding one object to that array, not building a new page.
 * The template swaps in industry-accurate nouns and a vivid, specific
 * pain/win example, then funnels into the same proven conversion path
 * (calculator → talk to us) that the flagship roofing experience uses.
 */
export async function generateStaticParams() {
  return industryList.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};

  const title = `${industry.name} - Never lose another ${industry.customerNoun} to slow follow-up | Valfin`;
  const description = `Valfin makes sure your ${industry.shortLabel.toLowerCase()} business answers every ${industry.customerNoun} fast, day or night, and follows up until they book a ${industry.outcomeNoun}.`;

  return {
    title,
    description,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: { title, description, url: `/industries/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const otherIndustries = industryList.filter((i) => i.slug !== industry.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ])}
      />
      <JsonLd data={industryServiceSchema(industry)} />
      {/* Hero */}
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            {industry.isFlagship ? (
              <Badge variant="outline" className="mx-auto border-accent-500/40 bg-accent-500/10 text-accent-400">
                Flagship industry: proven first here
              </Badge>
            ) : (
              <p className="text-eyebrow justify-center">For {industry.shortLabel.toLowerCase()}</p>
            )}
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              Your next {industry.customerNoun} is already trying to reach you. The question is whether anyone answers.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
              Valfin makes sure your business is the one that answers first (every call, text, and form, day or
              night) and keeps following up until that {industry.customerNoun} either books a {industry.outcomeNoun}
              {" "}or tells you no.
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

      {/* The moment that matters — pain example */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="text-eyebrow">The moment that costs you</p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              Here&apos;s what that moment usually looks like in {industry.shortLabel.toLowerCase()}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-400">{industry.painExample}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <p className="text-eyebrow">What changes</p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              Here&apos;s the same moment, with Valfin already running
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-400">{industry.winExample}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works, reframed for this industry */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader
            eyebrow="How it works for your business"
            headline={`From the moment a ${industry.customerNoun} reaches out, to a ${industry.outcomeNoun} on your calendar`}
            subheadline={howItWorks.subheadline}
          />
          <ScrollRevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerAmount={0.06}>
            {howItWorks.steps.map((step) => (
              <ScrollRevealItem key={step.number}>
                <div className="h-full rounded-xl border border-ink-700 bg-ink-900/40 p-6">
                  <span className="text-sm font-semibold text-accent-400">{step.number}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink-50">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.description}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Proof note */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl rounded-2xl border border-ink-700 bg-ink-900/50 p-8 text-center sm:p-12">
            <p className="text-eyebrow justify-center">Where this was proven</p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              {industry.isFlagship
                ? "This is the industry where we built and proved the entire system."
                : "We proved this system first in roofing: one of the toughest, most time-sensitive versions of this problem there is."}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-300">
              {industry.isFlagship
                ? "Every part of what you're reading about on this page was tested, measured, and refined inside a real, operating roofing business before it ever reached anyone else."
                : `The same logic that recovers a missed roofing call applies directly to ${industry.shortLabel.toLowerCase()}: someone reaches out ready to spend money, and what happens in the next few minutes decides where that money goes.`}
            </p>
            <div className="mt-6">
              <ButtonLink href="/results" variant="ghost" size="lg" className="text-accent-400 hover:bg-ink-800 hover:text-accent-300">
                See exactly what happened
                <ArrowRight className="ml-1 size-4" />
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Other industries */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow="Also built for" headline="Other businesses where this same moment decides everything" />
          <ScrollRevealGroup className="mt-10 grid gap-5 sm:grid-cols-3" staggerAmount={0.05}>
            {otherIndustries.map((other) => (
              <ScrollRevealItem key={other.slug}>
                <ButtonLink
                  href={`/industries/${other.slug}`}
                  variant="ghost"
                  className="group flex h-full w-full flex-col items-start rounded-xl border border-ink-700 bg-ink-900/30 p-5 text-left hover:border-accent-500/40 hover:bg-ink-900/60"
                >
                  <span className="text-base font-semibold text-ink-50">{other.name}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent-400 transition-colors group-hover:text-accent-300">
                    See how it applies
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </ButtonLink>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
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
              See what this would mean for your {industry.shortLabel.toLowerCase()} business
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-200">
              Two questions, about sixty seconds, and you&apos;ll see a real, personalized estimate of what slow
              follow-up is likely costing you every month.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink
                href="/calculator"
                size="lg"
                className="bg-accent-500 text-white shadow-[0_0_0_1px_var(--accent-600)] transition-all hover:bg-accent-400 hover:shadow-[0_0_24px_-4px_var(--accent-500)]"
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
