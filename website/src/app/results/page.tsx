import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { flagshipInProgress, resultsPage } from "@/content/results";
import { breadcrumbSchema } from "@/lib/structured-data";

const TITLE = "Results - Real numbers from real businesses | Valfin";
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
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Results", path: "/results" }])} />
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
          <ScrollReveal>
            <Link
              href={flagshipInProgress.href}
              className="group block rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-900 to-ink-900/40 p-8 transition-colors hover:border-accent-500/40 sm:p-10 lg:p-12"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-accent-500/40 bg-accent-500/10 text-accent-400">
                  {flagshipInProgress.industryTag}
                </Badge>
                <Badge variant="outline" className="border-ink-600 bg-ink-800/60 text-ink-300">
                  {flagshipInProgress.status}
                </Badge>
              </div>

              <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                {flagshipInProgress.headline}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-400">{flagshipInProgress.body}</p>

              <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {flagshipInProgress.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-ink-700/80 bg-ink-900/50 p-5">
                    <dt className="text-sm font-semibold text-ink-50">{metric.label}</dt>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{metric.note}</p>
                  </div>
                ))}
              </dl>

              <blockquote className="mt-8 border-l-2 border-accent-500/50 pl-5">
                <p className="text-base leading-relaxed text-ink-200">{flagshipInProgress.commitment}</p>
              </blockquote>

              <span className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                See exactly how we&apos;re measuring this
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="rounded-2xl border border-dashed border-ink-700 p-8 text-center sm:p-10">
            <p className="text-base leading-relaxed text-ink-400">
              Every additional case study, in every industry we work with, will be held to the same standard
              you see above: real numbers, from real businesses, verified against their own records before they
              ever appear on this page.
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
