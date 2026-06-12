/**
 * Global site configuration — single source of truth for brand-level
 * constants used across metadata, layout, and structured data.
 *
 * Positioning rules (see /CLAUDE.md):
 *  - Public-facing copy stays plain, outcome-led, pain-aware.
 *  - Never describe Valfin primarily as an "AI Employee company" —
 *    AI Employees are one capability inside a larger system.
 *  - Never use language that forecloses future expansion into lead
 *    generation, paid ads, SEO, appointment-generation, or other
 *    revenue-growth services.
 */
export const siteConfig = {
  name: "Valfin",
  title: "Valfin: Never lose another customer to slow follow-up",
  description:
    "Valfin makes sure your business never loses another customer to slow follow-up. Always-on systems that answer, qualify, follow up, and book, automatically, day and night.",
  url: "https://valfintech.com",
  keywords: [
    "lead response system",
    "missed call recovery",
    "AI follow-up for businesses",
    "appointment booking automation",
    "never miss a lead",
    "revenue recovery for service businesses",
  ],
  nav: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Industries", href: "/industries" },
    { label: "Results", href: "/results" },
    { label: "Pricing", href: "/pricing" },
    { label: "Company", href: "/company" },
  ],
  primaryCta: { label: "See My Numbers", href: "/calculator" },
  secondaryCta: { label: "Talk to us", href: "/company#contact" },
  social: {
    linkedin: "https://www.linkedin.com/company/valfin",
    twitter: "https://x.com/valfin",
  },
} as const;

export type SiteConfig = typeof siteConfig;
