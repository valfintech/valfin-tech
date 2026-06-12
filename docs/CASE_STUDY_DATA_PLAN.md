# Case Study Data Plan — Flagship Roofing Deployment
_Created 2026-06-07 — bridges ONBOARDING_SOP.md (operational side) to website/src/content/results.ts + homepage.ts (the marketing side, built in a parallel session)_

## Why this document exists

The website (`website/`, under active build in a parallel session) already contains a fully-written flagship case study — `website/src/content/results.ts` → `flagshipCaseStudy`, plus a homepage teaser in `homepage.ts`. It is explicitly the site's primary proof asset (per the brand rule "radical specificity over implied breadth": one real, fully-documented result beats a wall of vague logos). **It is currently 100% scaffolded but blocked on real numbers** — every stat is a literal `[X]` placeholder, and the page itself states the standard plainly: *"Where we don't yet have verified numbers from a deployment, we say so plainly — instead of dressing up a placeholder as proof."*

Nobody can fill those placeholders with anything but real, measured data from a real, live client — which doesn't exist yet (Twilio is still in carrier-verification limbo and no customer has been onboarded). **This document is the operational spec for *exactly* what to measure, when, and how — using the systems already built — so that the moment client #1 completes a measurement period, the website session can drop in verified numbers with zero ambiguity about where they came from or whether they're defensible.**

This is the literal handoff contract between the technical/operational track (this session) and the marketing/website track (the parallel session). **Do not edit `website/src/content/*.ts` from this side** — that's the other session's surface. This doc is what feeds it.

---

## The Exact Placeholders to Fill (verbatim from the website source)

| Placeholder (file: line) | What it needs |
|---|---|
| `homepage.ts:119` — `"[Company Name] was missing 4 out of every 10 calls..."` | Company name + baseline missed-call rate |
| `homepage.ts:121-123` — `[X]%`/`[X] minutes`, `[X]` jobs/mo, `$[X]` revenue | Post-launch response rate, additional jobs/month, $ recovered |
| `homepage.ts:126` — `"[Owner Name], [Company Name]"` | Attribution for the testimonial quote |
| `results.ts:24,26-28,31` — case-study index card | Same five figures + attribution, condensed |
| `results.ts:52` — `"[X]% of inbound calls were going unanswered before..."` | **Baseline** missed-call rate (the "before" anchor everything else is measured against) |
| `results.ts:57` — `"[X] weeks from first conversation to...fully live"` | Time-to-launch (trivially trackable — see Metric 5 below) |
| `results.ts:63-65` — the "after" stat block | Response-time %, additional jobs/month, $ recovered monthly |
| `results.ts:70` — testimonial attribution | Owner name, title, company name |

Six distinct numbers, one company name, one owner name/title, and one quote. Everything below explains how to produce each one defensibly.

---

## The Two Measurement Windows

A defensible before/after story requires two distinct, bounded windows — and **the baseline window must be defined and started before go-live**, or there's no "before" to compare against. This is a real risk: it's easy to get excited about launching and skip straight to "after" measurement, which would permanently foreclose the single most valuable number on the page (`results.ts:52`, the baseline missed-call rate that the entire headline stat depends on).

### Window 1 — Baseline ("Before"): capture during `ONBOARDING_SOP.md` Phase 1–2, *before* go-live
**Goal:** establish the "before" numbers honestly, without the system's influence.

Two complementary capture methods (use both if possible — they cross-check each other):
1. **Ask the client directly**, as part of intake (see "Intake additions" below): "Roughly how many calls do you think you miss in a typical week? How many jobs do you book in a typical month? What's your average job value?" Small-business owners usually have a felt sense of this even without formal analytics — and their own estimate becomes part of the honest "before" narrative (it's also a more *human*, quotable data point: "the owner thought it was bad — it was worse").
2. **Passively measure it**, if the timeline allows: before activating the missed-call auto-SMS workflow (03), let inbound call activity run for 1–2 weeks with only logging active (no customer-facing automation yet) — count calls vs. answered calls from the client's existing phone system or call log, if they have one. This produces a verifiable, system-observed baseline rather than a recollection.

**Output of this window:** the baseline missed-call rate (`results.ts:52` and the homepage headline "missing 4 out of every 10 calls"), and the pre-launch monthly job count + average job value (needed to compute the "after" revenue-recovered figure).

### Window 2 — Measurement Period ("After"): starts at go-live, runs a fixed length
**Goal:** produce a statistically meaningful, system-verified "after" picture.

**Recommended length: 60–90 days.** Reasoning: roofing is seasonal and lead volume is lumpy week to week (a single storm can double a month's leads); a 30-day window risks an unrepresentative sample in either direction, while 60–90 days smooths that out and produces a number that survives scrutiny. This also conveniently aligns with the natural Tier-3-conversation timing already noted in `ONBOARDING_SOP.md` Phase 6 ("month 2–3, once the client is happy and stable").

**Output of this window:** every "after" stat on the page — response-time %, additional jobs/month, $ recovered, and (combined with Window 1) the overall before/after delta that makes the whole story land.

---

## The Six Numbers — Exactly How to Produce Each One From the Live System

This system was built with exactly the kind of structured, queryable logging that makes this measurement possible without any new instrumentation — every number below is extractable from data the platform *already writes* during normal operation.

### 1. Baseline missed-call rate (`results.ts:52`, headline stat)
**Source:** Window 1 (client estimate + optional passive measurement). Not derivable from the system itself — it's definitionally a "before the system existed" number. **This is the one figure that cannot be recovered retroactively — if Window 1 is skipped, this placeholder can never be honestly filled**, and the entire case study's strongest hook (the four-in-ten-calls headline) is lost permanently. Treat this as the single highest-priority data-capture action of the entire onboarding.

### 2. Post-launch response rate & speed (`results.ts:63` first stat — "[X]% of inbound contacts now answered within [X] minutes")
**Source:** the **Communication Log** tab (written by the CRM Adapter, workflow 01) plus direct execution-timestamp deltas:
- For missed calls: workflow 03 fires the auto-SMS within seconds of the Twilio call-status webhook — the delta between `call received` and `SMS sent` timestamps in the Communication Log is the "answered within X minutes" number, and it will be dramatic (seconds, not hours)
- For form submissions: workflow 02's CRM-upsert + confirmation-SMS pipeline runs end-to-end in well under a minute — same measurement, same log
- **The "% of inbound contacts now answered" is simply: (count of Communication Log entries logged within the target window) ÷ (total inbound contacts in the measurement period)** — and given the system answers *everything* by design, this should approach 100%, which is the dramatic flip side of the baseline's "4 out of 10 missed"

### 3. Additional jobs booked per month (`results.ts:64`)
**Source:** the **Appointments tab** (written by workflow 06) — count rows created during the measurement period, divide by the number of months in the window, and compare against the Window-1 baseline monthly job count (from the client's own estimate/records). The delta is "additional jobs booked per month, on the same lead volume" — note the qualifier "on the same lead volume" is important and should be checked: if the client also increased ad spend during the measurement period, that confound should be disclosed, not hidden (this matches the brand's stated standard: "not adjusted upward, not rounded in our favor").

### 4. Estimated monthly revenue recovered (`results.ts:65`)
**Source:** Metric 3's "additional jobs/month" delta **× the client's average job value** (captured in Window 1 via intake). This is a derived number, not a directly-logged one — show the math plainly in the case study's supporting detail (the brand rule "we'd rather show our math than hide behind a black-box number," already stated verbatim in `website/src/lib/calculator.ts`, should apply here too).

### 5. Weeks from first conversation to fully live (`results.ts:57`)
**Source:** trivial — `(go-live date)` minus `(date the deal closed / Phase 0 of ONBOARDING_SOP.md began)`. Track both dates explicitly in the SOP (see addition below). This is the only metric with zero ambiguity or estimation involved — record it precisely as it happens.

### 6. Owner testimonial + attribution (`results.ts:70`, `homepage.ts:126`)
**Source:** a short structured conversation at the *close* of the measurement period (natural to combine with the Tier-3/expansion conversation already specced in `ONBOARDING_SOP.md` Phase 6, step 4). Ask two questions and let the owner talk:
- "What's different now, day to day, compared to before?"
- "If another roofing company owner asked you whether this was worth it, what would you tell them?"
Pull the most concrete, specific sentence verbatim — the existing placeholder quote ("We didn't spend a dollar more on leads. We just stopped losing them.") is a strong *example of the shape* to listen for: concrete, ROI-flavored, and quotable in one breath. Get written/recorded permission to use the name and company name publicly — a one-line consent confirmation in writing is sufficient and should be filed alongside the data package.

---

## Additions This Plan Requires Elsewhere (so the data actually gets captured)

Two companion documents need small additions to make sure Window 1 actually happens — without them, the baseline (the hardest-to-recover number) is at risk of being skipped in the rush to go live:

### → `docs/CLIENT_ONBOARDING_INTAKE.md` (Section D — Lead Handling Preferences)
Add these two questions, since they feed both the sales ROI pitch (`PRICING_PACKAGING.md`) **and** this data plan's Window 1 baseline:
- *"What's your average revenue per completed job (replacement, major repair — whatever your typical 'win' looks like)?"* → needed for Metric 4's $-recovered calculation, and sharpens the ROI-anchor conversation in `PRICING_PACKAGING.md` beyond the generic $8–15K industry figure
- *"In a typical month before working with us, roughly how many calls do you think go unanswered, and how many jobs do you book?"* → the owner's own estimate becomes the baseline anchor (Metric 1 and the comparison basis for Metric 3)

### → `docs/ONBOARDING_SOP.md` (Phase 1 and Phase 6)
- **Phase 1 should explicitly record two dates the moment they're known:** the date the deal closed (Phase 0 complete) and the target/actual go-live date — these are Metric 5, and recording them in the moment is far more reliable than reconstructing them later
- **Phase 6 should explicitly name the measurement-period close as a deliverable**, not just an ongoing support loop: at the 60–90 day mark, assemble the six numbers above into a data package and hand it to the website session (literally: post the filled-in numbers + sourcing notes into a shared note or directly as a PR-style update to `website/src/content/results.ts` if coordinating directly is preferred — but **confirm with the website session before editing its files**, since it's under active independent development)

I'm applying both of these additions now (see the diffs to those two files in this same commit) — they're small, natural extensions of structures that already exist in each document.

---

## What NOT to Do

- **Do not publish estimated/placeholder numbers as if they were verified.** The website's own stated standard (`results.ts:18`, `:73`) explicitly commits to never doing this — matching that standard operationally (by actually measuring, not guessing) is what makes the case study credible rather than another "AI company" puff piece. This is the brand's actual moat, per `valfin-brand-foundation` positioning: showing real math beats implying breadth.
- **Do not edit `website/src/content/*.ts` directly from this track.** That codebase is under active, independent development in a parallel session — coordinate the handoff (point them at this document and the filled-in numbers when the measurement period closes) rather than risk colliding edits or contradicting decisions already made there (e.g., the deliberate "Foundation / Growth / Built for you" tier naming and "no published price" stance — see the note added to `PRICING_PACKAGING.md` reconciling this).
- **Do not skip Window 1.** Of the six numbers, it is the only one that becomes permanently unrecoverable if missed — emphasize this to whoever runs Phase 1 of onboarding for client #1, even (especially) under the time pressure of "let's just get it live."
