# Client Onboarding SOP (Operator Runbook)
_Created 2026-06-07 — the glue document binding PRICING_PACKAGING.md → CLIENT_ONBOARDING_INTAKE.md → CLIENT_DEPLOYMENT_GUIDE.md into one repeatable sequence_

## Purpose

This is the step-by-step playbook **you** (the operator) follow from "prospect says yes" to "client is live and happy" — and then on an ongoing basis. Each phase below names exactly which other document to open and what to do with it. Follow this in order; don't skip ahead to deployment before the commercial/intake steps are done — every deployment-guide step assumes the intake answers already exist.

> **Design intent:** every phase should be *exactly the same* for client #2 as it was for client #1. If a step requires improvisation, that's a signal this SOP (or one of its companion docs) needs updating — treat drift as a defect, not a one-off.

---

## Phase 0 — Close the Deal
**Trigger:** Prospect agrees to move forward.

> **Don't have a prospect yet?** This phase assumes one already exists — that assumption was identified as the single highest-leverage gap in the whole sequence (2026-06-08 architect-level review, see `ROADMAP.md`). **Start with `docs/CLIENT_ACQUISITION_PLAYBOOK.md`** — it covers the ICP, concrete this-week sourcing channels for Boston-area roofing prospects, first-contact scripts, and the discovery-call structure that hands directly into step 1 below the moment someone says "tell me more."

1. Open `docs/PRICING_PACKAGING.md` — confirm which tier you're proposing (default pitch: **Growth**, matching the live website's `isFeatured: true` recommendation — see that doc's reconciliation note for why the naming changed from "Tier 2")
2. Send/sign the service agreement — use `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` as the starting draft (created 2026-06-07, closing the item formerly flagged here as "not yet written"). **Read its top warning before sending anything**: it is a structured starting point, not an attorney-reviewed final contract — fill in every `[BRACKETED]` value, and get a real legal review before the first signature. Until that review lands, the template still upgrades the interim "document terms via email" approach by giving you (and the prospect) a complete, professional, single-source-of-truth document to work from instead of an ad hoc email thread
3. Collect the setup fee (or first invoice) before configuration work begins
4. **Do not proceed to Phase 1 without a signed agreement and payment terms confirmed** — this is the one hard gate in the whole sequence

## Phase 1 — Kick Off Intake (Day 0–1)
**Trigger:** Agreement signed.

1. Send `docs/CLIENT_ONBOARDING_INTAKE.md` to the client the same day the agreement is signed — momentum matters, and this is the longest client-dependent step
2. Flag items B2/G2 (Twilio number + carrier verification) as **the thing to start immediately** — tell the client directly: "this is the only part of the whole process that takes more than a day or two, so the sooner we have your answer to question B2, the sooner we can start the clock"
3. Offer a live walkthrough call as an alternative to the written form for clients who'd rather talk it through — same questions, you fill it in
4. **Record two dates the moment they're known, in writing, somewhere durable:** the date the agreement closed (today) and the target go-live date once you can estimate it. These two dates are the entire "[X] weeks from first conversation to fully live" stat the website's flagship case study is waiting on (`docs/CASE_STUDY_DATA_PLAN.md` Metric 5) — it is the easiest of the six numbers to capture and the easiest to lose if you don't write it down *now*
5. **Pay special attention to intake question D5** (the client's own estimate of their pre-launch missed-call rate and monthly bookings). This is the **baseline** — the one number in the entire case-study data set that becomes permanently unrecoverable once the system goes live and changes the picture. See `docs/CASE_STUDY_DATA_PLAN.md` "Window 1" for why this is worth getting right under time pressure rather than rushing past it

## Phase 2 — Start the Clock on Carrier Verification (Day 1, in parallel with everything else)
**Trigger:** You know whether the client has an existing Twilio number (intake answer B2).

1. If they need a new number: provision it and begin A2P 10DLC / toll-free verification **immediately** — per `CLIENT_DEPLOYMENT_GUIDE.md` §1, this can take days and is the actual gate on go-live
2. If they have an existing number: confirm its verification status in the Twilio console before assuming it's ready
3. **This phase runs in the background for the rest of onboarding — do not block configuration work waiting on it**

## Phase 3 — Configure the Deployment (Day 1–3, once intake answers arrive)
**Trigger:** Completed intake packet returned.

1. Open `docs/CLIENT_DEPLOYMENT_GUIDE.md` and follow §4 "Deployment Order of Operations" exactly:
   - Set up the Google Sheet from the template (intake F1 tells you whether you're also migrating existing data)
   - Create the 3 credentials in the new n8n instance
   - Import workflow 01 (CRM Adapter) → re-ID → import 04 (Hot Lead Alert) → re-ID
   - Import the remaining workflows in the documented order, re-pointing every sub-workflow reference
2. Use intake Sections A–D to fill every value cataloged in `CLIENT_DEPLOYMENT_GUIDE.md` §3 (identity/contact, schedule/cadence, business-rule constants, booking slots)
3. Use intake **Section E (brand voice)** to rewrite every customer-facing SMS template and AI system prompt — **do not ship the Valfin-Tech-flavored copy to a new client verbatim**; this is the single highest-leverage "feels custom, not templated" touch in the whole process
4. Use intake **Section G** to confirm consent language exists on the client's intake forms — if it doesn't (or even if it does and you want to strengthen it), **hand them `docs/SMS_CONSENT_LANGUAGE_GUIDE.md`** (created 2026-06-07, closing the "improvised per-client" item formerly flagged here): ready-to-use language for digital forms, paper forms, phone scripts, and the system's first automated touch — plus the "here's exactly how our opt-out handling works" talking points that double as a trust-building selling point. This is a real compliance gate, not a nicety (see `CLIENT_DEPLOYMENT_GUIDE.md` §7) — and per that guide's own go-live checklist, a recommendation handed over but not actually implemented on the client's live forms closes nothing; confirm implementation before flipping workflows to active

## Phase 4 — Verify Before Anyone Sees It (Day 3–5)
**Trigger:** Configuration complete.

1. Run `docs/CLIENT_DEPLOYMENT_GUIDE.md` §5 "Post-Deploy Verification Checklist" — every workflow, in order, exactly as it was proven on the Valfin Tech build (the same `test_workflow` + `get_execution` pattern used for executions 54/55/63–68)
2. Pay special attention to the compliance-sensitive paths: opt-out keyword handling (workflow 10 — see the 2026-06-07 fix in `PROJECT_AUDIT.md`), and reminder/digest timing against the client's actual timezone (intake C3)
3. **Do not announce go-live until Twilio carrier verification (Phase 2) is confirmed AND a real end-to-end SMS has been sent to a real phone** — this exact sequencing is called out in the deployment guide for a reason: it's the one mistake that turns a smooth launch into an embarrassing one

## Phase 5 — Go Live (Day 5–14, gated by carrier verification)
**Trigger:** Verification checklist passes AND Twilio is confirmed verified.

1. Schedule a short walkthrough call with the client — show them: where their leads land (the CRM sheet), what their customers will receive (read the actual SMS scripts aloud), and what they'll receive (the daily digest / weekly report / hot-lead alerts)
2. Set expectations for what "normal operation" looks like in week 1 (e.g., "you'll get a text within seconds of every missed call," "you'll get an evening digest every day at 6 PM")
3. Give them a direct way to report anything that looks off (see Phase 6)
4. Flip every workflow to active, if not already

## Phase 6 — Ongoing Support & Client Success (Week 2 onward — repeats indefinitely)
**Trigger:** Client is live.

1. **Weekly (first month), then monthly:** spot-check that scheduled workflows (05/07/08/09) actually ran on schedule and that no executions are erroring. As of 2026-06-07, this is now backstopped by **Workflow 11 (System Health Monitor)** — a daily automated check that reads live CRM data freshness (overdue appointment reminders, stalled follow-up sequences) and texts *you* if either looks stale. It supplements, not replaces, your own judgment — keep glancing at it, especially in month 1
2. **Monthly:** as of 2026-06-08, this is now automated — **Workflow 12 (Client ROI Report)** texts the client a plain-language, outcome-framed recap every 30 days (new leads captured, hot/urgent leads flagged instantly, missed calls recovered, appointments booked/kept), addressed to their own brand name and closing with an open invitation to discuss the numbers. Walk the client through the *first* one live on a call so they know what to expect and trust the math behind it — after that, let it run on its own. This closes what was previously cataloged as the "client-facing ROI report" enhancement (`CLIENT_DEPLOYMENT_GUIDE.md` §6) — it's a recurring-fee-justification and renewal/expansion tool that now runs without operator effort each cycle
3. **When something breaks:** triage using the same `get_execution` / `test_workflow` pattern proven throughout this build; most issues will trace to one of the known external dependencies (credential expiry, Twilio status changes, a Sheet schema edit the client made themselves)
4. **When the client is happy and stable (typically month 2–3):** open the "Built for you" menu in `PRICING_PACKAGING.md` — this is expansion-revenue territory, not a Day-1 pitch
5. **At the 60–90 day mark, formally close the measurement period** — this is a deliverable, not just an ongoing-support checkbox. Assemble the six numbers specified in `docs/CASE_STUDY_DATA_PLAN.md` (baseline missed-call rate, post-launch response rate, additional jobs/month, $ recovered, weeks-to-launch, and an owner testimonial+consent), and hand the completed package to the website track — that document is the literal bridge to filling in the `[X]` placeholders already scaffolded in `website/src/content/results.ts` and `homepage.ts`, which is the site's primary proof asset. **Do not edit the website's content files directly** — coordinate the handoff; that codebase is under independent active development. This step is naturally combined with step 4's expansion conversation (the same conversation that opens the Tier-3 menu is the right moment to ask for the testimonial)

---

## Open Items (things this SOP currently routes around — close these before client #2)

These aren't blockers for client #1 (they can be handled manually/in writing the first time), but each repetition without them is a "drift" signal per the design intent above:

| Item | Current workaround | Real fix |
|---|---|---|
| ~~No formal service agreement template~~ — **closed 2026-06-07** | ~~Document terms via email~~ | `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` exists as a structured draft. **Remaining sub-task before it's truly "done": get it reviewed by a licensed attorney** — the draft says so explicitly in its own header, and that review is the one piece of this that genuinely cannot be completed by an AI session. Track that review as the live remaining gap, not the document's existence |
| ~~No automated system-health monitoring~~ — **closed 2026-06-07** | ~~Manual weekly spot-checks~~ | **Workflow 11 (System Health Monitor)** is live (`U6t0b7M6lN8eA1JO`) — daily automated freshness check on appointment reminders + follow-up sequences, texts the operator if either looks stale. Mirrors the live workflows' own "overdue" definitions exactly (with safety buffers) so it only alerts on genuine drift, never cries wolf. Per-client re-pointing instructions are in `CLIENT_DEPLOYMENT_GUIDE.md` §3 |
| ~~No client-facing ROI report~~ — **closed 2026-06-08** | ~~Manually assembled monthly summary (Phase 6, step 2)~~ | **Workflow 12 (Client ROI Report)** is live (`ocAnTMCh068BxxXz`) — every 30 days it texts the client an outcome-framed recap built from live CRM data (new leads, hot/urgent leads flagged, missed calls recovered, appointments booked/kept), addressed to their own brand name. Tested live (execution 85) — all five computed metrics matched hand-verified expectations exactly. Per-client re-pointing instructions are in `CLIENT_DEPLOYMENT_GUIDE.md` §3 |
| ~~No standard TCPA consent-language snippet to hand clients~~ — **closed 2026-06-07** | ~~Improvised per-client during Phase 3, step 4~~ | `docs/SMS_CONSENT_LANGUAGE_GUIDE.md` exists — ready-to-hand language for digital forms, paper forms, phone scripts, and the system's first-touch message, plus the "what our system already guarantees" talking points |

---

## One-Page Summary (pin this to the wall)

```
Deal closes → Send intake packet + start Twilio verification (same day)
            → Configure (deployment guide §4) using intake answers
            → Verify (deployment guide §5) — every workflow, live data
            → Go live (only once Twilio verified + real SMS confirmed end-to-end)
            → Support forever (weekly→monthly health checks, monthly ROI summary,
              expansion conversation once stable)
```
