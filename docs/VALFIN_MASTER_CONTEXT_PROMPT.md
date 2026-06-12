# Valfin Master Context Prompt

**Purpose:** This is the canonical onboarding document for any future Claude session working on Valfin. Read this first — before any other document, before any memory, before assuming anything from a prior conversation. It tells you what Valfin is, where things stand, how to think about the work, and where to go for detail. It is designed to be concise enough to load quickly and complete enough that you can operate as an informed Valfin partner from message one.

---

## 1. What Valfin Tech Is

Valfin Tech is a **Revenue Operations Infrastructure** company. The product (the "Revenue Recovery System") is a connected stack of n8n automation workflows, a Google Sheets CRM, Twilio SMS, Gmail, and a single targeted Claude API call — deployed for local service businesses to guarantee that **no lead, missed call, or follow-up ever falls through the cracks**, 24/7, without the business owner having to think about it.

It is **not** an "AI Employee" company, a chatbot vendor, or a generic automation consultancy. The category is deliberately narrower and more concrete: **Revenue Operations Infrastructure** — plumbing that sits underneath a business's existing phone/website/calendar and makes sure every inbound opportunity gets a fast, professional, automatic response.

---

## 2. Mission

**"Your competitors aren't better than you. They just call back faster."**

Valfin's mission is to close that gap — instantly, automatically, and honestly — for businesses that are losing real revenue not because their work is bad, but because their response infrastructure is. The founder's framing: *"This was never a marketing problem."* Valfin doesn't sell more leads; it makes sure the leads a business already has never go unanswered.

---

## 3. Positioning

- **Category:** Revenue Operations Infrastructure (not "AI," not "automation tool," not "CRM")
- **Model:** Founder-led. One person currently runs sales, deployment, and support — Claude is the hands-on technical execution partner for cloning and configuring each deployment.
- **Brand voice:** Radical honesty. "We'd rather show you one real result than tell you about a hundred imaginary ones." "We show our numbers, not our adjectives." No "AI" in headlines. Plain language over jargon. Where real numbers don't exist yet, the website says so plainly rather than filling gaps with marketing language.
- **V1 = Roofing.** The first validated, live, tested implementation is a Boston-area roofing company. It is the proof, not the ceiling.
- **Multi-industry future.** The long-term goal is a portable framework for any lead/appointment-driven local service business — the website's Industries page already lists 12 verticals (Roofing flagship + HVAC, Plumbing, Electrical, Solar, Contractors, Real Estate, Insurance, Legal, Dental, Med Spas, Consulting), framed as "the same system... is now expanding into," not as a future promise.
- **Company-level vision:** *"Our long-term goal isn't to be known as an AI company. It's to be the reason businesses stop losing customers to silence."*

---

## 4. Website & Brand Decisions Summary

- **Site:** Next.js 15, deployed on Vercel, domain `valfintech.com`, repo `valfintech/valfin-tech` (main branch). Lives in `website/` in this repo — **under active independent development in a parallel session**. Do not edit `website/src/content/*.ts` or page files from a Valfin-operations session; coordinate via `docs/CASE_STUDY_DATA_PLAN.md` when handing off real data.
- **Core value prop:** "Your competitors aren't better than you. They just call back faster."
- **Sitemap:** 9 static routes (home, how-it-works, industries, results, pricing, company, calculator, privacy, terms) + `/industries/[slug]` (12 industries) + `/results/[slug]` (currently only `roofing-flagship`, which is fully written but gated on `[X]`-placeholder real numbers — see `docs/CASE_STUDY_DATA_PLAN.md`).
- **How It Works:** 4-step process (someone reaches out → answered fast → followed up automatically → becomes something on the calendar) + human handoff + 3 "under the hood" capabilities (learns the business, gets sharper, works inside existing tools).
- **Pricing page:** Foundation / Growth (featured) / Built for you — all listed as "Custom"/"Let's talk," no public dollar figures. The Lead Leak Calculator (`/calculator`) is the ROI mechanism used in every sales conversation.
- **Company page:** founder origin story (fixed one real roofing business first), 4 principles — build in the field not in a lab, show our numbers not our adjectives, design for businesses not for demos, stay after the install.
- **Legal:** Privacy Policy and Terms (effective 2026-06-10) — data collected via contact form + Lead Leak Calculator; processors are Vercel, n8n, Google Sheets, Twilio, Resend (backup); SMS consent language is documented verbatim and matches `docs/SMS_CONSENT_LANGUAGE_GUIDE.md`.
- **site-config.ts:** primary CTA "See My Numbers" → `/calculator`; secondary CTA "Talk to us" → `/company#contact`; contact `hello@valfintech.com`.

---

## 5. V1 → V1.1 Evolution and Major Architectural Decisions

**V1 (completed 2026-06-08, confirmed 2026-06-10):** Built and validated all 12 workflows, the CRM, deployment/onboarding/sales/legal documentation, and declared launch-ready — "every commercial pillar required to responsibly acquire, onboard, deploy, support, and retain a paying client has a real, tested, documented asset."

**V1.1 (2026-06-11) — simplification and usability pass, intentional product decisions (not bug fixes):**
1. **AI lead scoring removed system-wide.** `Lead Score`/`Temperature`/`Urgency`, the Claude Sonnet 4.6 scoring call, and every Hot/Emergency branch are gone. Workflow 02 renamed "Form Capture + Confirmation" (was "...AI Scoring").
2. **"Hot Lead Alert" → "Every Lead Alert"** (Workflow 04) — fires unconditionally for every lead.
3. **Workflows 07/08/11/12 converted from SMS-only to email-by-default**, with SMS built but disabled by default — a dual-gate pattern (Code node → Check Email Enabled → Gmail → converge → Check SMS Enabled → Twilio).
4. **All time handling standardized on `America/New_York` via Luxon `DateTime`** (DST-safe), replacing hardcoded UTC-offset hacks.
5. **CRM `Leads` tab simplified from 20 → 17 columns** (removed Lead Score/Temperature/Urgency).
6. **Centralized `CONFIG` block pattern** introduced in 8 workflows (04, 06, 07, 08, 09, 10, 11, 12) — cloning to a new client/industry now means editing these constants, not redesigning workflows.
7. **Workflow 06 (Appointment Booking) scheduling UX overhaul** — structured calendar-picker date + fixed 30-minute dropdown time slots (8 AM–5 PM by default), all driven by `CONFIG`.
8. Documentation reconciled across the repo; historical docs flagged with V1.1 banners.

**Result:** Claude Haiku 4.5 (Workflow 02's confirmation SMS) is the only AI model in production use. The system is simpler to operate, explain, and clone. Full detail: `docs/V1_1_RECONCILIATION.md`.

---

## 6. All 12 Workflows — Purpose Summary

| # | Workflow | Purpose |
|---|---|---|
| 01 | CRM Adapter | Sole Google-Sheets-writing sub-workflow. Upserts leads, mints `LEAD-####`, logs Communication Log entries. |
| 02 | Form Capture + Confirmation | Form/webhook → CRM upsert → Haiku 4.5 confirmation SMS to customer → Every Lead Alert to owner. |
| 03 | Missed-Call Auto-SMS | Twilio no-answer/busy → instant static "sorry we missed you" SMS → log only, no Lead. |
| 04 | Every Lead Alert | Sub-workflow; branded owner email (default) ± SMS for every new lead. |
| 05 | Follow-Up Sequence | Daily Day 1/3/7 SMS to unbooked New/Contacted leads, stops at 3 or on status change. |
| 06 | Appointment Booking | Owner form → writes Appointments row, confirms customer via SMS, marks lead Booked. Structured date/time picker. |
| 07 | Pipeline Status Digest | Daily owner email: status counts + Stale leads list + today's activity. |
| 08 | Weekly Pipeline Report | Weekly owner email: trailing-7-day metrics, top sources. |
| 09 | Appointment Reminders | Hourly; sends 24h/2h reminder SMS with dedup flags. |
| 10 | Reschedule/Cancel | Inbound SMS → classify reschedule/cancel/opt-out → update Appointments → reply + alert owner. Opt-out keywords silently suppressed. |
| 11 | System Health Monitor | Daily check of CRM data freshness vs. 09/05's own thresholds → alerts the Valfin operator if something looks stale. |
| 12 | Client ROI Report | Every 30 days, emails the client a plain-language recap of leads/bookings/missed-calls-recovered — the renewal-justification tool. |

Full per-workflow detail, CONFIG keys, and cloning instructions: `docs/CLIENT_CLONING_MASTER_PROMPT.md`.

---

## 7. Major Documentation Assets and Where They Live

| Document | Lives at | What it's for |
|---|---|---|
| `README.md` | repo root | Entry point, workflow table with live n8n IDs, build status |
| `docs/VALFIN_FOUNDER_OPERATING_MANUAL.md` | docs/ | Single source of truth for how Valfin operates — "if something here contradicts marketing, this document wins" |
| `docs/FOUNDER_CLIENT_LIFECYCLE_PLAYBOOK.md` | docs/ | The map: which document to open at each stage of Prospect → Client → Renewal |
| `docs/CLIENT_ACQUISITION_PLAYBOOK.md` | docs/ | ICP, sourcing channels, first-contact scripts, "founding partner" framing |
| `docs/DISCOVERY_CALL_WORKBOOK.md` / `_NOTES_TEMPLATE.md` / `_SCORECARD.md` | docs/ | Live discovery-call script + notes + pattern-tracking |
| `docs/PROPOSAL_PLAYBOOK.md` + `docs/CLIENT_PROPOSAL_TEMPLATE.docx` | docs/ | How to build and send a proposal |
| `docs/PAYMENT_PROCESS.md`, `docs/STRIPE_SETUP_GUIDE.md`, `docs/INVOICE_TEMPLATE.docx` | docs/ | Stripe Payment Link design (setup fee + recurring), invoicing |
| `docs/CLIENT_ACCEPTANCE_FLOW.md` | docs/ | Proposal → Agreement → Payment → Kickoff sequence and hard gates |
| `docs/PRICING_PACKAGING.md` | docs/ | Foundation / Growth / Built for you tiers, internal pricing anchors |
| `docs/CLIENT_ONBOARDING_INTAKE.md` | docs/ | The ~30-field client intake questionnaire (Sections A–G) |
| `docs/ONBOARDING_SOP.md` | docs/ | The 6-phase onboarding runbook |
| `docs/CLIENT_DEPLOYMENT_GUIDE.md` | docs/ | Master per-client configuration catalog and deployment order |
| `docs/CRM_SHEET_SCHEMA.md` | docs/ | Verified-live + reconstructed CRM tab schemas |
| `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` | docs/ | Contract draft (awaiting attorney review — only open human-action item) |
| `docs/SMS_CONSENT_LANGUAGE_GUIDE.md` | docs/ | TCPA-aware consent language for all client intake channels |
| `docs/CLIENT_WELCOME_GUIDE_TEMPLATE.md` | docs/ | Durable leave-behind for the client at go-live |
| `docs/CASE_STUDY_DATA_PLAN.md` | docs/ | The 6 numbers + 2 measurement windows that feed the website's flagship case study |
| `docs/FOUNDER_TRAINING_PLAN.md` | docs/ | 10-module founder curriculum (system story → sell → deploy → support) |
| `docs/V1_1_RECONCILIATION.md` | docs/ | Canonical V1.1 changelog and rationale |
| `docs/PROJECT_STATUS.md`, `docs/PROJECT_AUDIT.md` | docs/ | Historical snapshots (pre-V1.1, flagged) |
| `docs/ROADMAP.md` | docs/ | Dated decision log — read for "why," not just "what" |
| `docs/FIRST_CLIENT_READINESS_REPORT.md` | docs/ | 2026-06-10 readiness assessment, non-blocking gaps |
| `docs/INTERNAL_LEAD_CAPTURE_SETUP.md`, `docs/DAY_1_OPERATIONS_CHECKLIST.md` | docs/ | Valfin's own internal lead pipeline and daily routine |
| `docs/CLIENT_CLONING_MASTER_PROMPT.md` | docs/ | **The companion to this document** — the operational deployment prompt for cloning a new client |
| `prompts/*.system.md` | prompts/ | Reference copies of AI system prompts (live copies are in workflow Code nodes); `lead_scoring.system.md` is historical/retired |

---

## 8. Templates and Exports

- **`workflows/01_*.json` – `12_*.json`** — all 12 workflows, real importable exports matching the live, validated n8n instance (`valfin.app.n8n.cloud`). `workflows/11_system_health_monitor.ts` is a retained SDK-source file kept for its design-rationale comments — the `.json` is the source of truth for import.
- **`templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx`** + **`templates/build_crm_template.py`** — ready-to-clone 8-tab CRM spreadsheet (3 verified-live tabs + 5 reconstructed/proposal tabs), regenerated to match the 17-column `Leads` schema.
- **`docs/*.docx`/`.pptx`** — `CLIENT_PROPOSAL_TEMPLATE.docx`, `INVOICE_TEMPLATE.docx`, `VALFIN_EXECUTIVE_BRIEF.docx`, `VALFIN_PARTNER_TRAINING_DECK.pptx` — real deliverables, force-tracked in git despite the general `docs/*.docx`/`*.pptx` gitignore pattern.

---

## 9. Founder-Led Client Journey: Prospect → Renewal

`docs/FOUNDER_CLIENT_LIFECYCLE_PLAYBOOK.md` is the map. The 10 stages:

1. **Sourcing** — `CLIENT_ACQUISITION_PLAYBOOK.md` (ICP, channels, "mystery customer" test)
2. **Discovery call** — `DISCOVERY_CALL_WORKBOOK.md` / `_NOTES_TEMPLATE.md` / `_SCORECARD.md` (15 min, 4 steps: listen → run calculator live → founding-partner offer → handle response)
3. **Proposal** — `PROPOSAL_PLAYBOOK.md` + `.docx`, sent within 24–48h
4. **Agreement + payment** — `CLIENT_ACCEPTANCE_FLOW.md`; setup fee is a hard gate
5. **Kickoff + intake** — `ONBOARDING_SOP.md` Phase 1 + `CLIENT_ONBOARDING_INTAKE.md`
6. **Clone & configure** — `ONBOARDING_SOP.md` Phases 2–3 + `CLIENT_DEPLOYMENT_GUIDE.md` / `CLIENT_CLONING_MASTER_PROMPT.md`
7. **Verify** — `ONBOARDING_SOP.md` Phase 4
8. **Go live** — `ONBOARDING_SOP.md` Phase 5 + `CLIENT_WELCOME_GUIDE_TEMPLATE.md`
9. **Live / ongoing** — `ONBOARDING_SOP.md` Phase 6 + Workflows 11/12
10. **Expansion / renewal** — `PRICING_PACKAGING.md` "Built for you" menu + month-to-month renewal (30-day notice)

What the client should/should not see: CRM + messages ✅; n8n canvas, AI prompts, other clients' data ❌.

---

## 10. Sales Process Summary

- **ICP:** lead/appointment-driven, owner-operator, missed-response costs money, manual intake. Boston-area roofing first, designed to clone to HVAC/plumbing next.
- **Sourcing:** own network → trade associations → Google Maps → local FB/Nextdoor → adjacent-trade pros, plus a "mystery customer" pre-outreach test.
- **Discovery call (15 min):** (1) listen 3–4 min for pain points and numbers; (2) run the Lead Leak Calculator live with their real numbers (conservative: 30% lost-lead rate, ~1/3 convert); (3) founding-partner offer — never lead with price, give the Growth-tier anchor only if pushed; (4) handle the response (5 scripted outcomes A–E).
- **After the call:** fill the notes template within the hour, fill the scorecard, update the prospect tracker, open the proposal same day for outcomes A/B.
- **Proposal:** sent within 24–48h regardless of outcome — 8 sections (Cover, Situation, Opportunity = calculator result, Solution, Investment, Founding Partner Note, Next Steps, 30-day validity).
- **Pricing (internal anchors, never quoted verbatim):** Foundation ~$1,500 setup + ~$397/mo (WF 01–05); Growth ~$2,500 setup + ~$697/mo, **recommended default** (WF 01–10); Built for you = Growth + à la carte (~$300–1,000/mo per add-on bundle).
- **Contract:** month-to-month after setup, 30-day cancellation, non-refundable setup fees.

---

## 11. Deployment Process Summary

- **Estimated clone time:** 2–4 hours of configuration (excluding Twilio carrier verification, which takes days and should start first).
- **3 + 1 credentials per client:** `Google Sheets account` (OAuth2), `Anthropic API` (Header Auth — shared, WF02 only), `Twilio account` (Twilio API, per-client), Gmail OAuth2 (for owner/client emails).
- **Import order matters:** Workflow 01 (CRM Adapter) and Workflow 04 (Every Lead Alert) first — every other workflow either calls one or both and needs their new instance IDs.
- **Per-client values:** CRM spreadsheet ID, company name, owner/client contact info, Twilio number, timezone, business hours/increments — mostly centralized into 8 `CONFIG` blocks (04, 06, 07, 08, 09, 10, 11, 12) post-V1.1.
- **Post-deploy verification:** `test_workflow`/`get_execution` with pinned data for every workflow, plus a real end-to-end SMS smoke test before announcing go-live.
- Full mechanical detail: `docs/CLIENT_CLONING_MASTER_PROMPT.md`.

---

## 12. Reporting and Support Process Summary

- **Workflow 04 (Every Lead Alert):** instant, every lead, owner email by default.
- **Workflow 07 (Pipeline Status Digest):** daily owner email — status counts, Stale leads, today's activity.
- **Workflow 08 (Weekly Pipeline Report):** weekly owner email — trailing-7-day metrics.
- **Workflow 11 (System Health Monitor):** daily, alerts the *Valfin operator* (not the client) if CRM data looks stale relative to 09's/05's own thresholds — catches silent failures before the client does.
- **Workflow 12 (Client ROI Report):** every 30 days, emails the *client* a plain-language recap — the renewal-justification artifact.
- **Support cadence:** weekly spot-checks of 05/07/08/09 + 11 in month 1, monthly thereafter; walk the client through their first Workflow 12 report live; 60–90 day case-study close.

---

## 13. Known Non-Blocking Open Items (as of 2026-06-11)

From `docs/FIRST_CLIENT_READINESS_REPORT.md` and `docs/ROADMAP.md`, none of these block taking on client #1:

- Attorney review of `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` — the one item that genuinely requires a human, not more session time
- Twilio toll-free/A2P verification is pending on the reference instance (deliberately left unverified — non-blocking, per-client)
- No Resend email failsafe configured yet (Gmail OAuth2 is the live, working channel)
- No verified case studies yet — `website/src/content/results.ts` flagship case study is fully written but gated on real numbers (`docs/CASE_STUDY_DATA_PLAN.md`)
- 5 reconstructed CRM tabs (`Quotes`, `Jobs`, `Follow Ups`, `Team Schedule`, `Dashboard`) are documented proposals with no live workflow dependency
- Onboarding docs are unvalidated against a real client (will sharpen after client #1)
- No live Stripe account yet (setup guide exists; account creation is a ~15-minute human action)
- Phase 5 retention workflows (review requests, referral invites, seasonal campaigns) are intentionally unbuilt — "Built for you" menu items, built only on real demand
- A consolidated technical "framework architecture" document doesn't exist as a single artifact — deliberately deferred until after a real cross-vertical clone, so it's written from experience rather than theory

---

## 14. V1.1 Is Complete — Builder Mode Is Paused

As of 2026-06-11, **V1.1 is fully closed** (5 founder-requested closure checks all pass — see `docs/V1_1_RECONCILIATION.md` §11). Combined with the 2026-06-10 V1 completion, **the project is permanently out of builder mode** until real-world signal arrives.

This document and `docs/CLIENT_CLONING_MASTER_PROMPT.md` (created together, 2026-06-11) are themselves part of that transition: they convert what used to require long-running conversational continuity into durable, repository-based institutional knowledge — see `docs/ROADMAP.md`'s entry on this transition.

---

## 15. Do Not Proactively Invent Features

**Future work should not add documents, workflows, features, or infrastructure speculatively.** Builder mode resumes only when a verified business need appears through one of these real-world signals:

- A prospect conversation (discovery call reveals a need)
- Client onboarding (intake reveals something the framework doesn't yet handle)
- Live delivery (a deployment surfaces a real gap)
- A support interaction (a client asks for something)
- A retention conversation (month 2–3 expansion discussion)
- An expansion opportunity (a new vertical, a "Built for you" request)

When one of these occurs, open the relevant document named in §7 and revise it based on what actually happened — not on speculation about what might be needed.

---

## 16. Instructions for Future Claude Sessions

- **Always review the repository first.** Treat `docs/`, `workflows/`, `templates/`, `prompts/`, and `website/` as the source of truth — not memory, not this document alone, and not assumptions from prior sessions.
- **Documentation and live exports are canonical.** If a doc and a live n8n workflow ever disagree, the live workflow (and its re-synced `.json` export) wins for *behavior*; the doc should be corrected to match.
- **Avoid duplicating existing assets.** Before writing a new doc, template, or workflow, check §7/§8 above — there is very likely already a document for it.
- **Reconcile with parallel website work if applicable.** `website/` may be under active independent development. Don't edit `website/src/content/*.ts` or page files directly from an operations-track session; coordinate via `docs/CASE_STUDY_DATA_PLAN.md`.
- **Preserve Valfin's simplification philosophy.** V1.1 actively *removed* complexity (AI scoring, SMS-only reporting) because it didn't earn its cost. Don't reintroduce complexity without a verified need (§15).
- **Optimize for business impact, not feature count.** The highest-leverage action is almost always sales/deployment/support execution, not new building — per §15, that changes only on real signal.

---

## 17. How to Use This Prompt — Examples

- **Preparing for a discovery call:** Read §10 (Sales Process) and `docs/DISCOVERY_CALL_WORKBOOK.md`. Have the Lead Leak Calculator ready. Don't build anything — this is execution, not development.
- **Updating the website:** Read §4, then check whether `website/` is under parallel development before touching anything. Coordinate handoffs via `docs/CASE_STUDY_DATA_PLAN.md`.
- **Deploying a new client:** Read §6, §9, §11, then open `docs/CLIENT_CLONING_MASTER_PROMPT.md` and follow it exactly — it's self-sufficient with the client's intake answers.
- **Improving marketing:** Check §3/§4 for positioning constraints (no "AI" in headlines, show numbers not adjectives) before drafting anything; verify against `website/src/content/*.ts` for current copy.
- **Solving a support issue:** Start with `docs/CLIENT_WELCOME_GUIDE_TEMPLATE.md`'s week-1 FAQ, then Workflow 11's alert output (§12) for "what looks stale," then the specific workflow's verification steps in `docs/CLIENT_CLONING_MASTER_PROMPT.md` §10.
- **Expanding into a new vertical:** Read §14 of `docs/CLIENT_CLONING_MASTER_PROMPT.md` (industry-cloning guidance) and `docs/CLIENT_ACQUISITION_PLAYBOOK.md`'s "how this generalizes" section — only act on this when a real prospect or client in that vertical exists (§15).
- **Revisiting pricing:** Read §10 here and `docs/PRICING_PACKAGING.md` — internal anchors are a private reference, never a quote sheet. Don't change public pricing without a reason rooted in real sales conversations.
- **Updating workflows:** Read §6 and §5 (V1.1 architecture) first. Any change to a `CONFIG`-block workflow should preserve the CONFIG pattern; any change to the CRM schema must be reflected in `docs/CRM_SHEET_SCHEMA.md` and `templates/build_crm_template.py`.

---

*This document and `docs/CLIENT_CLONING_MASTER_PROMPT.md` were created 2026-06-11 to make the repository self-sufficient for any future Claude session — replacing dependence on conversational continuity with durable, repository-based institutional knowledge.*
