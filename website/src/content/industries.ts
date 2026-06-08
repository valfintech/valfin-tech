import type { IndustryVocabulary } from "@/types/content";

/**
 * Industries — index page copy + the shared vocabulary list that powers
 * both the /industries directory and every /industries/[slug] landing
 * page. Keeping this in one typed list is what lets the same page
 * template serve roofing (the proven flagship) and every future vertical
 * with industry-accurate language instead of generic copy.
 *
 * Adding a new industry = adding one entry here. No new components.
 */

export const industriesPage = {
  eyebrow: "Industries",
  headline: "Built first for roofing. Built to work anywhere a missed response costs you money.",
  subheadline:
    "Every business on this list runs on the same moment of truth: someone reaches out, ready to spend money, and what happens in the next few minutes decides whether they become a customer or a competitor's customer. We proved the system in roofing — one of the most competitive, time-sensitive versions of that moment there is — and built it to carry the same logic into every other lead-based business.",
  closingLine: "Don't see your industry? If people call, message, or book with you — this still applies. Talk to us.",
};

export const industryList: IndustryVocabulary[] = [
  {
    slug: "roofing",
    name: "Roofing",
    shortLabel: "Roofing companies",
    customerNoun: "homeowner",
    outcomeNoun: "job",
    painExample:
      "A storm rolls through on a Friday night. Forty homeowners are calling every roofer in the county at once — and the ones who reach a real, fast response by Saturday morning are the ones who get the job, not the ones who hung the nicest banner.",
    winExample:
      "Someone with hail damage calls at 9 p.m. Within minutes, they're talking to something that asks the right questions, books an inspection for Tuesday, and confirms it by text — before they've even thought to call your competitor.",
    isFlagship: true,
  },
  {
    slug: "hvac",
    name: "HVAC",
    shortLabel: "HVAC companies",
    customerNoun: "homeowner",
    outcomeNoun: "service call",
    painExample:
      "It's 95 degrees and someone's air conditioner just died. They're calling three companies back to back — whoever picks up first, and books fastest, is the one who gets paid today.",
    winExample:
      "A no-cool call comes in mid-afternoon. It gets answered, triaged, and placed on the schedule for that evening — with the homeowner getting a confirmation text before they've finished calling around.",
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    shortLabel: "Plumbing companies",
    customerNoun: "homeowner",
    outcomeNoun: "service call",
    painExample:
      "A pipe bursts at 11 p.m. The homeowner is searching \"emergency plumber near me\" and calling down the list. The first one to answer — not the first one to call back in the morning — gets the job.",
    winExample:
      "That same call gets answered in real time, the emergency gets triaged, and a tech is on the calendar for first thing tomorrow — locked in before the homeowner even finishes their search.",
  },
  {
    slug: "electrical",
    name: "Electrical",
    shortLabel: "Electrical contractors",
    customerNoun: "homeowner",
    outcomeNoun: "job",
    painExample:
      "A panel upgrade quote goes out on a Tuesday. The homeowner says \"let me think about it\" — and without a system built to follow up, that's usually the last anyone hears from them.",
    winExample:
      "That same quote gets a check-in three days later, then a helpful nudge a week after that — not pushy, just present — right up until the homeowner is ready to say yes.",
  },
  {
    slug: "solar",
    name: "Solar",
    shortLabel: "Solar companies",
    customerNoun: "homeowner",
    outcomeNoun: "consultation",
    painExample:
      "A homeowner fills out a form after watching one too many ads. If nobody calls within the hour, they've already forgotten which company it was — and the lead you paid for becomes someone else's appointment.",
    winExample:
      "That form submission gets a real response within minutes — not a generic email — and a consultation gets booked while the homeowner is still in \"yes, let's look into this\" mode.",
  },
  {
    slug: "contractors",
    name: "General Contractors",
    shortLabel: "General contractors",
    customerNoun: "homeowner",
    outcomeNoun: "project",
    painExample:
      "A remodel inquiry comes in through a referral. It sits in a text thread for four days while the homeowner quietly gets two more quotes — and picks whichever contractor made them feel like a priority first.",
    winExample:
      "That inquiry gets a same-day response, a few clarifying questions, and a walkthrough on the calendar — making the homeowner feel chosen before a single competitor calls back.",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    shortLabel: "Real estate teams",
    customerNoun: "buyer or seller",
    outcomeNoun: "showing",
    painExample:
      "A buyer inquires about a listing at 10 p.m. on a Sunday. By Monday morning, three other agents have already reached out — and the lead you spent money to generate is now someone else's closing.",
    winExample:
      "That same inquiry gets a warm, real-time response Sunday night, a showing gets proposed for the next afternoon, and the buyer walks into Monday already feeling like they have an agent.",
  },
  {
    slug: "insurance",
    name: "Insurance",
    shortLabel: "Insurance agencies",
    customerNoun: "prospect",
    outcomeNoun: "policy review",
    painExample:
      "A quote request comes in online. It sits in a queue until Monday — by which point the prospect has already bound a policy with whoever called them back first on Friday afternoon.",
    winExample:
      "That request gets acknowledged within minutes, the right questions get asked, and a policy review gets scheduled — before the prospect has had a chance to fill out a second form elsewhere.",
  },
  {
    slug: "legal",
    name: "Legal",
    shortLabel: "Law firms",
    customerNoun: "prospective client",
    outcomeNoun: "consultation",
    painExample:
      "Someone calls a personal injury firm the day after an accident — scared, overwhelmed, and calling two or three firms at once. Whoever sounds most ready to help first usually wins the case, before any attorney even hears about it.",
    winExample:
      "That call gets answered immediately, the intake gets handled with care, and a consultation lands on the calendar before the prospective client has finished searching for a second opinion.",
  },
  {
    slug: "dental",
    name: "Dental",
    shortLabel: "Dental practices",
    customerNoun: "patient",
    outcomeNoun: "appointment",
    painExample:
      "A new patient calls about a toothache during lunch, when the front desk is swamped. The call goes to voicemail — and by 1 p.m., they've booked with the practice down the street that picked up.",
    winExample:
      "That call gets answered the moment it comes in, an appointment gets found for the same week, and the patient shows up already feeling looked after — before they've set foot in the office.",
  },
  {
    slug: "med-spas",
    name: "Med Spas",
    shortLabel: "Med spas & aesthetics",
    customerNoun: "client",
    outcomeNoun: "consultation",
    painExample:
      "A first-time client messages on Instagram asking about a treatment. If nobody responds within the hour, they've already booked the place that answered first — taste and reputation aside.",
    winExample:
      "That message gets a fast, knowledgeable reply, a consultation gets offered, and the client books before the moment of curiosity passes — exactly when they're most ready to say yes.",
  },
  {
    slug: "consulting",
    name: "Consulting & Professional Services",
    shortLabel: "Consulting firms",
    customerNoun: "prospective client",
    outcomeNoun: "discovery call",
    painExample:
      "A discovery-call request comes in through the website. It sits in an inbox for three days — and by the time someone replies, the prospect has already booked time with a competitor who answered the same day.",
    winExample:
      "That request gets a same-day response, a discovery call gets scheduled, and the prospect walks in already feeling like this firm is the one that has its act together.",
  },
];

export function getIndustryBySlug(slug: string): IndustryVocabulary | undefined {
  return industryList.find((industry) => industry.slug === slug);
}
