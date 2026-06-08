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

export type IndustryVocabulary = {
  slug: string;
  name: string;
  /** What this industry calls a "lead" — e.g. "homeowner", "patient", "client" */
  customerNoun: string;
  /** What this industry calls a "job" — e.g. "job", "appointment", "case", "consultation" */
  outcomeNoun: string;
  /** A specific, vivid example of a missed-opportunity moment in this industry */
  painExample: string;
  isFlagship?: boolean;
};
