import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { termsAndConditions } from "@/content/legal";
import { breadcrumbSchema } from "@/lib/structured-data";

const TITLE = "Terms & Conditions — Valfin";
const DESCRIPTION = "The terms that govern your use of valfintech.com.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms" },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Terms & Conditions", path: "/terms" }])} />
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl">
            <p className="text-eyebrow">{termsAndConditions.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {termsAndConditions.title}
            </h1>
            <p className="mt-4 text-sm text-ink-500">Effective {termsAndConditions.effectiveDate}</p>
            <div className="mt-6 space-y-4">
              {termsAndConditions.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-ink-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="section-container">
          <div className="mx-auto max-w-3xl space-y-12">
            {termsAndConditions.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight text-ink-50 sm:text-2xl">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-ink-400">
                      {paragraph}
                    </p>
                  ))}
                  {section.list ? (
                    <ul className="space-y-2.5 pl-1">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 24)} className="flex items-start gap-2.5 text-base leading-relaxed text-ink-400">
                          <span className="mt-2.5 size-1.5 flex-shrink-0 rounded-full bg-accent-500/60" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
