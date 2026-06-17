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
    tagline: "Everything you need to capture, engage, and book more opportunities.",
    priceLabel: "$497/mo",
    priceNote: "Includes our 60-Day Proof Period",
    description:
      "Built for service businesses that want to stop losing opportunities, follow up instantly, and turn more inquiries into booked jobs — without adding office staff.",
    features: [
      "Capture leads from your website, forms, and social inquiries",
      "Instant SMS and email follow-up",
      "Automatic engagement with every inbound opportunity",
      "Lost lead reactivation and continued follow-up",
      "Appointment booking workflows",
      "Owner notifications and team alerts",
      "One organized view of every conversation and status",
      "Daily, weekly, and monthly reporting",
      "Faster response times with less manual work",
    ],
    proofPeriod: {
      title: "60-Day Proof Period",
      body: "We work alongside your team so you can experience the system in action before making a long-term commitment. The goal is simple: prove the value through real conversations and booked opportunities.",
    },
    cta: { label: "Book Your Strategy Call", href: "/company#contact" },
    isFeatured: true,
  },
  {
    name: "Custom Systems",
    tagline: "Automation designed around how your business actually operates.",
    priceLabel: "Starting at $1,500/mo",
    description:
      "For businesses that require advanced workflows, department-specific processes, or systems tailored to their existing operations.",
    features: [
      "Advanced workflow automation",
      "Multi-step nurture and reactivation campaigns",
      "Team routing and department automations",
      "CRM customization and reporting dashboards",
      "Integrations with existing software",
      "Multi-location configurations",
      "Industry-specific processes and workflows",
    ],
    cta: { label: "Talk to Us About a Custom Build", href: "/company#contact" },
  },
];

export const pricingFaq: FaqItem[] = [
  {
    question: "Which plan is right for me?",
    answer:
      "Most businesses start with the Core Growth System; it covers capture, follow-up, recovery, booking, and reporting in one place. Custom Systems is for the smaller number of operations that need something built specifically around how they already work. If you're not sure, start the conversation and we'll point you to the right one.",
  },
  {
    question: "What does the 60-Day Proof Period mean?",
    answer:
      "Before you commit to anything long-term, we work alongside your team through the first 60 days so you can see the system performing against real conversations and real opportunities — not a demo. If we haven't demonstrated clear value by then, we haven't earned the relationship.",
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
