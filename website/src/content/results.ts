import type { CaseStudyInProgress, CaseStudyResult, MeasurementMethodology } from "@/types/content";

/**
 * Results — case study index + detail content.
 *
 * Brand rule in effect: "we show our numbers, not our adjectives." We'd
 * rather show one real, fully-documented result than gesture at a wall of
 * vague logos — and we'd rather plainly say "this is still being measured"
 * than dress up a placeholder as proof. Showing "[X]%" on a live page would
 * directly contradict the standard we hold ourselves to, so until the
 * flagship deployment's measurement period closes and the figures are
 * verified against the business's own records, this page says exactly
 * that — honestly, and in a way that's still worth reading.
 *
 * `caseStudies` stays empty until a result is fully verified; the moment
 * one is, it slots in here using the same template every future result
 * will use. `flagshipInProgress` is what visitors see in the meantime.
 */

export const resultsPage = {
  eyebrow: "Results",
  headline: "We'd rather show you one real, verified result than a hundred impressive-looking guesses.",
  subheadline:
    "Every number that appears on this page will be traceable back to a real business, a real measurement period, and a real before-and-after — checked against that business's own records, not our internal estimates. Here's exactly where that stands today.",
};

export const caseStudies: CaseStudyResult[] = [];

/**
 * The honest, current-state version of the flagship story: real
 * deployment, real business, measurement in progress — no invented
 * figures standing in for numbers we don't have yet.
 */
export const flagshipInProgress: CaseStudyInProgress = {
  industryTag: "Roofing",
  status: "Measurement in progress",
  headline: "Our first flagship result is being measured right now, inside a real, operating roofing company.",
  body:
    "This isn't a demo or a pilot running in a lab — it's live, inside a business that depends on it every day. We're partway through the measurement period that will produce the first fully-verified numbers we publish on this site. Rather than estimate ahead of that and round things in our favor, we're choosing to wait and show you exactly what the records say when the period closes.",
  metrics: [
    {
      label: "Response time",
      note: "How quickly inbound calls, texts, and form submissions get a reply — measured before-and-after against the business's own call logs.",
    },
    {
      label: "Jobs booked",
      note: "How many additional jobs land on the calendar each month, on the same lead volume the business already had.",
    },
    {
      label: "Revenue recovered",
      note: "What those additional booked jobs are worth — calculated from the business's own average job value, not an industry estimate.",
    },
  ],
  commitment:
    "When the measurement period closes, the verified numbers replace this section — including the business's name and the owner's own words, with their permission. Not adjusted upward. Not rounded in our favor. If the result is more modest than we hoped, that's what gets published too. That's the standard this page will be held to, for this story and every one that follows it.",
  href: "/results/roofing-flagship",
};

export const featuredCaseStudy = caseStudies[0];

/**
 * Detail content for the flagship story's page — reframed, while the
 * measurement period is still open, as a transparent walkthrough of
 * exactly *how* the eventual result will be measured and verified.
 * This becomes the permanent "methodology" anchor for the page once
 * real figures land above it; it doesn't get thrown away, it gets a
 * companion.
 */
export const flagshipMethodology: MeasurementMethodology = {
  slug: "roofing-flagship",
  industryTag: "Roofing",
  title: "How we're measuring our first flagship result — and why there's no number here yet",
  dek:
    "It would be easy to publish an estimate today and call it a case study. We're choosing not to — and we'd rather show you exactly how we're measuring this, so that when the verified numbers do land, you'll know precisely how much rigor stands behind them.",
  sections: [
    {
      heading: "Why there's nothing to show yet — on purpose",
      body:
        "The business this is happening inside is real and operating, not a controlled environment — which means the only honest way to show what changed is to let a full measurement period run its course on real data, then publish exactly what the records say. Anything published before that point would be a guess wearing the costume of a result. We'd rather wait.",
    },
    {
      heading: "What we're tracking, and against what",
      body:
        "Three things, each measured against the business's own records from before the system went live: how quickly inbound contact gets answered, how many additional jobs make it onto the calendar, and what that's worth in recovered revenue using the business's own average job value. Every one of those figures will be traceable back to that business's own call logs, booking calendar, and job records — not to an industry-average estimate or a number we'd prefer were true.",
    },
    {
      heading: "What happens the moment the period closes",
      body:
        "The verified figures replace this page's framing entirely — not cherry-picked from the strongest month, not adjusted in our favor. If the honest number is more modest than we'd hoped, that's the number that gets published, with the same prominence as a more flattering one would have gotten. That's the standard we're setting for ourselves here — and the same standard every case study that follows this one, in any industry, will be held to.",
    },
  ],
  closingNote:
    "In the meantime, you don't have to take our word for what slow follow-up might be costing your business — the Lead Leak Calculator runs the same kind of math using your numbers, not ours, and shows its work plainly.",
};
