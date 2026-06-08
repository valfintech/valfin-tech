import { siteConfig } from "@/lib/site-config";
import type { FaqItem, IndustryVocabulary } from "@/types/content";

/**
 * Schema.org JSON-LD builders.
 *
 * Centralized so every page produces structured data the same way, with
 * the same brand identity — and so the "AI Employee company" framing
 * rule stays enforced in one place rather than risking drift into how a
 * search engine (or an AI answer engine) describes Valfin. Per /CLAUDE.md:
 * Valfin is described here as a software/automation company that builds
 * lead-response systems — never primarily as an "AI" company.
 */

const BASE_URL = siteConfig.url;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: siteConfig.name,
    url: BASE_URL,
    description: siteConfig.description,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.twitter],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Describes an industry landing page as a Service offered by Valfin —
 * deliberately framed as a lead-response / follow-up automation service
 * for the named industry, not as an "AI" offering.
 */
export function industryServiceSchema(industry: IndustryVocabulary) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Lead response and follow-up automation for ${industry.shortLabel.toLowerCase()}`,
    serviceType: "Business automation / lead response system",
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: "US",
    audience: {
      "@type": "Audience",
      audienceType: industry.shortLabel,
    },
    description: `Valfin makes sure ${industry.shortLabel.toLowerCase()} answer every ${industry.customerNoun} fast, day or night, and follow up until they book a ${industry.outcomeNoun}.`,
    url: `${BASE_URL}/industries/${industry.slug}`,
  };
}

/**
 * Describes a documented case study as an Article — keeps the "radical
 * specificity over implied breadth" trust principle visible to crawlers
 * too: this is reported, dated, attributable content, not marketing copy.
 */
export function caseStudyArticleSchema(params: {
  slug: string;
  title: string;
  description: string;
  industryTag: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    about: params.industryTag,
    author: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    mainEntityOfPage: `${BASE_URL}/results/${params.slug}`,
  };
}
