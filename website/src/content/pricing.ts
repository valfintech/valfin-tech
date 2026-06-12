import type { FaqItem, PricingPlan } from "@/types/content";

/**
 * Pricing — copy + plan structure.
 *
 * Positioning rule in effect: price is framed against what slow follow-up
 * is already costing the business (see the Lead Leak Calculator), not
 * against "what software costs." This keeps the page consistent with the
 * homepage's reframe ("this was never a marketing problem") and avoids
 * the trap of competing on features against CRMs and point tools.
 */

export const pricingPage = {
  eyebrow: "Pricing",
  headline: "Priced against what you're losing, not against what software usually costs.",
  subheadline:
    "Most businesses lose far more to slow follow-up every month than this costs to fix. That's the comparison that matters, not feature lists. Run your numbers on the calculator first; then this page will make a lot more sense.",
  calculatorPrompt: {
    label: "Not sure where you'd land? See your number first",
    href: "/calculator",
  },
  /**
   * Short orientation copy shown directly above the three plan cards.
   * Added to address "pricing clarity" — visitors were landing on three
   * cards that all say "Custom" / "Let's talk" with no immediate sense
   * of how to tell them apart or which one fits their situation. This
   * gives a one-glance frame for reading the cards before the FAQ (which
   * explains *why* there's no published price) ever comes into view.
   */
  tiersIntro: {
    eyebrow: "How the three compare",
    headline: "One system, three starting points",
    subheadline:
      "All three are the same underlying system: the difference is how much of your pipeline it's covering on day one. Most businesses start with Foundation or Growth; \"Built for you\" exists for the handful of operations complex enough to need a custom shape from the start.",
  },
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Foundation",
    tagline: "For businesses ready to stop losing leads to slow response",
    priceLabel: "Custom",
    priceNote: "Built around your call volume and team setup",
    description:
      "Everything required to make sure your business answers fast, every time: calls, texts, and forms covered, day and night, with a clean handoff to your team whenever a real person is needed.",
    features: [
      "Always-on response across calls, texts, and web forms",
      "Fast qualifying conversation, in your business's voice",
      "Direct booking onto the calendar your team already uses",
      "Human handoff with full conversation context, nothing repeated",
      "Weekly visibility into what came in and what happened to it",
    ],
    cta: { label: "Talk to us about Foundation", href: "/company#contact" },
  },
  {
    name: "Growth",
    tagline: "For businesses ready to recover leads that already went quiet",
    priceLabel: "Custom",
    priceNote: "Built around your call volume, team setup, and pipeline size",
    description:
      "Everything in Foundation, plus ongoing follow-up that keeps working a lead until it becomes a customer or a clear no, recovering the part of your pipeline that usually goes cold and gets forgotten.",
    features: [
      "Everything in Foundation",
      "Automatic, multi-touch follow-up across phone, text, and email",
      "Re-engagement of past quotes and stalled conversations",
      "Custom qualifying logic for your specific business and offers",
      "Monthly review of what's working and what to adjust",
    ],
    cta: { label: "Talk to us about Growth", href: "/company#contact" },
    isFeatured: true,
  },
  {
    name: "Built for you",
    tagline: "For multi-location, franchise, or higher-volume operations",
    priceLabel: "Let's talk",
    priceNote: "Scoped around your structure, locations, and goals",
    description:
      "For businesses with more complexity: multiple locations, layered teams, or unique systems already in place. We design the system around how your business actually runs, not the other way around.",
    features: [
      "Everything in Growth",
      "Multi-location and multi-team configuration",
      "Custom integrations with the tools you already rely on",
      "A dedicated build-and-tune relationship, not a self-serve tool",
      "Priority access as new capabilities roll out",
    ],
    cta: { label: "Talk to us about a custom build", href: "/company#contact" },
  },
];

export const pricingFaq: FaqItem[] = [
  {
    question: "Why isn't there a price on the page?",
    answer:
      "Because the honest answer depends on how many leads come through your business and how your team works today, and a number that ignores that would either be misleading or wrong. We'd rather understand your situation for fifteen minutes and give you a real answer than publish a number that doesn't apply to you.",
  },
  {
    question: "How should I think about whether this is worth it?",
    answer:
      "Run your numbers on the Lead Leak Calculator first. Most businesses find that what they're losing every month to slow follow-up is several times what this costs to fix, which is the only comparison that actually matters.",
  },
  {
    question: "Is there a contract? What if it doesn't work for my business?",
    answer:
      "We'll walk you through exactly how this works before you commit to anything. The goal is a long relationship built on results, not a lock-in built on fine print.",
  },
  {
    question: "Do I need new software or hardware to use this?",
    answer:
      "No. It's built to work with the number, calendar, and tools your business already uses. Nobody on your team has to learn a new system to benefit from this.",
  },
  {
    question: "How is this priced compared to hiring someone?",
    answer:
      "Considerably less than a single front-desk hire, and it works 24 hours a day, never calls in sick, and never forgets to follow up. For most businesses, it pays for itself well before the first month is over.",
  },
];
