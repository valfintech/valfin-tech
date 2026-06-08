import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { caseStudies, resultsPage } from "@/content/results";

const TITLE = "Results — Real numbers from real businesses | Valfin";
const DESCRIPTION =
  "Every number on this page traces back to a real business and a real before-and-after. We'd rather show you one documented result than a wall of vague claims.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/results" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/results" },
};

export default function ResultsPage() {
  return (
    <>
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow justify-center">{resultsPage.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {resultsPage.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">{resultsPage.subheadline}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32 lg:pb-40">
        <div className="section-container space-y-8">
          {caseStudies.map((study) => (
            <ScrollReveal key={study.href}>
              <Link
                href={study.href}
                className="group block rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-900 to-ink-900/40 p-8 transition-colors hover:border-accent-500/40 sm:p-10 lg:p-12"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="border-accent-500/40 bg-accent-500/10 text-accent-400">
                    {study.industryTag}
                  </Badge>
                  {study.isPlaceholder ? (
                    <span className="text-xs text-ink-600">Figures pending verification from the live deployment</span>
                  ) : null}
                </div>

                <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                  {study.headline}
                </h2>

                <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {study.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="text-3xl font-semibold tracking-tight text-ink-50">{stat.value}</dd>
                      <p className="mt-1 text-sm text-ink-400">{stat.label}</p>
                    </div>
                  ))}
                </dl>

                <blockquote className="mt-8 border-l-2 border-accent-500/50 pl-5">
                  <p className="text-lg italic leading-relaxed text-ink-200">&ldquo;{study.quote}&rdquo;</p>
                  <footer className="mt-2 text-sm text-ink-400">— {study.attribution}</footer>
                </blockquote>

                <span className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                  Read exactly how it happened
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={0.08} className="rounded-2xl border border-dashed border-ink-700 p-8 text-center sm:p-10">
            <p className="text-base leading-relaxed text-ink-400">
              More case studies are being documented as new industries come online — each one held to the same
              standard: real numbers, real businesses, nothing rounded in our favor.
            </p>
            <div className="mt-6">
              <ButtonLink href="/calculator" size="lg" className="bg-accent-500 text-white hover:bg-accent-400">
                See what your number might look like
                <ArrowRight className="ml-1 size-4" />
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
