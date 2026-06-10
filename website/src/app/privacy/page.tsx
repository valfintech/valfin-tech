import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { privacyPolicy } from "@/content/legal";
import { breadcrumbSchema } from "@/lib/structured-data";

const TITLE = "Privacy Policy — Valfin";
const DESCRIPTION = "How Valfin Tech collects, uses, and protects information submitted through valfintech.com.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])} />
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-3xl">
            <p className="text-eyebrow">{privacyPolicy.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              {privacyPolicy.title}
            </h1>
            <p className="mt-4 text-sm text-ink-500">Effective {privacyPolicy.effectiveDate}</p>
            <div className="mt-6 space-y-4">
              {privacyPolicy.intro.map((paragraph) => (
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
            {privacyPolicy.sections.map((section) => (
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
