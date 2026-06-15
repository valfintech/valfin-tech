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
   * Short orientation copy shown directly above the plan cards.
   * Added to address "pricing clarity" — visitors were landing on cards
   * that all say "Custom" / "Let's talk" with no immediate sense of how
   * to tell them apart or which one fits their situation. This gives a
   * one-glance frame for reading the cards before the FAQ (which explains
   * *why* there's no published price) ever comes into view.
   */
  tiersIntro: {
    eyebrow: "How they compare",
    headline: "One system, two ways to start",
    subheadline:
      "The Core Growth System covers everything most businesses need: capture, follow-up, recovery, booking, and reporting, in one place. Custom Systems exists for the handful of operations that need something built specifically around how they run.",
  },
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Core Growth System",
    tagline: "Everything you need to capture and convert more leads",
    priceLabel: "Custom",
    priceNote: "Built around your lead volume and team setup",
    description:
      "Designed for businesses that want to stop losing leads and automate follow-up without adding more work.",
    features: [
      "Capture leads from your website, contact forms, and social inquiries, all in one place",
      "Instant SMS follow-up, plus automated email follow-up, day and night",
      "Automatic re-engagement of leads that would otherwise go quiet",
      "Simplified booking that moves prospects toward an appointment",
      "One organized view of every lead, conversation, and status",
      "Daily, weekly, and monthly reports on leads, conversations, and bookings",
      "Less manual follow-up, faster responses, and a more consistent experience for every lead",
    ],
    cta: { label: "Book Your Strategy Call", href: "/company#contact" },
    isFeatured: true,
  },
  {
    name: "Custom Systems",
    tagline: "Custom automation solutions for how your business actually operates",
    priceLabel: "Let's talk",
    priceNote: "Scoped around your structure and goals",
    description:
      "For businesses that want systems tailored specifically to how they operate. We build around your business instead of forcing you into a one-size-fits-all system.",
    features: [
      "Advanced workflow automation and custom lead pipelines",
      "Multi-step nurture sequences and reactivation campaigns",
      "Team notifications, routing, and department-specific automations",
      "Custom reporting dashboards and CRM customization",
      "Integrations with the tools your business already runs on",
      "Multi-location and industry-specific configurations",
    ],
    cta: { label: "Talk to us about a custom build", href: "/company#contact" },
  },
];

export const pricingFaq: FaqItem[] = [
  {
    question: "Which plan is right for me?",
    answer:
      "Most businesses start with the Core Growth System; it covers capture, follow-up, recovery, booking, and reporting in one place. Custom Systems is for the smaller number of operations that need something built specifically around how they already work. If you're not sure, start the conversation and we'll point you to the right one.",
  },
  {
    question: "Why isn't there a price on the page?",
    answer:
      "Because the honest answer depends on how many leads come through your business and how your team works today, and a number that ignores that would either be misleading or wrong. We'd rather understand your situation for fifteen minutes and give you a real answer than publish a number that doesn't apply to you.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Yes. Most businesses start with the Core Growth System and move to a Custom System later if their needs grow beyond it, more locations, more complex routing, deeper integrations. Nothing about starting with Core Growth locks you out of that path.",
  },
  {
    question: "Do I need any technical knowledge to use this?",
    answer:
      "No. We handle setup, configuration, and the ongoing automation using the number, calendar, and tools your business already has. Nobody on your team has to learn a new system to benefit from it.",
  },
  {
    question: "Is there a contract? What if it doesn't work for my business?",
    answer:
      "We'll walk you through exactly how this works before you commit to anything. The goal is a long relationship built on results, not a lock-in built on fine print.",
  },
  {
    question: "How is this priced compared to hiring someone?",
    answer:
      "Considerably less than a single front-desk hire, and it works 24 hours a day, never calls in sick, and never forgets to follow up. For most businesses, it pays for itself well before the first month is over.",
  },
];
