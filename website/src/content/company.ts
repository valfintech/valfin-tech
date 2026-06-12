import type { TeamPrinciple, TimelineEntry } from "@/types/content";

/**
 * Company — origin story, principles, vision, and contact copy.
 *
 * Voice rule in effect: the founder story exists to build trust, not to
 * center the founder. It should make a roofing contractor think "these
 * people understand my problem," not "what an interesting person."
 */

export const companyHero = {
  eyebrow: "Why Valfin exists",
  headline: "We didn't start by trying to build a piece of software. We started by trying to fix one business.",
  subheadline:
    "Valfin began inside a single, real, operating company: not a lab, not a deck, not a demo. Everything we've built since has been in service of one idea: that the businesses doing the hard work of earning a customer's attention shouldn't lose that customer to something as fixable as a slow response.",
};

export const originStory = {
  eyebrow: "Where this started",
  headline: "It started with a simple, uncomfortable question.",
  paragraphs: [
    "It started with a simple, uncomfortable question, asked inside a real roofing company: how many of the people who called us this month did we actually call back, and how fast? Nobody had a confident answer. So we measured it. The number was worse than anyone guessed.",
    "What we found wasn't a marketing problem or a quality problem. The leads were there. The reputation was there. The crews were good at the work. The money was disappearing in the gap between \"someone reached out\" and \"someone responded\": a gap measured in hours, sometimes days, that no one could see because no one was looking at it that way.",
    "So we built something to close that gap, inside that business first, before we ever called it a product. We measured what changed. Then we asked a harder question: if this was happening inside one roofing company, how many other businesses (dental practices, law firms, HVAC companies, insurance agencies) were quietly running the same leak, in the same blind spot?",
    "That's the company we built. Not an AI company looking for a problem to solve, but a business that found a very real, very expensive problem first, fixed it for itself, and then built the system to fix it for others.",
  ],
};

export const timeline: TimelineEntry[] = [
  {
    marker: "The problem",
    title: "A roofing company was losing jobs it had already paid to win",
    description:
      "Leads were coming in. Conversion was inconsistent. The cause turned out to be invisible without measurement: slow, inconsistent follow-up, not a lack of demand.",
  },
  {
    marker: "The build",
    title: "We built the fix inside the business, not in a lab",
    description:
      "Every part of the system (the response speed, the qualifying conversation, the follow-up cadence, the handoff to a human) was tested against real calls, real customers, and real outcomes before it touched anyone else's business.",
  },
  {
    marker: "The proof",
    title: "We measured what changed, and only then called it a product",
    description:
      "Once the numbers were real and repeatable, we had something worth offering to other businesses: not a theory about what AI could do, but a documented account of what it actually did.",
  },
  {
    marker: "What's next",
    title: "Carrying the same fix into every business that runs on leads",
    description:
      "Roofing was the proving ground: one of the most competitive, time-sensitive versions of this problem there is. The same system, with the same standard of proof, is now expanding into HVAC, plumbing, real estate, legal, dental, insurance, and beyond.",
  },
];

export const vision = {
  eyebrow: "Where this is going",
  headline: "Our long-term goal isn't to be known as an AI company. It's to be the reason businesses stop losing customers to silence.",
  body: "What you see today is faster response and relentless follow-up, but that's one piece of something larger we're building: a system that sits underneath a business and makes sure nothing it already earned slips away unnoticed. Over time, that means a business owner being able to trust that the revenue they've already worked to generate is being protected, end to end, without having to manage another dashboard to make it happen. We're not trying to be the loudest name in technology. We're trying to be the quiet infrastructure that businesses simply stop having to think about.",
};

export const principles: TeamPrinciple[] = [
  {
    title: "We build in the field, not in a lab",
    description: "Every capability gets proven inside a real, operating business, under real pressure, with real customers, before it ever reaches someone else's.",
  },
  {
    title: "We show our numbers, not our adjectives",
    description: "\"Results may vary\" is not a standard we hold ourselves to. If we can't show you a real number, we'll tell you plainly that we can't yet, and why.",
  },
  {
    title: "We design for businesses, not for demos",
    description: "A system that looks impressive in a sales call but adds friction to a Tuesday afternoon isn't a system worth shipping. We optimize for the latter.",
  },
  {
    title: "We stay after the install",
    description: "This isn't software we hand over and walk away from. We build it around your business and keep tuning it as your business changes.",
  },
];

export const contact = {
  eyebrow: "Let's talk",
  headline: "Tell us about your business. We'll tell you honestly whether this is a fit.",
  subheadline:
    "No pressure, no script, no 45-minute pitch deck. Just a real conversation about how leads move through your business today, and whether closing that gap would make a meaningful difference for you.",
  email: "hello@valfintech.com",
  calendarCta: { label: "Book a time to talk", href: "#contact-form" },
  calculatorPrompt: {
    label: "Or see your number first: it takes about a minute",
    href: "/calculator",
  },
};
