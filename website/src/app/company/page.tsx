import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { ContactForm } from "@/components/company/contact-form";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import {
  companyHero,
  contact,
  originStory,
  principles,
  timeline,
  vision,
} from "@/content/company";
import { breadcrumbSchema } from "@/lib/structured-data";

const TITLE = "Company - Why Valfin exists | Valfin";
const DESCRIPTION =
  "Valfin started inside one real roofing company, not a lab. Here's the story of the problem we found, what we built to fix it, and where we're taking it next.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/company" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/company" },
};

export default function CompanyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Company", path: "/company" }])} />
      {/* Hero */}
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow justify-center">{companyHero.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {companyHero.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">{companyHero.subheadline}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Origin story */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <p className="text-eyebrow">{originStory.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                {originStory.headline}
              </h2>
            </ScrollReveal>
            <div className="mt-6 space-y-5">
              {originStory.paragraphs.map((paragraph, index) => (
                <ScrollReveal key={paragraph.slice(0, 24)} delay={index * 0.04}>
                  <p className="text-base leading-relaxed text-ink-400">{paragraph}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow="The path so far" headline="From one business's problem to a system built for many" />
          <div className="mt-12 space-y-8">
            {timeline.map((entry, index) => (
              <ScrollReveal key={entry.title} delay={index * 0.03} className="grid gap-3 border-l-2 border-ink-700 pl-6 sm:grid-cols-[10rem_1fr] sm:gap-8 sm:pl-0 sm:border-l-0">
                <div className="sm:border-l-2 sm:border-accent-500/40 sm:pl-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-400">{entry.marker}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink-50">{entry.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-400">{entry.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-900 to-ink-900/40 p-8 sm:p-12">
            <p className="text-eyebrow">{vision.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
              {vision.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-300">{vision.body}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Principles */}
      <section className="section-padding border-t border-ink-700/60">
        <div className="section-container">
          <SectionHeader eyebrow="How we operate" headline="The principles that don't move, no matter how big this gets" />
          <ScrollRevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" staggerAmount={0.06}>
            {principles.map((principle) => (
              <ScrollRevealItem key={principle.title}>
                <div className="h-full rounded-xl border border-ink-700 bg-ink-900/40 p-6">
                  <h3 className="text-lg font-semibold text-ink-50">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{principle.description}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding border-t border-ink-700/60 scroll-mt-20">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <p className="text-eyebrow">{contact.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-50 sm:text-3xl">
                {contact.headline}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-400">{contact.subheadline}</p>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {contact.email}
                </a>
                <a
                  href="https://www.instagram.com/valfintech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-200"
                >
                  <InstagramIcon className="size-4" />
                  @valfintech on Instagram
                </a>
              </div>

              <div className="mt-6">
                <ButtonLink
                  href={contact.calculatorPrompt.href}
                  variant="ghost"
                  className="text-ink-200 hover:bg-ink-800 hover:text-ink-50"
                >
                  {contact.calculatorPrompt.label}
                </ButtonLink>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <div id="contact-form">
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
