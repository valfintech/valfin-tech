import type { FaqItem, Pillar, ProcessStep } from "@/types/content";

/**
 * How It Works — the deep-dive version of the homepage's process section.
 * Same four-step backbone (for narrative consistency across the site),
 * expanded with the "underneath the hood" detail a more skeptical or
 * more technical visitor will want before they trust this with their
 * phone number.
 */

export const howItWorksHero = {
  eyebrow: "How it works",
  headline: "Not a tool you operate. A system that runs underneath your business.",
  subheadline:
    "Most software asks you to change how you work. Valfin was built to do the opposite — it slots in behind the way your business already runs, and quietly makes sure that nothing which reaches out to you ever goes unanswered.",
};

export const detailedSteps: (ProcessStep & { detail: string })[] = [
  {
    number: "01",
    title: "Someone reaches out",
    description: "A call, a text, a form, a missed connection — captured the moment it happens, any hour, any day.",
    detail:
      "It doesn't matter whether it's 10 a.m. on a Tuesday or 11 p.m. on a Sunday — or whether it comes in as a phone call, a text message, a website form, or a Facebook message. Every channel a customer might use to reach your business gets covered, captured, and routed into one place the moment it happens. Nothing sits in a separate inbox waiting to be noticed.",
  },
  {
    number: "02",
    title: "It gets answered — fast",
    description: "Within minutes, not hours. Real conversation, real information, no “we'll get back to you.”",
    detail:
      "The response isn't a canned message or a chatbot script. It's a real, fast, qualifying conversation — built around your business's specific services, service area, and the questions that actually matter for your industry. It sounds like your business, because it's built around your business, not a generic template stretched to fit.",
  },
  {
    number: "03",
    title: "It gets followed up — automatically",
    description: "If they're not ready yet, Valfin keeps the conversation going for you — by phone, text, and email — until they are.",
    detail:
      "Most leads don't convert on the first conversation — they need a second touch, a third, sometimes a fifth, spaced out over days or weeks. That's exactly the part most businesses don't have time to do consistently — and exactly the part Valfin handles automatically, in your voice, until the person either becomes a customer or gives a clear no.",
  },
  {
    number: "04",
    title: "It turns into something on your calendar",
    description: "A booked job. A scheduled appointment. A real next step — placed directly where you can see it, with nothing left for you to chase.",
    detail:
      "The end of every successful conversation is a concrete next step — a booked inspection, a scheduled service call, a confirmed consultation — placed directly onto the calendar or system your team already uses. No new dashboard. No export. No \"check this other app too.\" Just a job that's now on your calendar that wouldn't have been there otherwise.",
  },
];

export const handoff = {
  eyebrow: "When it needs a human",
  headline: "It knows the moment a real person needs to step in — and makes that handoff seamless.",
  body: "Not every conversation should end with a machine. Complex questions, frustrated customers, high-stakes moments — Valfin recognizes them and hands the conversation to your team immediately, with the entire exchange already attached. Nothing gets repeated. Nothing gets lost in translation. Your team picks up exactly where the conversation left off, looking like they've been part of it the whole time — because, in every way that matters, they have been.",
};

export const underTheHood: Pillar[] = [
  {
    title: "It learns your business specifically",
    description: "Not a generic script — a system trained on your services, your service area, your pricing logic, and the way your best people already talk to customers.",
  },
  {
    title: "It gets sharper with every conversation",
    description: "Every interaction adds to its understanding of how your customers ask, hesitate, and decide — so the next conversation is a little better than the last.",
  },
  {
    title: "It works inside the tools you already use",
    description: "Your calendar, your CRM, your phone number — Valfin is built to slot into what you already run, not to replace it with something new to learn.",
  },
];

export const setup = {
  eyebrow: "Getting started",
  headline: "Most businesses are live within a few weeks — and nobody has to learn a new tool.",
  steps: [
    {
      number: "01",
      title: "A real conversation about your business",
      description: "We learn how leads move through your business today — where they come from, what a good one looks like, and where things tend to go quiet.",
    },
    {
      number: "02",
      title: "We build the system around you",
      description: "Configured to your services, your voice, your service area, and the calendar or CRM your team already relies on — not the other way around.",
    },
    {
      number: "03",
      title: "It goes live, and we watch it closely",
      description: "Early conversations get reviewed and tuned by real people — not left to run unsupervised on day one.",
    },
    {
      number: "04",
      title: "It keeps getting sharper",
      description: "We stay involved after launch — refining, adjusting, and improving the system as your business and your busy seasons change.",
    },
  ] as ProcessStep[],
};

export const howItWorksFaq: FaqItem[] = [
  {
    question: "Will it sound like a robot to my customers?",
    answer:
      "No. It's built to sound like a fast, capable member of your team — not a script reader. Most customers don't realize they're not talking to a person until they're told, and at that point they're usually just glad someone answered quickly.",
  },
  {
    question: "What if it gets something wrong?",
    answer:
      "It's built to recognize the edges of what it should handle — and to bring in a real person the moment a conversation moves outside them. It would rather hand off too early than guess and get it wrong.",
  },
  {
    question: "Do I have to manage or check on it daily?",
    answer:
      "No. That's the point. You'll get clear, regular visibility into what came in and what happened to it — without having to log into anything or manage a new system day to day.",
  },
  {
    question: "What does my team need to do differently?",
    answer:
      "Almost nothing. The conversations that need a human still reach a human — just better-prepared, with full context, and only when it actually matters.",
  },
];
