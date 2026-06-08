import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { industriesPage, industryList } from "@/content/industries";
import { breadcrumbSchema } from "@/lib/structured-data";

const TITLE = "Industries — Valfin works for any business that runs on leads";
const DESCRIPTION =
  "Proven first in roofing — one of the most competitive, time-sensitive lead-driven industries there is — and built to work the same way for HVAC, plumbing, real estate, legal, dental, insurance, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/industries" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} />
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow justify-center">{industriesPage.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {industriesPage.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
              {industriesPage.subheadline}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32 lg:pb-40">
        <div className="section-container">
          <ScrollRevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerAmount={0.05}>
            {industryList.map((industry) => (
              <ScrollRevealItem key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-ink-700 bg-ink-900/40 p-6 transition-colors hover:border-accent-500/40 hover:bg-ink-900/70"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-ink-50">{industry.name}</h2>
                    {industry.isFlagship ? (
                      <span className="rounded-full border border-accent-500/40 bg-accent-500/10 px-2.5 py-0.5 text-xs font-medium text-accent-400">
                        Flagship
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-400">{industry.painExample}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                    See how it applies to {industry.shortLabel.toLowerCase()}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>

          <ScrollReveal delay={0.1} className="mx-auto mt-14 max-w-2xl text-center">
            <p className="text-lg font-medium text-ink-50">{industriesPage.closingLine}</p>
            <div className="mt-6">
              <ButtonLink
                href="/company#contact"
                size="lg"
                className="bg-accent-500 text-white hover:bg-accent-400"
              >
                Talk to us about your business
                <ArrowRight className="ml-1 size-4" />
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
