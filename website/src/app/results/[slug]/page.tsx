import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { flagshipCaseStudy } from "@/content/results";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Case study detail template — before / build / after narrative shape.
 * Currently powers only the flagship roofing story; built so that every
 * future documented result slots into the same structure (and the same
 * standard of proof) without a new template.
 */
const caseStudiesBySlug = {
  [flagshipCaseStudy.slug]: flagshipCaseStudy,
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

  const sections = [study.before, study.build, study.after];

  return (
    <>
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
            {sections.map((section, index) => (
              <ScrollReveal key={section.heading} delay={index * 0.04}>
                <p className="text-eyebrow">{["Before", "What we built", "What changed"][index]}</p>
                <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-400">{section.body}</p>

                {"stat" in section && section.stat ? (
                  <div className="mt-6 inline-block rounded-xl border border-ink-700 bg-ink-900/50 px-6 py-4">
                    <p className="text-2xl font-semibold tracking-tight text-ink-50">{section.stat.value}</p>
                    <p className="mt-1 text-sm text-ink-400">{section.stat.label}</p>
                  </div>
                ) : null}

                {"stats" in section && section.stats ? (
                  <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {section.stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-ink-700 bg-ink-900/50 p-5">
                        <dt className="sr-only">{stat.label}</dt>
                        <dd className="text-2xl font-semibold tracking-tight text-ink-50">{stat.value}</dd>
                        <p className="mt-1 text-sm text-ink-400">{stat.label}</p>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </ScrollReveal>
            ))}

            <ScrollReveal delay={0.16} className="border-l-2 border-accent-500/50 pl-5">
              <p className="text-lg italic leading-relaxed text-ink-200">&ldquo;{study.quote.text}&rdquo;</p>
              <footer className="mt-2 text-sm text-ink-400">— {study.quote.attribution}</footer>
            </ScrollReveal>

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
