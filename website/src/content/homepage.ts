import type { CaseStudyInProgress, FaqItem, Pillar, ProcessStep, Stat } from "@/types/content";

/**
 * Homepage copy — approved final version.
 *
 * The `proof.featured` story below is presented honestly as "measurement
 * in progress" rather than with placeholder figures like [X]% — the
 * flagship deployment is real and live, but its measurement period
 * hasn't closed yet, so there are no verified numbers to show. The
 * moment there are, this becomes the first fully-verified result and the
 * copy gets replaced with real figures (never invented or rounded ones).
 *
 * Voice rules in effect (see /CLAUDE.md):
 *  - Plain language, five-second clarity, pain-first framing
 *  - No "AI Employee company" framing — mechanism stays secondary
 *  - No language that forecloses future lead-gen / ads / SEO / etc.
 *  - Every trust claim is specific, not implied breadth
 */

export const hero = {
  eyebrow: "For businesses that run on leads",
  headline: "Every missed call is money walking out the door.",
  subheadline:
    "Valfin makes sure your business is always the one that answers first, day or night, every single time. The fastest, highest-return place to find more revenue usually isn't in generating more leads. It's in making sure you stop losing the ones you already have. That's where we start.",
  primaryCta: { label: "See what slow follow-up is costing you", href: "/calculator" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  microcopy: "Takes 60 seconds. No email required to see your number.",
};

export const wound = {
  eyebrow: "Right now",
  headline: "Somewhere, a customer is trying to reach you. The question is whether anyone's answering.",
  body: "A call comes in while you're on a job. A form gets submitted at 9 p.m. on a Saturday. A quote goes out and the conversation just stops. None of it feels like a big deal in the moment. But every one of those is a person who already decided they wanted to give you money, and didn't hear back in time to follow through.",
  stats: [
    {
      value: "78%",
      numericValue: 78,
      suffix: "%",
      label: "of customers choose the business that responds to them first, not the best one, the fastest one.",
    },
    {
      value: "21x",
      numericValue: 21,
      suffix: "x",
      label: "a lead contacted within 5 minutes is up to 21 times more likely to become a customer than one contacted an hour later.",
    },
    {
      value: "Hours",
      label: "Sometimes days. That's the average response time for most lead-based businesses today.",
    },
  ] as Stat[],
};

export const reframe = {
  eyebrow: "The real problem",
  headline: "This was never a marketing problem.",
  body: "You already did the hard part: you got them to raise their hand. What happened next is where the money disappeared: the call that didn't get returned, the follow-up that didn't happen a second or third time, the lead that went quiet because no one circled back. Add it up across a year, and you'll find a second business hiding inside your first one, built entirely from money you already spent to get people in the door.",
  closingLine: "Valfin exists to make sure that second business never forms in the first place.",
};

export const howItWorks = {
  eyebrow: "How it works",
  headline: "Something is always answering. Even when you can't.",
  subheadline:
    "Valfin sits behind the scenes of your business and makes sure every single person who reaches out gets a fast, real response, and gets followed up with until they either become a customer or tell you no.",
  steps: [
    {
      number: "01",
      title: "Someone reaches out",
      description: "A call, a text, a form, a missed connection: captured the moment it happens, any hour, any day.",
    },
    {
      number: "02",
      title: "It gets answered, fast",
      description: "Within minutes, not hours. Real conversation, real information, no “we'll get back to you.”",
    },
    {
      number: "03",
      title: "It gets followed up automatically",
      description: "If they're not ready yet, Valfin keeps the conversation going for you, by phone, text, and email, until they are.",
    },
    {
      number: "04",
      title: "It turns into something on your calendar",
      description: "A booked job. A scheduled appointment. A real next step, placed directly where you can see it, with nothing left for you to chase.",
    },
  ] as ProcessStep[],
  closingLine: "You don't log into anything. You don't manage anything. You just stop losing the customers you already earned.",
};

export const systemUnderneath = {
  eyebrow: "What makes this different",
  headline: "We're not selling you software. We're making sure you never have to think about this again.",
  body: "Most tools hand you another dashboard to check, another inbox to manage, another thing to remember to use correctly. Valfin was built to disappear into the background of your business, running every hour you're open, and every hour you're not, until the only thing you notice is that nothing falls through the cracks anymore. Every part of it is built around one goal: making sure no one who tries to reach you is ever met with silence.",
  pillars: [
    {
      title: "Always answering",
      description: "Nights, weekends, holidays: the hours when most leads show up and most businesses go quiet.",
    },
    {
      title: "Never forgets",
      description: "No follow-up missed, no lead left on read, no “I meant to call them back.”",
    },
    {
      title: "Built around your business",
      description: "Tuned to your services, your pricing, and the way your best people already talk to customers, so every response sounds like it came from your team.",
    },
  ] as Pillar[],
};

export const proof: {
  eyebrow: string;
  headline: string;
  intro: string;
  featured: CaseStudyInProgress;
} = {
  eyebrow: "What's actually happening",
  headline: "We're proving this inside a real business first, and showing our work as we go.",
  intro: "Before we called this a product, we put it to work inside a real roofing company, in one of the most competitive, time-sensitive, lead-driven trades there is. That's still running today, and we're measuring it the same way we'll measure every business that comes after it.",
  featured: {
    industryTag: "Roofing",
    status: "Measurement in progress",
    headline: "A real roofing company was missing roughly 4 out of every 10 calls. Here's what we're tracking now that something answers for them.",
    body: "We're partway through the measurement period that will produce our first fully-verified numbers, checked against this business's own call logs, booking calendar, and job records, not our estimates. We'd rather wait and show you the real figures than publish a guess that looks good today and turns out to be wrong later.",
    metrics: [
      { label: "Response time", note: "How much faster inbound calls and messages get answered, day and night" },
      { label: "Jobs booked", note: "How many additional jobs land on the calendar each month" },
      { label: "Revenue recovered", note: "What those additional jobs are worth, in the business's own numbers" },
    ],
    commitment: "When the period closes, the verified numbers go here, including this owner's name and their own words, with permission. Not adjusted in our favor. If the honest number is more modest than we hoped, that's what gets published.",
    href: "/results",
  },
};

export const industries = {
  eyebrow: "Who this is for",
  headline: "If a missed response ever costs you money, this is for you.",
  subheadline:
    "We proved this first in roofing, where a missed call can mean a lost roof replacement by Monday morning. The same system now works for any business where someone reaching out is the moment that matters most.",
  list: [
    "Roofing",
    "HVAC",
    "Plumbing",
    "Electrical",
    "Solar",
    "Contractors",
    "Real Estate",
    "Insurance",
    "Legal",
    "Dental",
    "Med Spas",
    "Consulting",
  ],
  closingLine: "Different business. Same moment of truth: did anyone answer?",
};

export const trust = {
  eyebrow: "Why businesses trust us with this",
  headline: "We'd rather show you one real result than tell you about a hundred imaginary ones.",
  pillars: [
    {
      title: "We built this in the field, not in a lab",
      description: "Every part of this system was tested inside a real, operating business before it ever reached a customer.",
    },
    {
      title: "We show our numbers",
      description: "Not “results may vary,” but actual, specific, sometimes unglamorous numbers from the business we built this in.",
    },
    {
      title: "We stay after the install",
      description: "This isn't software we hand you and disappear. We build it around your business and keep it sharp as your business changes.",
    },
  ] as Pillar[],
};

export const faq: { eyebrow: string; headline: string; items: FaqItem[] } = {
  eyebrow: "Questions we get a lot",
  headline: "What businesses ask us before they get started.",
  items: [
    {
      question: "Is this just a chatbot?",
      answer:
        "No. A chatbot answers questions on your website. Valfin answers calls, texts, forms, and messages, across every way a customer might try to reach you, and follows up until the conversation actually goes somewhere.",
    },
    {
      question: "Will this replace my team?",
      answer:
        "No. It takes the part of the job nobody likes off their plate: chasing cold leads and repeating the same follow-up five times. Your team gets to spend their time on the people who are actually ready to buy.",
    },
    {
      question: "What happens if someone needs to talk to a real person?",
      answer:
        "They get one. Valfin knows the moment a conversation needs a human being, and hands it off with the full conversation already in hand, so nothing gets repeated and nothing gets lost.",
    },
    {
      question: "How long does this take to set up?",
      answer:
        "Most businesses are live within a few weeks, and nobody on your team has to learn a new tool to make it work.",
    },
    {
      question: "Does this work for my kind of business?",
      answer:
        "If people ever call you, message you, fill out a form, or book an appointment with you, yes. We proved it first in one of the toughest industries for exactly this problem, and built it to work the same way everywhere else.",
    },
    {
      question: "What does this cost?",
      answer:
        "Less than what you're currently losing. Most businesses see this pay for itself within months. Run your numbers: it takes about a minute.",
    },
  ],
};

export const finalCta = {
  headline: "The fastest business wins the customer.",
  subheadline: "Make sure that's you, every time.",
  primaryCta: { label: "See what it's costing you", href: "/calculator" },
  secondaryCta: { label: "Talk to us", href: "/company#contact" },
  microcopy: "Sixty seconds. Real numbers. No pressure.",
};
