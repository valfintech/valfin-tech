import type { CaseStudyResult } from "@/types/content";

/**
 * Results — case study index + detail content.
 *
 * Brand rule in effect: "radical specificity over implied breadth." We'd
 * rather show one real, fully-documented result than gesture at a wall of
 * vague logos. The roofing flagship is the only fully real entry right
 * now (marked `isPlaceholder` until verified figures land); the rest of
 * this file is the architecture that future case studies slot into the
 * moment they exist — same template, same standard of proof.
 */

export const resultsPage = {
  eyebrow: "Results",
  headline: "We'd rather show you one real result than tell you about a hundred imaginary ones.",
  subheadline:
    "Every number on this page is traceable back to a real business, a real time period, and a real before-and-after. Where we don't yet have verified numbers from a deployment, we say so plainly — instead of dressing up a placeholder as proof.",
};

export const caseStudies: CaseStudyResult[] = [
  {
    industryTag: "Roofing",
    headline: "[Company Name] was missing 4 out of every 10 calls. Here's exactly what changed.",
    stats: [
      { value: "[X]%", label: "of calls now answered within [X] minutes, day or night" },
      { value: "[X]", label: "additional jobs booked per month since going live" },
      { value: "$[X]", label: "in revenue that would have gone to a competitor" },
    ],
    quote: "We didn't spend a dollar more on leads. We just stopped losing them.",
    attribution: "[Owner Name], [Company Name]",
    href: "/results/roofing-flagship",
    isPlaceholder: true,
  },
];

export const featuredCaseStudy = caseStudies[0];

/**
 * Long-form detail content for the flagship case study page. Structured
 * as a before / build / after narrative — the same shape every future
 * case study will follow, regardless of industry.
 */
export const flagshipCaseStudy = {
  slug: "roofing-flagship",
  industryTag: "Roofing",
  title: "[Company Name]: How a roofing company stopped losing jobs to slow follow-up",
  dek: "Before this became something we offered to other businesses, we built it inside a real, operating roofing company — and measured every part of it. This is the story of what we found, what we built, and what changed.",
  before: {
    heading: "Where things stood",
    body: "Like most growing roofing companies, [Company Name] wasn't short on leads — storm seasons, referrals, and ad spend kept the phone ringing. The problem showed up in the gap between a lead coming in and someone actually responding to it: calls during job site hours going to voicemail, after-hours inquiries sitting until the next morning, quotes going out and the conversation simply stopping. None of it looked like a crisis day to day. Added up over a quarter, it looked like a second roofing company's worth of revenue — quietly walking out the door.",
    stat: { value: "[X]%", label: "of inbound calls were going unanswered before the system went live" },
  },
  build: {
    heading: "What we built",
    body: "We didn't start by trying to sell [Company Name] anything — we built the system inside their business, around their existing number, their existing crews, and their existing way of working. It started answering every call, text, and form within minutes, asking the right qualifying questions for a roofing inquiry specifically, and booking inspections directly onto the calendar the office already used. Anything that needed a real person got handed off — with the full conversation already attached, so nothing had to be repeated.",
    stat: { value: "[X] weeks", label: "from first conversation to the system going fully live" },
  },
  after: {
    heading: "What changed",
    body: "Within the first full measurement period, [Company Name] went from missing roughly four in ten calls to answering nearly all of them — at any hour, on any day. The jobs that used to slip away during a busy storm week started showing up on the calendar instead. And the team didn't have to change how they worked, learn new software, or hire anyone to make it happen.",
    stats: [
      { value: "[X]%", label: "of inbound contacts now answered within [X] minutes" },
      { value: "[X]", label: "additional jobs booked per month, on the same lead volume" },
      { value: "$[X]", label: "in estimated monthly revenue recovered" },
    ],
  },
  quote: {
    text: "We didn't spend a dollar more on leads. We just stopped losing them.",
    attribution: "[Owner Name], Owner, [Company Name]",
  },
  closingNote:
    "These figures will be replaced with verified, audited numbers as soon as the flagship deployment's measurement period closes — not adjusted upward, not rounded in our favor. That's the standard every future case study on this page will be held to.",
};
