# Founder Client Lifecycle Playbook
_Created 2026-06-10 — the single operational guide for running Valfin Tech in the real world, end to end_

> **What this is:** This is the document you open when you're not sure what to do next with a real prospect or client. It doesn't replace any existing document — it's the **map that tells you which document to open at each moment**, plus the practical judgment calls that don't live in any single template. Everything referenced here already exists and is shippable today. **No new workflows, infrastructure, or documents were created to write this** — it's a synthesis of `docs/` as it stands on 2026-06-10.
>
> **What this is not:** not a sales script (that's `DISCOVERY_CALL_WORKBOOK.md`), not a contract (that's `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`), not a deployment manual (that's `CLIENT_DEPLOYMENT_GUIDE.md`). This document tells you *when* to use each of those, *in what order*, and *what to do in the moments between them*.
>
> **Optimized for:** a solo founder, delivering the first 10 clients, using Claude (this assistant) as the hands-on technical execution partner for cloning/configuring each deployment.

---

## 0. The Visual Lifecycle — Prospect → Client → Renewal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1 — SOURCING                                    CLIENT_ACQUISITION_PLAYBOOK │
│  Network / associations / Google Maps / referrals → "mystery customer" test       │
│  → first-contact message (founding-partner framing)                               │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 2 — DISCOVERY CALL (15 min)              DISCOVERY_CALL_WORKBOOK/_NOTES/_SCORECARD │
│  Listen → Lead Leak Calculator (their numbers) → demo (§2 below)                  │
│  → Founding Partner offer → handle response                                       │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼  (prospect interested)
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 3 — PROPOSAL                                   PROPOSAL_PLAYBOOK + .docx    │
│  Send written proposal within 24-48h → wait for response                          │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼  (prospect says yes)
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 4 — AGREEMENT + PAYMENT                        CLIENT_ACCEPTANCE_FLOW.md    │
│  Send Service Agreement → signed → send setup-fee Stripe link + invoice           │
│  → setup fee PAID = the hard gate                     PAYMENT_PROCESS / STRIPE_SETUP │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼  (gate cleared)
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 5 — KICKOFF & INTAKE (Day 0-1)        ONBOARDING_SOP Phase 1 + INTAKE PACKET│
│  Send CLIENT_ONBOARDING_INTAKE.md → kick off Twilio carrier verification (longest │
│  lead time — start immediately)                                                    │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 6 — CLONE & CONFIGURE (Day 1-3)         ONBOARDING_SOP Phase 2-3            │
│  Use Claude + CLIENT_DEPLOYMENT_GUIDE.md to clone CRM sheet, credentials,          │
│  workflows 01→12, rebrand all customer-facing copy                                │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 7 — VERIFY (Day 3-5)                    ONBOARDING_SOP Phase 4 + DEPLOY §5  │
│  Run full verification checklist on every workflow before anything goes live      │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 8 — GO LIVE (Day 5-14)                  ONBOARDING_SOP Phase 5              │
│  Walkthrough call + CLIENT_WELCOME_GUIDE → set up recurring Stripe Payment Link    │
│  → flip every workflow to active                                                   │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 9 — LIVE / ONGOING (Week 2+)            ONBOARDING_SOP Phase 6              │
│  Monthly ROI report (auto) + daily health monitor (auto) + best-effort support    │
│  → 60-90 day case-study data capture (CASE_STUDY_DATA_PLAN)                       │
└───────────────────────────────────┬───────────────────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 10 — EXPANSION / RENEWAL (Month 2-3+)                                       │
│  "Built for you" menu conversation (PRICING_PACKAGING) + month-to-month renewal,  │
│  30-day notice either way (CLIENT_SERVICE_AGREEMENT)                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Read this document top to bottom once.** After that, jump straight to whichever stage you're in — each section below tells you exactly which existing document to open and what to actually do with it.

---

## 1. How to Run Discovery Calls

**Primary document: `DISCOVERY_CALL_WORKBOOK.md`** — this is the full 15-minute call script. Use it verbatim the first few times.

The shape, every time:
1. **Listen first.** Ask how they currently handle inbound calls/leads and what happens after-hours. If you did a "mystery customer" test on this business (`CLIENT_ACQUISITION_PLAYBOOK.md`), reference it honestly — it's the single best trust-builder you have.
2. **Run the Lead Leak Calculator with their numbers** (`/calculator` on the live site) — never your numbers, never an industry average. Let the figure it produces do the persuading.
3. **Demo the system** (see §2 below) — this slots in naturally right after the calculator, while the prospect is already leaning in.
4. **Make the Founding Partner offer** explicitly — the verbatim framing is in both `CLIENT_ACQUISITION_PLAYBOOK.md` and `DISCOVERY_CALL_WORKBOOK.md`.
5. **Handle the response** using the A-E branches and Common Objections table in `DISCOVERY_CALL_WORKBOOK.md`.

**During and after every call:**
- Take notes live on `DISCOVERY_CALL_NOTES_TEMPLATE.md` — don't trust memory, especially for the calculator inputs (you'll need them again for the proposal).
- Fill out `DISCOVERY_CALL_SCORECARD.md` afterward — even a 2-minute fill-in. This is what lets you spot patterns across your first 5-10 calls (which objections repeat, whether your fit-score predicts who actually signs).
- Update the prospect tracker (`CLIENT_ACQUISITION_PLAYBOOK.md`'s tracking section) regardless of outcome — "not yet" prospects are your warmest re-engagement list.

**After your first 3-5 calls**, both `DISCOVERY_CALL_WORKBOOK.md` and `DISCOVERY_CALL_SCORECARD.md` have a feedback-loop section — read it. The script should evolve based on what you actually hear, not stay frozen as written.

---

## 2. How to Demo the System Without Exposing Technical Complexity

**The core principle, from `FOUNDER_TRAINING_PLAN.md` Module 4: you already wrote this demo — it's Module 1's story, illustrated by the live system.** A demo is not a screen-share of n8n, JSON, or Google Sheets internals. It's **a story about a missed call, narrated by you, with the real system providing the proof at each beat.**

### The 4-step demo flow (fits in ~5 minutes)

1. **Open with the missed-call moment.** "Let's say it's 11 PM on a Saturday and your phone rings, you're asleep, you miss it..." — then *show the actual text* that goes out within seconds. Read it aloud.
2. **Walk to the CRM sheet.** Show how that same lead appears — full history in one place, status tracked from New through Booked. Don't explain "Google Sheets" as a technology — frame it as "your customer record system" (this is the exact framing `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §3 uses).
3. **Show the owner-side alert.** "And the moment that lead came in, here's what *you'd* see — the same instant, on your phone or in your inbox."
4. **Close the loop.** Show a booking confirmation and a reminder text — completing "missed call → job on the calendar."

### What to never say in a demo
- "n8n," "workflow," "node," "JSON," "API," "webhook," "Twilio," "Anthropic API" — these are **your** implementation details, not the client's mental model. If asked "what's running this," the honest, simple answer is: "It's a system we build and run for you — you don't need to manage any of it, that's our job."
- Don't open the n8n canvas itself, ever, in front of a client. If you need to show "the system is working," show the **CRM sheet** and the **SMS messages** — those are the client's actual interface to the product.

### Practice before client #1
Run the 4-step flow against the real Valfin Tech instance, with anonymized/test data, narrating it out loud, timed. You should be comfortably under 5 minutes with room for questions. **Mastery check (per `FOUNDER_TRAINING_PLAN.md`):** if something on-screen doesn't behave exactly as expected mid-demo, you should be able to keep going — because you're narrating the *story*, and the system is illustrating it, not the other way around.

---

## 3. What the Client Should and Should Not See

This is the practical access map — use it when deciding what to share, what to screen-share, and what stays on your side.

### ✅ The client SHOULD see / have access to:
- **Their own CRM Google Sheet** (`Leads`, `Appointments`, `Communication Log` tabs) — they own this data (see §14)
- **The actual SMS scripts** their customers receive, in their brand voice — read aloud at go-live per `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §4
- **`CLIENT_WELCOME_GUIDE_TEMPLATE.md`** (filled in for them) — their permanent reference document
- **Their own lead-intake form** (the one their customers/leads actually use)
- **Monthly ROI report** (Workflow 12) and daily/weekly digests (Workflows 07/08) — these are *for* them
- **Their own Stripe receipts/invoices**

### ❌ The client should NOT see / have access to:
- **The n8n canvas, workflow JSON, or n8n login** — this is Valfin's operational infrastructure, shared across the product. A client with n8n access could (even accidentally) break their own deployment or see structure that belongs to the product, not the engagement.
- **AI system prompts** (the confirmation-SMS prompt in Workflow 02, etc.) — these are Valfin's IP (see §14), and exposing them invites "can you just tweak the prompt yourself" requests that erode the managed-service framing.
- **Other clients' data, sheets, or configurations** — each client's CRM sheet and credentials are isolated; never reference another client by name or show cross-client data, even anonymized, without consent.
- **Anthropic / Twilio / Google account credentials** that are Valfin-managed (see §4) — the client doesn't need logins to infrastructure they're not operating.
- **Internal pricing anchors** (`PRICING_PACKAGING.md`'s dollar figures) — verbal/written quotes are always scoped to *them*, never the internal reference numbers.

**The simple rule:** the client sees **outcomes and their own data** — the CRM, the messages, the reports. They never see **how the machine works**. That line is also what they're paying for: it's a managed service, not a DIY toolkit.

---

## 4. Information, Access, Credentials, and Approvals Required From the Client

**Primary document: `CLIENT_ONBOARDING_INTAKE.md`** — sent immediately after the service agreement is signed (Stage 5 in the lifecycle diagram). Every question in it maps to a specific configuration value in `CLIENT_DEPLOYMENT_GUIDE.md` §3.

### What you collect from the client (via the intake packet)
| Category | What | Why |
|---|---|---|
| **Identity** (Section A) | Legal/brand name, service area, service list | Drives every customer-facing message and the AI confirmation-SMS prompt |
| **Contact** (Section B) | Owner's mobile (for alerts), existing Twilio account or "need one provisioned," main business phone | Owner-alert routing + missed-call detection |
| **Hours/Booking** (Section C) | Business hours, appointment slot structure, timezone, reminder windows | Booking form config + all schedule timing |
| **Lead handling** (Section D) | What makes a lead "urgent," follow-up cadence preference, lead sources, **average job value**, **baseline missed-call/booking rate** | Brand-voice tuning + ROI math + case-study baseline (D5 — capture this on Day 1, it's unrecoverable later) |
| **Brand voice** (Section E) | Tone (casual/professional), example phrases, things the system should never say | Every customer-facing SMS gets rewritten in this voice before go-live |
| **Existing tools** (Section F) | Current CRM/spreadsheet (for data migration), other software in use | Data migration scope + future "Built for you" opportunities |
| **Compliance** (Section G) | Do their intake forms already collect SMS consent? | Determines whether you hand them `SMS_CONSENT_LANGUAGE_GUIDE.md` |

### Credentials/access — who provides what
| Item | Who provides | Notes |
|---|---|---|
| **Twilio account + number** | Client provides their own, OR Valfin provisions one in the client's name | Either way, **A2P 10DLC / toll-free verification must start Day 1** — it's the longest lead time item and the actual go-live gate |
| **Google account for the CRM sheet** | Client's own Google account (you create the sheet in their Drive from the template), OR a Valfin-managed account if they prefer | Client owns the sheet either way (see §14) |
| **Anthropic API key** | Valfin-managed, shared/billed across clients | Client never sees or needs this |
| **n8n instance/workspace** | Valfin-managed | Client never sees or needs this |

### Approvals required before work proceeds
- **Signed Service Agreement** (`CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`) — hard gate, per `ONBOARDING_SOP.md` Phase 0
- **Setup fee paid** via Stripe Payment Link (`STRIPE_SETUP_GUIDE.md` §3) — the second half of the same hard gate
- **Sign-off on rewritten customer-facing SMS copy** (Phase 3) — client reviews and approves their actual brand-voice scripts *before* anything goes live
- **Confirmation that consent language has actually been implemented** on their live intake forms (if Section G revealed a gap) — a recommendation handed over but not implemented closes nothing (`SMS_CONSENT_LANGUAGE_GUIDE.md`)

---

## 5. Founder-Facing Kickoff Checklist

Use this the moment Stage 4 (agreement + payment) clears and you're moving into Stage 5. This is your personal "don't forget anything" list — everything on it maps to a document section referenced inline.

- [ ] **Record the deal-closed date** — this is the start of the "weeks to launch" metric (`CASE_STUDY_DATA_PLAN.md` Metric 5)
- [ ] **Send `CLIENT_ONBOARDING_INTAKE.md`** to the client (Google Form/Doc/PDF, whichever they prefer)
- [ ] **Start Twilio carrier verification immediately** — either on the client's existing Twilio account (Section B2) or a newly provisioned one. This is the #1 go-live blocker; everything else can be done in an afternoon, this takes days.
- [ ] **Copy `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx`** into the client's Google Drive, save as Google Sheets, delete `EXAMPLE-` rows (`CRM_SHEET_SCHEMA.md`)
- [ ] **While waiting for the intake packet back**, pre-stage your n8n clone work — read `CLIENT_DEPLOYMENT_GUIDE.md` §1-3 once so you know exactly what values you're about to be plugging in
- [ ] **When intake comes back:** capture D5 (baseline missed-call rate / monthly bookings) and D4 (average job value) **immediately** — these feed both the ROI conversation and the case-study baseline, and D5 specifically becomes permanently unrecoverable once the system goes live
- [ ] **Begin clone & configure** (§6/§7 below) — target 2-4 hours of actual configuration work per `CLIENT_DEPLOYMENT_GUIDE.md`
- [ ] **Run the full verification checklist** (§8 below) before telling the client anything is ready
- [ ] **Schedule the go-live walkthrough call** once Twilio verification clears and verification passes
- [ ] **Fill in `CLIENT_WELCOME_GUIDE_TEMPLATE.md`** for this client before that call

---

## 6. How to Use Claude to Clone and Customize the System for a New Client

This is the actual mechanic of Stage 6. **`CLIENT_DEPLOYMENT_GUIDE.md` is the spec — Claude is the executor.** Here's how to run that conversation efficiently:

### Before you start a Claude session for a new client clone
Have these ready (from the completed intake packet):
- The new client's brand name, owner phone, owner email, Twilio "from" number, and new Google Sheet ID
- Their business hours/timezone, booking slot structure (`CONFIG` constants in Workflow 06), email/SMS alert toggles (`CONFIG` in 04/07/08/11/12), follow-up cadence
- Their brand-voice notes and example phrases (Section E)

### What to tell Claude
Give Claude, in one message:
1. **"We're cloning the Valfin system for a new client — read `docs/CLIENT_DEPLOYMENT_GUIDE.md` for the full spec."**
2. The new client's configuration values (from the list above) — paste the filled-in intake packet directly, Claude can map answers to deployment-guide rows itself
3. **The order to follow is `CLIENT_DEPLOYMENT_GUIDE.md` §4** — Claude should import/configure workflow 01 (CRM Adapter) and 04 (Every Lead Alert, formerly "Hot Lead Alert") first, note their new workflow IDs, then re-point every other workflow's sub-workflow references to those new IDs before configuring the rest
4. **Ask Claude to rewrite all customer-facing SMS copy** in the client's brand voice (Section E answers) — this is the single highest-leverage "feels custom, not templated" step, and Claude can do this directly from the brand-voice notes
5. **Have Claude run the full verification checklist** (`CLIENT_DEPLOYMENT_GUIDE.md` §5) using `test_workflow`/`get_execution` against pinned/test data for every workflow — do not skip this even though it feels slow; it's what catches a mis-pointed Sheet ID or stale sub-workflow reference before a real customer ever sees it

### What Claude should NOT need to ask you mid-clone
Per `CLIENT_DEPLOYMENT_GUIDE.md` §3e, a few values are **business-rule judgment calls**, not pure data — Claude should flag these for your confirmation rather than guess:
- Email/SMS alert toggles (`CONFIG` in 04/07/08/11/12) — default is email-on/SMS-off for most clients, but ask if the client's intake suggested otherwise
- Follow-up cadence (default Day 1/3/7, stop at 3) — some clients may want more/fewer touches (D2)
- Booking time slots — **must match the client's actual hours** (Section C), this one always needs confirming

### After the clone
- Claude should leave you with: the new client's workflow IDs (especially 01 and 04, which others reference), confirmation that all 12 workflows are configured and verification-checklist-passed, and a list of anything it flagged as a judgment call for you to confirm before go-live.
- **You still run §8 (testing/go-live) and the human-facing parts** — Claude executes the technical clone, you run the relationship.

---

## 7. The Complete Onboarding Sequence

**Primary document: `ONBOARDING_SOP.md`** — this is the canonical 6-phase runbook. Below is the condensed version with cross-references; open the SOP itself for the full step-by-step.

| Phase | Timing | What happens | Key reference |
|---|---|---|---|
| **Phase 0 — Close Deal** | Before Day 0 | Hard gate: signed agreement + setup fee paid in Stripe. Do not proceed without both. | `CLIENT_ACCEPTANCE_FLOW.md`, `PAYMENT_PROCESS.md` |
| **Phase 1 — Kickoff Intake** | Day 0-1 | Send `CLIENT_ONBOARDING_INTAKE.md`, record deal-closed date, start Twilio verification | §4/§5 above |
| **Phase 2 — Carrier Verification** | Parallel, days | Twilio A2P 10DLC/toll-free — runs in the background while Phase 3 happens | `CLIENT_DEPLOYMENT_GUIDE.md` §1.2 |
| **Phase 3 — Configure Deployment** | Day 1-3 | Clone CRM sheet, credentials, all 12 workflows; rewrite customer-facing copy in client's voice; hand over `SMS_CONSENT_LANGUAGE_GUIDE.md` if Section G revealed a gap | §6 above, `CLIENT_DEPLOYMENT_GUIDE.md` §4 |
| **Phase 4 — Verify Before Go-Live** | Day 3-5 | Full verification checklist on every workflow, end-to-end real-SMS smoke test once Twilio clears | `CLIENT_DEPLOYMENT_GUIDE.md` §5 |
| **Phase 5 — Go Live** | Day 5-14 | Walkthrough call: hand over `CLIENT_WELCOME_GUIDE_TEMPLATE.md`, read 2-3 real SMS scripts aloud, set up the **recurring monthly Stripe Payment Link live on the call**, then flip every workflow to active | §8/§9 below, `STRIPE_SETUP_GUIDE.md` §4 |
| **Phase 6 — Ongoing Support** | Week 2+ | Health monitor (Workflow 11) + ROI report (Workflow 12) running automatically; best-effort support; 60-90 day case-study capture | §10/§11/§12 below |

**Typical timeline: 1-2 weeks from signed agreement to go-live**, gated almost entirely by Twilio carrier verification — your actual configuration work (Phase 3) is usually done in 2-4 hours.

---

## 8. Testing and Go-Live Procedures

### Testing (Phase 4 — before go-live)
Run the **full checklist in `CLIENT_DEPLOYMENT_GUIDE.md` §5** — one line per workflow (01 through 12), each with a specific pass/fail condition (e.g., "submit a test lead → confirm a `LEAD-####` row appears with correct columns"). Do not skip any of these, and do not tell the client they're "ready" until every line passes.

The final line of that checklist is the most important: **once Twilio is verified, send one real SMS to a real phone through the full chain** (intake → confirmation → booking → reminder → reply) and confirm delivery at every hop. This is the difference between "tested in isolation" and "actually works."

### Go-live (Phase 5)
1. **Walkthrough call** — this is a meeting, not an email. Walk through `CLIENT_WELCOME_GUIDE_TEMPLATE.md` together, section by section, **read aloud**.
2. **Read 2-3 real SMS scripts aloud** during the call — the actual brand-voice-rewritten copy this client's customers will receive (per `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §4 operator note).
3. **Set up the recurring monthly Stripe Payment Link, live, on this call** (`STRIPE_SETUP_GUIDE.md` §4) — this is a deliberate addition to Phase 5: doing it together, in the moment, while trust is highest, avoids a separate awkward "now send payment" follow-up later.
4. **Confirm consent language is live** on the client's actual intake forms if Section G flagged a gap — verify it's implemented, not just recommended.
5. **Flip every workflow to active.** This is the actual go-live moment — record the date (it's Metric 5 for the case study).

---

## 9. What the Client Experiences After Launch

This is the experience you're selling — and it's fully described from the client's point of view in **`CLIENT_WELCOME_GUIDE_TEMPLATE.md`**, which they now have as their own reference. The short version:

- **Every missed call** → an instant text-back within seconds, acknowledging it and inviting them to share what they need
- **Every new lead** (form, referral, etc.) → read, scored, and replied to automatically; urgent ones flagged straight to the owner's phone the moment they arrive
- **Leads that don't book right away** → followed up automatically on a schedule (Day 1/3/7 by default), never just "forgotten"
- **Appointments** → confirmed, reminded (24h + 2h), and tracked; reschedule/cancel requests handled conversationally via SMS reply
- **The owner gets told what's happening** on a predictable schedule (see §10) — without having to ask or check anything

The client's own customers experience a business that "never goes home for the night." The client (the owner) experiences a system that **tells them what they need to know, when they need to know it**, and otherwise stays out of their way.

---

## 10. Monthly Reporting Cadence

The client receives reporting at three layers — all automated, all already built:

| Report | Cadence | Audience | Workflow |
|---|---|---|---|
| **Instant urgent-lead alert** | Real-time, the moment a Hot/Emergency lead comes in | Owner | Workflow 04 |
| **Daily pipeline digest** | Every evening (~6 PM, configurable) | Owner (operational) | Workflow 07 |
| **Weekly pipeline report** | Weekly (e.g. Monday morning, configurable) | Owner (operational) | Workflow 08 |
| **Monthly ROI report** | Every 30 days | **Client-facing**, addressed to their brand name | Workflow 12 |

**The monthly ROI report (Workflow 12) is the one that justifies the recurring fee.** It's deliberately framed in outcome language — new leads, hot/urgent leads flagged, missed calls recovered, appointments booked/kept — addressed to the client's own brand, not as an internal ops digest. Per `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §2, the client is told explicitly: if any number looks off, or they want to see the math behind it, they just reply to that text — and you mean it.

**Founder action:** nothing recurring required — these are automated. Your only job is to **glance at each client's monthly ROI report when it sends**, so if a client replies asking about it, you're not caught flat-footed.

---

## 11. Support Expectations

Per `PRICING_PACKAGING.md` and `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §9, every client's monthly fee includes:

- **Standard maintenance** — credential health checks, schedule-trigger verification, Twilio delivery monitoring
- **Best-effort support response** — the agreement template leaves the exact response-time number as a fillable field; set a number you can actually hit as a solo founder (e.g., "within 1 business day for non-urgent issues, same-business-day for system-down issues") and **say it out loud at go-live**, per `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §5
- **A direct line** — text or call you, not a ticket queue. `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §5 frames this explicitly: the client never has to diagnose anything themselves, and you'd rather hear about a false alarm than have something real go unreported.

### Your backstop: Workflow 11 (System Health Monitor)
This runs daily, automatically, and texts **you** (never the client) if any scheduled workflow looks like it silently stopped running. This is what lets a solo founder support 10 clients without manually checking each one daily — **lean on it**. If it's quiet, things are working. If it alerts, that's your one signal to go look.

### What "support" actually looks like week-to-week
- Respond to client texts/calls per the response-time commitment above
- When Workflow 11 alerts, investigate and fix before the client notices
- Common requests per `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §6 (changing hours, adding a team member, updating service area) — these are routine config changes, handled directly, **not** a formal change-request process

---

## 12. Expansion and Upsell Opportunities

**Primary document: `PRICING_PACKAGING.md`'s "Built for you" tier** — this is a *menu*, not a Day-1 pitch. The natural moment to open this conversation is **month 2-3, once the client is stable and happy** (this also aligns with the case-study close-out conversation in §13 below — combine them).

### The menu (à la carte or bundled)
- Branded, embeddable web intake form (replaces the generic n8n-hosted form URL)
- Priority support SLA (same-business-day response vs. standard best-effort)
- Multi-location / multi-crew configuration
- CRM migration (e.g., Google Sheets → GoHighLevel) — the CRM Adapter pattern already isolates this swap to one workflow
- Calendar sync (Google Calendar/Outlook) for field-crew scheduling
- Phase 5 retention workflows (review requests, referral invites, seasonal campaigns)

### How to open the conversation
Don't lead with the menu. Lead with **"how's it going, what's working, what would make this even more useful?"** — let the client's own answer point at a menu item, then offer it as the natural next step. This mirrors the brand's overall "we design the system around how your business actually runs" framing — expansion revenue should feel like *responsiveness*, not *upselling*.

### The other expansion path: new clients, not just existing ones
Once client #1 is live and the 60-90 day case study (`CASE_STUDY_DATA_PLAN.md`) produces real numbers, **the acquisition playbook re-runs for the next vertical** (HVAC/plumbing first, per `CLIENT_ACQUISITION_PLAYBOOK.md`'s "How this generalizes" section) — same playbook, swap the vertical and point to the now-real case study instead of "in progress."

---

## 13. What Remains Manual vs. Automated

| | Automated (the system does this) | Manual (you do this) |
|---|---|---|
| **Lead response** | Missed-call SMS, form-capture confirmation, every-lead owner alert (email by default, SMS optional), follow-up sequence | — |
| **Appointments** | Booking confirmations, reminders (24h/2h), reschedule/cancel handling | Booking the appointment itself happens via the owner-facing form (someone enters it) |
| **Reporting** | Daily digest, weekly report, monthly ROI report, daily health monitor | Glancing at the monthly ROI report (§10); responding if a client asks about it |
| **Compliance backstop** | Opt-out keyword detection (STOP/UNSUBSCRIBE/etc.) | Verifying the client's *own* intake forms carry consent language (`SMS_CONSENT_LANGUAGE_GUIDE.md`) — this can never be automated, it lives on the client's forms |
| **Sales** | Lead Leak Calculator (on the website, runs itself) | Sourcing prospects, discovery calls, proposals, follow-up — all of Stages 1-4 |
| **Onboarding** | — | Intake collection, Twilio verification monitoring, the entire clone/configure pass (Stage 6), verification checklist, go-live call |
| **Support** | Health monitor alerts *you* to problems | You diagnose and fix; you respond to client contact |
| **Case study data** | The system logs everything needed (Communication Log, Appointments tab) | You ask the baseline questions (D5) on Day 1, and conduct the testimonial conversation at 60-90 days |
| **CRM** | All 3 live tabs (`Leads`/`Appointments`/`Communication Log`) read/written automatically | The 5 reconstructed tabs (`Quotes`/`Jobs`/`Follow Ups`/`Team Schedule`/`Dashboard`) are not wired to anything — don't build toward these unless a real client need surfaces (`FIRST_CLIENT_READINESS_REPORT.md` gap #4) |
| **Per-client cloning** | — | Fully manual, ~2-4 hours, following `CLIENT_DEPLOYMENT_GUIDE.md` with Claude as executor (§6 above) — there is no one-click installer (a documented future possibility, not built) |
| **Payments** | Recurring monthly charge (once Payment Link is set up) | Setting up each client's two Payment Links (one-time setup fee + recurring), monitoring for failed-payment notifications |

**The honest summary for a solo founder:** the *running system* (what a live client experiences day to day) is fully automated. The *sales and onboarding motion* (Stages 1-7) is fully manual and is where your time goes for each new client. Ongoing support for an already-live client (Stage 9) should be light — that's the leverage that lets one founder run 10 clients.

---

## 14. What Valfin Owns vs. What the Client Owns

Per `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §5 (Data & Privacy) and §7 (Intellectual Property):

### The client owns:
- **All of their business data** — leads, customer records, communication logs, appointment history — for the duration of the agreement and after termination
- **Their CRM Google Sheet** — they have direct access to it at any time; it's theirs
- **Their brand voice, custom copy, and any business information they provide**
- **The right to a full data export** within the timeframe specified in the agreement upon termination

### Valfin owns:
- **The underlying System** — workflows, templates, AI prompts, configuration architecture — including all improvements made across the entire client base. The client receives a **non-exclusive license to use their specifically-configured instance** for the duration of the agreement; they do not own the system itself.
- **The n8n infrastructure, credentials, and operational tooling** — this is why the client never gets n8n access (§3 above) — it's not their asset to access
- **The deployment/configuration know-how** (`CLIENT_DEPLOYMENT_GUIDE.md`, this playbook, etc.) — Valfin's operating IP

### The shared-responsibility line (compliance specifically)
Per `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §6: Valfin owns the **system-side compliance backstop** (opt-out detection, etc.) and providing consent-language recommendations. The client owns **implementing consent collection on their own intake channels**. Frame this to clients as shared responsibility, not blame — both `SMS_CONSENT_LANGUAGE_GUIDE.md` and the agreement template say this explicitly.

**The simplest way to say all of this to a client, if asked:** *"Your data is yours, always — you can see it and export it any time. The system that runs it is ours, and that's what your monthly fee keeps running and improving for you."*

---

## 15. Quick Reference — Document Index by Lifecycle Stage

| Stage | Open this document |
|---|---|
| Sourcing prospects | `CLIENT_ACQUISITION_PLAYBOOK.md` |
| Discovery call | `DISCOVERY_CALL_WORKBOOK.md`, `DISCOVERY_CALL_NOTES_TEMPLATE.md`, `DISCOVERY_CALL_SCORECARD.md` |
| Demo | This document §2, `FOUNDER_TRAINING_PLAN.md` Module 4 |
| Pricing conversation | `PRICING_PACKAGING.md` (internal anchor only — never quote verbatim) |
| Proposal | `PROPOSAL_PLAYBOOK.md`, `CLIENT_PROPOSAL_TEMPLATE.docx` |
| Agreement → Payment | `CLIENT_ACCEPTANCE_FLOW.md`, `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`, `PAYMENT_PROCESS.md`, `STRIPE_SETUP_GUIDE.md`, `INVOICE_TEMPLATE.docx` |
| Kickoff intake | `CLIENT_ONBOARDING_INTAKE.md` |
| Clone & configure | `CLIENT_DEPLOYMENT_GUIDE.md`, `CRM_SHEET_SCHEMA.md`, `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` |
| Compliance check | `SMS_CONSENT_LANGUAGE_GUIDE.md` |
| Verification | `CLIENT_DEPLOYMENT_GUIDE.md` §5 |
| Go-live | `CLIENT_WELCOME_GUIDE_TEMPLATE.md`, `STRIPE_SETUP_GUIDE.md` §4 |
| Ongoing operations | `ONBOARDING_SOP.md` Phase 6, Workflows 11 & 12 |
| Case study / measurement | `CASE_STUDY_DATA_PLAN.md` |
| Expansion conversation | `PRICING_PACKAGING.md` "Built for you" |
| Full runbook (any phase) | `ONBOARDING_SOP.md` |
| Top-level orientation | `VALFIN_FOUNDER_OPERATING_MANUAL.md` |

---

## Closing Note

Every piece of this playbook already existed in `docs/` before this document was written — this is the connective layer, not new material. **If something in a real client conversation doesn't match what's written here or in the documents it points to, that's the signal to update — not to improvise silently and hope it doesn't matter again.** That's the entire model for how Valfin evolves from here: real conversations surface real gaps, and those get closed when they're found, not guessed at in advance.
