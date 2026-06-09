/**
 * Shared content types. Section components receive typed content objects
 * (never hard-coded copy) so that copy can be edited — by a person or a
 * future Claude session — without touching component logic, and so the
 * same section components can power industry-specific landing pages by
 * simply receiving different content.
 */

export type Stat = {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type Pillar = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type CaseStudyResult = {
  industryTag: string;
  headline: string;
  stats: Stat[];
  quote: string;
  attribution: string;
  href: string;
  isPlaceholder?: boolean;
};

/**
 * A case study that is real (not hypothetical, not a demo) but whose
 * measurement period hasn't closed yet — so no verified figures exist
 * to publish. This is the honest alternative to showing placeholder
 * brackets like "[X]%" as if they were real numbers: we name what's
 * being measured and how, without claiming a result we don't have yet.
 */
export type CaseStudyInProgress = {
  industryTag: string;
  status: string;
  headline: string;
  body: string;
  metrics: { label: string; note: string }[];
  commitment: string;
  href: string;
};

export type MethodologySection = {
  heading: string;
  body: string;
};

/**
 * Detail-page content for an in-progress case study — reframed as a
 * transparent walkthrough of *how* a result will be measured and proven,
 * rather than a finished narrative wearing placeholder numbers as if
 * they were real.
 */
export type MeasurementMethodology = {
  slug: string;
  industryTag: string;
  title: string;
  dek: string;
  sections: MethodologySection[];
  closingNote: string;
};

export type IndustryVocabulary = {
  slug: string;
  name: string;
  /** Short plural label used in lists/cards, e.g. "Roofing companies" */
  shortLabel: string;
  /** What this industry calls a "lead" — e.g. "homeowner", "patient", "client" */
  customerNoun: string;
  /** What this industry calls a "job" — e.g. "job", "appointment", "case", "consultation" */
  outcomeNoun: string;
  /** A specific, vivid example of a missed-opportunity moment in this industry */
  painExample: string;
  /** A specific moment where fast response changes the outcome */
  winExample: string;
  isFlagship?: boolean;
};

export type PricingPlan = {
  name: string;
  tagline: string;
  priceLabel: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  isFeatured?: boolean;
};

export type TimelineEntry = {
  marker: string;
  title: string;
  description: string;
};

export type TeamPrinciple = {
  title: string;
  description: string;
};
