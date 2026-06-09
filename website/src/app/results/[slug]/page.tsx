import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { flagshipMethodology } from "@/content/results";
import { breadcrumbSchema, caseStudyArticleSchema } from "@/lib/structured-data";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Case study detail template — currently a transparent "how we measure
 * this" walkthrough, since the flagship story's measurement period is
 * still open and there are no verified figures to publish yet. Built so
 * that the eventual verified result can be added above this methodology
 * section without retiring it — the methodology is what makes the
 * eventual numbers credible, not just decorative.
 */
const caseStudiesBySlug = {
  [flagshipMethodology.slug]: flagshipMethodology,
};

export async function generateStaticParams() {
  return Object.keys(caseStudiesBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudiesBySlug[slug as keyof typeof caseStudiesBySlug];
  if (!study) return {};

  return {
    title: `${study.title} | Valfin Results`,
    description: study.dek,
    alternates: { canonical: `/results/${study.slug}` },
    openGraph: { title: study.title, description: study.dek, url: `/results/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudiesBySlug[slug as keyof typeof caseStudiesBySlug];
  if (!study) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Results", path: "/results" },
          { name: study.industryTag, path: `/results/${study.slug}` },
        ])}
      />
      <JsonLd
        data={caseStudyArticleSchema({
          slug: study.slug,
          title: study.title,
          description: study.dek,
          industryTag: study.industryTag,
        })}
      />
      <section className="section-padding pb-12 sm:pb-16">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mx-auto border-accent-500/40 bg-accent-500/10 text-accent-400">
              {study.industryTag}
            </Badge>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {study.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">{study.dek}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-ink-700/60 pb-24 sm:pb-32 lg:pb-40">
        <div className="section-container">
          <div className="mx-auto max-w-3xl space-y-14 pt-16 sm:pt-20">
            {study.sections.map((section, index) => (
              <ScrollReveal key={section.heading} delay={index * 0.04}>
                <h2 className="text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-400">{section.body}</p>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={0.2} className="rounded-xl border border-dashed border-ink-700 p-6">
              <p className="text-sm leading-relaxed text-ink-500">{study.closingNote}</p>
            </ScrollReveal>
          </div>
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
              Curious what this would look like inside your business?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-200">
              Run your own numbers, or talk to us directly — either way, you&apos;ll see something more concrete than a
              sales pitch.
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
