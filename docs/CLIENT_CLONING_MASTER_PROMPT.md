# Client Cloning Master Prompt

**Purpose:** This is the single document a fresh Claude session needs — together with a client's intake answers and this repository — to deploy that client's instance of the Valfin system, end to end, from a signed agreement to a verified go-live. It does not assume you have read any other document first, and it does not assume any prior conversation history exists.

**How to use this document:** Open it at the start of every new client deployment. Read it fully once before touching n8n. It tells you what to build, what to ask for, what changes per client vs. what never changes, the exact order of operations, and how to know when you're done. Where it says "see `docs/X.md`," that document has more detail — but this prompt is self-sufficient for the mechanical deployment itself.

---

## 1. What Valfin V1.1 Is

Valfin is a **Revenue Operations Infrastructure** product: a connected stack of n8n workflows, a Google Sheets CRM, Twilio SMS, Gmail, and (minimally) the Claude API that makes sure a local service business **never loses a lead to a missed call, a slow follow-up, or a forgotten appointment.** The product is the **Revenue Recovery System** — Capture → Respond → Follow Up → Book, running 24/7, with the business owner kept informed by email (and optionally SMS) at every meaningful moment.

**V1.1 (2026-06-11)** is a simplification pass over the original V1 build. The most important things a cloning session needs to know about V1.1:

- **AI lead scoring is gone, system-wide.** There is no `Lead Score`, `Temperature` (Hot/Warm/Cold), or `Urgency` field anywhere. Every lead — regardless of how it looks — gets the exact same treatment: captured, confirmed, alerted, followed up, and (if booked) reminded.
- **Workflow 04 was renamed "Hot Lead Alert" → "Every Lead Alert"** and fires unconditionally for every form submission.
- **Email is the default notification/report channel** for the owner and client (Workflows 04, 07, 08, 11, 12). SMS is fully built into each of these but **disabled by default** — a one-line `CONFIG` toggle turns it on per client.
- **All scheduling and reporting math uses Luxon `DateTime` in `America/New_York`** (DST-safe). A client in a different timezone is a one-line `CONFIG` change.
- **A centralized `CONFIG` block** at the top of the relevant Code node in Workflows 04, 06, 07, 08, 09, 10, 11, and 12 is where almost all per-client cloning happens. Cloning is mostly "edit 8 CONFIG blocks," not "redesign workflows."
- **Claude Haiku 4.5 is the only AI model used in production** — for the customer-facing confirmation SMS in Workflow 02. Nothing else in the system calls an LLM.

Full rationale and before/after detail: `docs/V1_1_RECONCILIATION.md`.

---

## 2. Roofing Is the First Validated Implementation — Not the Final Market

The live, tested, reference deployment is a **Boston-area roofing company**. Every workflow, every CONFIG block, every piece of copy in this repo currently reflects that one business. **Roofing is the proof that the framework works — it is not the product's permanent or only market.**

The long-term direction is a **reusable service-business revenue recovery framework**, portable to any lead/appointment-driven local service business: HVAC, plumbing, electrical, solar, general contractors, real estate, insurance, legal, dental, med spas, consulting, and more (this list mirrors the website's own industries vocabulary — `website/src/content/industries.ts`).

The entire point of this document is to make that portability real and mechanical: a future deployment specialist (human or Claude) should be able to clone this system into a brand-new business — in roofing or in any of those other verticals — by following §7–§8 below, without redesigning anything.

---

## 3. The Reusable Framework vs. the Industry-Specific Customization Layer

Every cloning decision falls into exactly one of these two buckets. Knowing which bucket something is in tells you whether you're allowed to touch it.

### 3a. The Reusable Framework (do not redesign — clone as-is)

This is the engine. It is industry-agnostic by design and should be imported and wired up identically for every client:

- **All 13 workflow structures** (node graphs, branching logic, error handling, sub-workflow architecture)
- **The CRM Adapter pattern** (Workflow 01 — the sole Google-Sheets-writing sub-workflow, called by 02/03/05/06/10/13)
- **The Google Sheets CRM schema** (`Leads` 17 cols, `Appointments` 17 cols, `Communication Log` 9 cols — see `docs/CRM_SHEET_SCHEMA.md`)
- **The dual-gate email/SMS notification pattern** (Code node → "Check Email Enabled" IF → Gmail → converge → "Check SMS Enabled" IF → Twilio)
- **The `CONFIG` block pattern** itself (the mechanism, not its values)
- **Luxon/`America/New_York`-style DST-safe time handling** (the pattern — the actual timezone value is client-specific, see below)
- **The follow-up cadence logic** (Day 1/3/7, stop at 3 attempts or status change)
- **The reminder-window logic** (24h/2h windows, idempotency flags)
- **The reschedule/cancel keyword-classification + opt-out-detection logic**
- **The owner-initiated reschedule detection logic** (Workflow 13 — `Appt Date`/`Appt Time` vs. `Notified Appt Date`/`Notified Appt Time` comparison, with its own duplicate-notification guard)
- **The metrics computed by Workflows 07/08/11/12** (new leads, bookings, stale leads, missed-calls-recovered, etc. — these are universal service-business vocabulary)

### 3b. The Industry-Specific Customization Layer (this is what you change per client)

This is the surface. Every item below is a deliberate per-client edit, sourced from the client's intake answers:

- **`CONFIG` block values** in Workflows 04, 06, 07, 08, 09, 10, 11, 12, 13 (company name, contact info, timezone, business hours, toggles — see §4 and §6.4 of `docs/CLIENT_DEPLOYMENT_GUIDE.md`)
- **Customer-facing copy**: SMS templates (Workflows 02, 03, 05, 06, 09, 10, 13), the Workflow 02 AI confirmation-SMS prompt (`prompts/form_confirmation.system.md` — specifically the `company` field and tone), and all owner/client-facing email bodies (04, 07, 08, 11, 12, 13)
- **The lead-intake form** (Workflow 02) and **booking form** (Workflow 06) — field labels, services-offered dropdown, branding
- **Credentials** — every client gets their own Google Sheets, Twilio, and Gmail credentials (never reuse another client's)
- **The Google Sheet itself** — a fresh copy of `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` per client (rename tabs/headers only if the industry genuinely needs different fields — see §14)
- **Industry-specific vocabulary** in forms and SMS (e.g., "roof inspection" → "AC tune-up" for HVAC) — see §14 for what usually changes per vertical

**Rule of thumb:** if it's a node graph, connection, or piece of logic — leave it alone. If it's a string, a constant, a credential, or a CONFIG value — that's the customization layer.

---

## 4. The 13 Workflows — Complete Reference

| # | Workflow | File | Trigger | Mandatory? | Has `CONFIG`? | Email | SMS | Key Integrations |
|---|---|---|---|---|---|---|---|---|
| 01 | CRM Adapter | `01_crm_adapter_google_sheets.json` | `executeWorkflowTrigger` (sub-workflow) | **MANDATORY** | No | No | No | Google Sheets |
| 02 | Form Capture + Confirmation | `02_form_capture_scoring.json` | n8n Form + parallel webhook | **MANDATORY** | No (hardcoded constants) | No | Yes — AI-generated (Haiku 4.5) | Anthropic, Twilio, Sheets |
| 03 | Missed-Call Auto-SMS | `03_missed_call_auto_sms.json` | Twilio call-status webhook | **MANDATORY** | No (hardcoded constants) | No | Yes — static | Twilio, Sheets |
| 04 | Every Lead Alert | `04_every_lead_alert.json` | `executeWorkflowTrigger` (sub-workflow, called by 02) | **MANDATORY** | **Yes** | Yes — default **ON** | Yes — built, default **OFF** | Gmail, Twilio |
| 05 | Follow-Up Sequence | `05_follow_up_sequence.json` | Schedule, daily 9 AM ET | **MANDATORY** | No (inline constants) | No | Yes — static | Sheets, Twilio |
| 06 | Appointment Booking | `06_appointment_booking.json` | n8n Form | **MANDATORY** | **Yes** | No | Yes — static | Sheets, Twilio |
| 07 | Pipeline Status Digest | `07_pipeline_status_digest.json` | Schedule, daily 6 PM ET | Optional | **Yes** | Yes — default **ON** | Yes — built, default **OFF** | Sheets, Gmail, Twilio |
| 08 | Weekly Pipeline Report | `08_weekly_pipeline_report.json` | Schedule, Monday 8 AM ET | Optional | **Yes** | Yes — default **ON** | Yes — built, default **OFF** | Sheets, Gmail, Twilio |
| 09 | Appointment Reminders | `09_appointment_reminders.json` | Schedule, hourly | **MANDATORY** | **Yes** | No | Yes — dual-variant (24h/2h) | Sheets, Twilio |
| 10 | Reschedule/Cancel | `10_reschedule_cancel.json` | Twilio inbound-SMS trigger | Optional | **Yes** | No | Yes — dual (reschedule/cancel) | Sheets, Twilio |
| 11 | System Health Monitor | `11_system_health_monitor.json` | Schedule, daily 4 PM UTC | Optional | **Yes** | Yes — default **ON** | Yes — built, default **OFF** | Sheets, Gmail, Twilio |
| 12 | Client ROI Report | `12_client_roi_report.json` | Schedule, every 30 days, 9 AM ET | Optional | **Yes** | Yes — default **ON** | Yes — built, default **OFF** | Sheets, Gmail, Twilio |
| 13 | Appointment Reschedule Notifier | `13_appointment_reschedule_notifier.json` | Schedule | Optional (strongly recommended alongside 06/09) | **Yes** | Yes — default **ON** | Yes — built, default **OFF** | Sheets, Gmail, Twilio, CRM Adapter |

> **"Mandatory" means**: the system does not function as a Revenue Recovery System without it, OR another mandatory workflow calls it as a sub-workflow. "Optional" workflows add reporting/retention value but the core capture→respond→follow-up→book loop works without them. **Tier mapping** (see `docs/PRICING_PACKAGING.md`): **Foundation** = Workflows 01–05. **Growth** (default/recommended) = Foundation + Workflows 06–10. **Built for you** = Growth + à la carte (Workflows 11/12 are typically included in Growth and above as retention infrastructure; confirm against the client's signed proposal). **Workflow 13 should be cloned alongside 06 and 09 whenever appointment booking is in scope** — without it, an owner-initiated reschedule (a routine scheduling-conflict resolution) leaves the customer un-notified, which is the exact gap it was built to close.

### 4.1 What each workflow does

1. **CRM Adapter** — the *only* workflow that writes to Google Sheets. Upserts leads (mints `LEAD-####` IDs), writes Communication Log entries, supports `followUpCount` updates. Called by 02, 03, 05, 06, 10.
2. **Form Capture + Confirmation** — dual entry (n8n-hosted form + parallel webhook) → CRM Adapter upserts the lead → Claude Haiku 4.5 generates and sends a warm confirmation SMS to the customer → logs the touch → calls Workflow 04 for *every* submission.
3. **Missed-Call Auto-SMS** — Twilio call-status webhook → filters for no-answer/busy → sends a static "sorry we missed your call, here's our request form" SMS within seconds → logs a Communication Log entry only (no Lead row — `skipLeadCreation` routing).
4. **Every Lead Alert** — sub-workflow. Builds a clean, branded summary (company name, lead name/phone/email, requested service, requested date/time, source, timestamp) and emails the owner by default; SMS optional via `CONFIG`.
5. **Follow-Up Sequence** — daily 9 AM ET. Every New/Contacted lead not yet booked gets a static SMS on Day 1, 3, and 7 since creation, then stops. Booked leads are auto-excluded.
6. **Appointment Booking** — owner-facing form. Looks up the lead, writes a row to `Appointments`, sends the customer a confirmation SMS, updates the lead to `Booked` via the CRM Adapter. Structured scheduling: calendar-picker date + dropdown time slot (`CONFIG.BUSINESS_START_HOUR`–`BUSINESS_END_HOUR`, `APPOINTMENT_INCREMENT_MINUTES`, `DEFAULT_TIMEZONE`).
7. **Pipeline Status Digest** — daily 6 PM ET. Reads all leads, tallies New/Contacted/Booked/Stale counts, lists every Stale lead by name+phone, reports today's new leads/bookings. Emails the owner a branded summary by default. Read-only.
8. **Weekly Pipeline Report** — Monday 8 AM ET. Trailing-7-day metrics (new leads, bookings, stale count, bookings/new ratio, top sources). Emails the owner by default. Read-only.
9. **Appointment Reminders** — hourly. Computes 24h (20–28h-out) and 2h (1–3h-out) reminder windows from `Appt Date`/`Appt Time` using Luxon, sends personalized SMS, flags `Reminder 24h`/`Reminder 2h` columns to prevent duplicates.
10. **Reschedule/Cancel** — inbound SMS → keyword-classifies reschedule vs. cancel vs. opt-out vs. irrelevant → finds the customer's nearest upcoming `Scheduled` appointment by phone → updates `Status`/`Notes` → replies to the customer → alerts the owner. Standalone opt-out keywords (`STOP`, `UNSUBSCRIBE`, etc.) are routed to silent suppression — **never auto-replied to**.
11. **System Health Monitor** — daily 4 PM UTC (deliberately after 05/09 run). Checks live CRM data freshness against 05's and 09's own "overdue" thresholds (with safety buffers). Emails the *operator* (not the client) one consolidated alert if anything looks stale; silent otherwise.
12. **Client ROI Report** — every 30 days. Computes trailing-window metrics (new leads, missed calls recovered, appointments booked/kept) and emails the *client* (addressed to their own brand) a plain-language recap. This is the recurring-fee-justification / renewal tool — distinct in *purpose* from 07/08.
13. **Appointment Reschedule Notifier** — on a schedule, compares each `Scheduled` appointment's `Appt Date`/`Appt Time` against `Notified Appt Date`/`Notified Appt Time`. On a mismatch (the owner changed the appointment after the customer was told), texts the customer the new date/time with an invitation to reply or call if it doesn't work, emails the owner, updates the `Notified` columns, clears `Reminder 24h`/`Reminder 2h` so Workflow 09 sends fresh reminders, and logs the SMS via the CRM Adapter. Matching rows are skipped — the duplicate-notification guard.

### 4.2 Owner-facing vs. client-facing alerts — email or SMS?

| Workflow | Recipient | Default channel | SMS available? |
|---|---|---|---|
| 04 — Every Lead Alert | Owner (`OWNER_EMAIL`/`OWNER_PHONE`) | Email | Yes, toggle `SMS_ALERTS_ENABLED` |
| 07 — Pipeline Status Digest | Owner | Email | Yes, toggle `SMS_ALERTS_ENABLED` |
| 08 — Weekly Pipeline Report | Owner | Email | Yes, toggle `SMS_ALERTS_ENABLED` |
| 11 — System Health Monitor | Operator (Valfin, not the client) | Email | Yes, toggle `SMS_ALERTS_ENABLED` |
| 12 — Client ROI Report | Client (`CLIENT_EMAIL`/`CLIENT_PHONE`) | Email | Yes, toggle `SMS_ALERTS_ENABLED` |
| 13 — Appointment Reschedule Notifier | Customer (always, via SMS — not gated) + Owner (`OWNER_EMAIL`/`OWNER_PHONE`) | Customer: SMS. Owner: Email | Owner SMS via toggle `SMS_ALERTS_ENABLED` |

All follow the same dual-gate pattern (§3a) for the *owner/internal* alert — Workflow 13's customer-facing reschedule SMS is the core notification itself, not a gated alert, and always sends. **Default every new client to email-only** unless the intake explicitly asks for SMS alerts (intake §I, below) — email is free, richer, and doesn't depend on Twilio toll-free verification.

---

## 5. The `CONFIG` Block Reference (9 workflows, all client-specific values)

| Constant | Used in | What it controls | Source for new client |
|---|---|---|---|
| `COMPANY_NAME` | 04, 07, 08, 11, 12, 13 | Business name shown in emails/SMS | Intake §A1 |
| `OWNER_EMAIL` | 04, 07, 08, 11, 13 | Where owner alerts/digests/reports/health-monitor go | Intake §B |
| `OWNER_PHONE` | 04, 06, 07, 08, 09, 10, 11, 13 | Owner SMS recipient (alerts if enabled, reschedule/cancel alerts always) | Intake §B1 |
| `CLIENT_EMAIL` | 12 | Where the ROI report goes (often same as owner) | Intake §B / confirm with client |
| `CLIENT_PHONE` | 12 | ROI report SMS recipient if enabled | Intake §B / confirm with client |
| `TWILIO_FROM_NUMBER` | 02, 03, 04, 05, 06, 09, 10, 11, 12, 13 | The client's provisioned Twilio number | Intake §B2 / Twilio provisioning |
| `EMAIL_ALERTS_ENABLED` | 04, 07, 08, 11, 12, 13 | Email channel on/off (default `true`) | Intake §I, default `true` |
| `SMS_ALERTS_ENABLED` | 04, 07, 08, 11, 12, 13 | SMS channel on/off — gates the *owner* alert only; Workflow 13's customer SMS always sends (default `false`) | Intake §I, default `false` |
| `DEFAULT_TIMEZONE` | 04, 06, 07, 08, 09, 10, 11, 12, 13 | IANA timezone string, e.g. `'America/New_York'` | Intake §C3 |
| `BUSINESS_START_HOUR` | 06 | First bookable hour (24h, integer) | Intake §C1 |
| `BUSINESS_END_HOUR` | 06 | Last bookable hour (24h, integer) | Intake §C1 |
| `APPOINTMENT_INCREMENT_MINUTES` | 06 | Booking slot size in minutes | Intake §C2 |
| `WINDOW_DAYS` | 12 | ROI report trailing window (days) | Default `30` unless client requests otherwise |

Also client-specific but **not** in a `CONFIG` block (hardcoded constants inside Code/Set nodes — edit directly):

| Value | Appears in | Notes |
|---|---|---|
| Google Sheet ID (CRM spreadsheet) | 01, 05, 06, 07, 08, 09, 10, 11, 12, 13 | The single most-referenced per-client value — every workflow that touches the CRM needs it |
| Company name (string, pre-CONFIG workflows) | 02, 03, 05, 06, 09, 10 | Same value as `COMPANY_NAME`, but these workflows predate the CONFIG pattern — set the literal string |
| Twilio from-number (pre-CONFIG workflows) | 02, 03, 05, 06 | Same value as `TWILIO_FROM_NUMBER`, set as a literal |
| CRM Adapter sub-workflow ID | 02, 03, 05, 06, 10, 13 (`executeWorkflow` node) | The new instance's freshly-minted ID for Workflow 01 |
| Every Lead Alert sub-workflow ID | 02 (`executeWorkflow` node) | The new instance's freshly-minted ID for Workflow 04 |
| `prompts/form_confirmation.system.md` → `company` field | 02 (`Build Confirmation Request` Code node) | Hardcoded `'Valfin Tech'` in the reference build — set to the client's real business name |
| Monitored-workflow text labels | 11 (alert copy) | Update if workflow names differ in the new instance |

---

## 6. Required Client Intake Variables

This list is the canonical superset. The actual intake form (`docs/CLIENT_ONBOARDING_INTAKE.md`, Sections A–G) is sent to the client the same day the agreement is signed — collect every item below before Phase 3 (Configure Deployment) begins. Items marked **(critical / time-sensitive)** must be captured even under time pressure — some are permanently unrecoverable if skipped.

### §A — Business Identity
- **A1.** Brand name as it should appear in SMS/emails (`COMPANY_NAME`)
- **A2.** Service area (city/region — feeds copy and `DEFAULT_TIMEZONE` sanity-check)
- **A3.** Services offered (drives the form's service dropdown and SMS copy)

### §B — Contact / Phone
- **B.** Owner email for alerts/digests/reports (`OWNER_EMAIL`)
- **B1.** Owner mobile number for SMS alerts (`OWNER_PHONE`)
- **B2. (critical — #1 go-live blocker, ask first)** Does the client have an existing Twilio account/number, or does Valfin need to provision one? **Twilio toll-free/A2P 10DLC verification takes days — start this immediately, Phase 2, in parallel with everything else.**
- **B3.** Business's main public phone number (the one customers call — used for missed-call routing context)

### §C — Hours / Booking
- **C1.** Business hours → `BUSINESS_START_HOUR` / `BUSINESS_END_HOUR`
- **C2.** Appointment slot length → `APPOINTMENT_INCREMENT_MINUTES`
- **C3. (critical)** Timezone → `DEFAULT_TIMEZONE` (IANA string, e.g. `America/New_York`, `America/Chicago`)
- **C4.** Reminder lead times (default: 24h + 2h — only change if the client has a strong reason)

### §D — Lead Handling
- **D1.** What makes a lead "urgent" for this business (informs copy, not scoring — scoring is removed)
- **D2.** Follow-up touch count (default: 3 over 7 days — Day 1/3/7)
- **D3.** Lead sources the client currently uses (website, referrals, ads, etc. — populates `Source` values)
- **D4. (critical — sharpens ROI math)** Average revenue per completed job
- **D5. (critical — PERMANENTLY UNRECOVERABLE IF SKIPPED, capture Day 1)** Client's own estimate of: weekly missed-call rate, monthly job/booking count, average job value. This is the case-study baseline ("before") — see `docs/CASE_STUDY_DATA_PLAN.md`.

### §E — Brand Voice
- **E1.** Tone for automated texts + example phrases in the client's own words (used to rewrite every customer-facing SMS/email template — never ship Valfin's roofing-flavored copy verbatim)
- **E2.** Things automated texts should never say or imply (compliance/brand guardrails)

### §F — Existing Tools / Data
- **F1.** Existing lead-tracking system, if any (potential CRM migration source — out of scope for standard deployment, flag as "Built for you" add-on)
- **F2.** Other software in use (QuickBooks, scheduling tools, etc. — flag for future integration conversation, do not build speculatively)

### §G — Compliance / Consent
- **G1. (critical)** Does the client's existing intake (digital forms, paper forms, phone scripts) collect SMS consent? If not, hand them `docs/SMS_CONSENT_LANGUAGE_GUIDE.md` during Phase 3.
- **G2.** Confirm the client understands A2P 10DLC / toll-free verification has a multi-day lead time (sets go-live expectations).

### §H — Google Sheets Ownership
- Confirm: does Valfin create the CRM spreadsheet from `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` under a Valfin-managed Google account (standard), or does the client want it under their own Google Workspace account (note: requires their own OAuth2 credential in n8n)? Default to Valfin-managed unless the client requires data residency in their own account.

### §I — Alert Preferences
- Email alerts: default **ON** for 04/07/08/11/12. Confirm recipient addresses.
- SMS alerts: default **OFF**. Only enable per workflow if the client explicitly requests it (requires Twilio verified and `TWILIO_FROM_NUMBER` configured).

### §J — Form Customizations
- Lead-intake form (Workflow 02) and booking form (Workflow 06): confirm field labels, services dropdown contents, and any client-specific fields (e.g., "roof type" → "system type" for HVAC).

### §K — Reporting Preferences
- Confirm recipients and channel for Workflows 07/08/11/12 (07/08 → owner, 11 → Valfin operator, 12 → client). Confirm `WINDOW_DAYS` for Workflow 12 (default 30; some clients may prefer 14 or 60 — confirm against signed proposal).

---

## 7. Accounts, Credentials, Access, and Approvals Checklist

Run through this before Phase 3 (Configure Deployment) — Twilio (item 2) has the longest lead time and should start on Day 1.

| # | What | Who provides it | Required by |
|---|---|---|---|
| 1 | Signed Service Agreement (`docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`) | Client signature | **Hard gate — Phase 0.** No configuration begins without this. |
| 2 | Setup fee paid (Stripe Payment Link, one-time) | Client payment | **Hard gate — Phase 0.** Confirmed in Stripe before Phase 1 intake is sent. |
| 3 | Twilio account + phone number (existing or newly provisioned) | Client or Valfin (per intake §B2) | Phase 2 — start immediately, runs in parallel, days of lead time |
| 4 | A2P 10DLC / toll-free verification | Twilio + client business info | Phase 2 — same lead time as #3, must complete before go-live |
| 5 | Google account to own the CRM spreadsheet | Valfin-managed (default) or client (per intake §H) | Phase 1 — Sheet setup |
| 6 | Copy of `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` into that Google account | Valfin (Claude can guide; actual Drive upload is a human action) | Phase 1 |
| 7 | `Google Sheets account` credential (OAuth2) in n8n | Valfin, scoped to the new client's Sheet | Phase 1, before importing 01 |
| 8 | `Anthropic API` credential (Header Auth, `x-api-key`) in n8n | Valfin's Anthropic account (shared across clients — only used by Workflow 02) | Before importing 02 |
| 9 | `Twilio account` credential (Twilio API) in n8n | Client's Twilio Account SID + Auth Token | Before importing any Twilio-using workflow |
| 10 | Gmail OAuth2 credential in n8n, for the address that should send owner/client emails | Valfin-managed (`valfintechnologies@gmail.com`) by default, or client's own Gmail/Workspace if they want emails to come "from" their own domain | Before importing 04/07/08/11/12 |
| 11 | Client business facts — full intake packet (§6 above) | Client, via the intake form | Before Phase 3 |
| 12 | Owner's mobile number, confirmed reachable, for live SMS testing | Client | Phase 4 — verification |
| 13 | Recurring Stripe subscription set up live on the go-live call | Founder + client (live, on the call) | Phase 5 |
| 14 | Recipient confirmation for SMS_CONSENT_LANGUAGE_GUIDE.md implementation (if intake §G1 revealed a gap) | Client | Phase 4 — go-live verification, not just "recommendation handed" |

**Three credential names to use exactly (so future updates can find them by name):** `Google Sheets account`, `Anthropic API`, `Twilio account`. Add a fourth, `Gmail OAuth2 API` (or similarly descriptive), for the Gmail credential.

---

## 8. Step-by-Step Deployment Sequence — Signed Agreement → Go-Live

This sequence is the **6-Phase Onboarding SOP** (full detail: `docs/ONBOARDING_SOP.md`). Each phase names its trigger, its deliverable, and which document governs it.

### Phase 0 — Close Deal
- **Trigger:** Prospect says yes.
- Confirm tier (default: Growth — Workflows 01–10). Send `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` for signature. Send the one-time setup-fee Stripe Payment Link.
- **Hard gate:** do not proceed to Phase 1 without (a) a signed agreement and (b) confirmed setup-fee payment in Stripe.

### Phase 1 — Kickoff Intake (Day 0–1)
- Send the full intake packet (`docs/CLIENT_ONBOARDING_INTAKE.md`, §A–G) the same day the agreement is signed.
- **Record two dates immediately**: deal-closed date and target go-live date (this becomes the case-study "weeks to launch" metric — `docs/CASE_STUDY_DATA_PLAN.md`).
- **Capture intake §D5 (baseline missed-call rate / bookings / job value) on Day 1** — this is the one piece of data that cannot be recovered later.
- Flag intake §B2 (Twilio) and §G2 (consent-language awareness) as priorities — they have the longest lead times.

### Phase 2 — Carrier Verification (Day 1, runs in parallel)
- Provision or verify the client's Twilio number and A2P 10DLC / toll-free registration.
- This runs in the background and does **not** block configuration work.

### Phase 3 — Configure Deployment (Day 1–3)
- This is the mechanical cloning step. Follow §9 below exactly.

### Phase 4 — Verify Before Anyone Sees It (Day 3–5)
- Run the full verification checklist (§10 below) for every workflow.
- **Do not announce go-live until Twilio is verified AND a real end-to-end SMS has been confirmed.**

### Phase 5 — Go Live (Day 5–14)
- Fill in `docs/CLIENT_WELCOME_GUIDE_TEMPLATE.md` for this client.
- Hold a walkthrough call: read the welcome guide section-by-section, read 2–3 actual brand-voice-rewritten SMS scripts aloud together, show the live CRM.
- **Set up the recurring monthly Stripe subscription live on this call** — billing anchors to this date.
- Activate all workflows.

### Phase 6 — Ongoing Support (Week 2+, indefinite)
- Weekly (month 1), then monthly: spot-check Workflows 05/07/08/09 and review Workflow 11 health-monitor alerts.
- Monthly: Workflow 12 ROI report goes to the client — walk through the first one live with them.
- Month 2–3: open the "Built for you" expansion menu (§12).
- 60–90 days post-launch: close the case-study measurement window (§11 of `docs/CASE_STUDY_DATA_PLAN.md`) — six numbers, handed to the website track (do not edit `website/src/content/*.ts` directly — coordinate).

---

## 9. The Exact Sequence Claude Should Follow When Cloning

Run these steps **in this order**. Steps 3 and 4 (importing Workflows 01 and 04 first) are load-bearing — every other workflow either calls 01, calls 04, or both, and needs their new instance IDs.

1. **Set up the CRM spreadsheet.** Copy `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` into the client's Google account (per intake §H). Note the new spreadsheet ID. Either delete the 5 reconstructed/no-live-dependency tabs (`Quotes`, `Jobs`, `Follow Ups`, `Team Schedule`, `Dashboard`) or clearly annotate them as "not yet wired to any workflow" before handing the sheet to the client — see `docs/CRM_SHEET_SCHEMA.md`.

2. **Create the 4 credentials** in the new n8n instance/project: `Google Sheets account` (OAuth2, pointed at the new spreadsheet's Google account), `Anthropic API` (Header Auth, `x-api-key` — Valfin's shared key, used only by Workflow 02), `Twilio account` (Twilio API, the client's SID/token), and a Gmail OAuth2 credential for outgoing email.

3. **Import Workflow 01 (CRM Adapter) first.** Set the new spreadsheet ID everywhere it's referenced. Attach `Google Sheets account`. Activate it. **Note its new workflow ID** — every other workflow that calls it needs this.

4. **Import Workflow 04 (Every Lead Alert) second.** Set its `CONFIG` block: `COMPANY_NAME`, `OWNER_EMAIL`, `OWNER_PHONE`, `TWILIO_FROM_NUMBER`, confirm `EMAIL_ALERTS_ENABLED: true` / `SMS_ALERTS_ENABLED: false` (or per intake §I). Attach Gmail + Twilio credentials. Activate it. **Note its new workflow ID.**

5. **Import Workflows 02, 03, 05, 06, 10** (the workflows that call 01, and in 02's case also 04):
   - Re-point every `executeWorkflow` reference to Workflow 01 (and, in 02, also to Workflow 04) to the new IDs from steps 3–4.
   - Set the new spreadsheet ID (05, 06, 10).
   - Set the company name (literal string, not CONFIG) in 02, 03, 05, 06, 10.
   - Set `TWILIO_FROM_NUMBER` (literal in 02/03/05/06; CONFIG in 10).
   - Update `prompts/form_confirmation.system.md`'s `company` field inside 02's `Build Confirmation Request` Code node to the client's real business name; rewrite the tone per intake §E1/§E2.
   - Rewrite all static SMS templates (02 fallback, 03, 05, 06, 10) in the client's brand voice per intake §E.
   - Set Workflow 06's `CONFIG` block: `DEFAULT_TIMEZONE`, `BUSINESS_START_HOUR`, `BUSINESS_END_HOUR`, `APPOINTMENT_INCREMENT_MINUTES` (intake §C).
   - Set Workflow 10's `CONFIG` block: `OWNER_PHONE`, `TWILIO_FROM_NUMBER`, `DEFAULT_TIMEZONE`.
   - Attach credentials (Sheets, Twilio, and — for 02 only — Anthropic).
   - Activate each.

6. **Import Workflows 07, 08, 09, 11, 12**:
   - Set the new spreadsheet ID in all five.
   - Set each `CONFIG` block:
     - **07/08**: `COMPANY_NAME`, `OWNER_EMAIL`, `OWNER_PHONE`, `TWILIO_FROM_NUMBER`, `DEFAULT_TIMEZONE`, alert toggles per intake §I.
     - **09**: `OWNER_PHONE` (for any owner-facing context), `TWILIO_FROM_NUMBER`, `DEFAULT_TIMEZONE`.
     - **11**: `COMPANY_NAME`, the Valfin operator's own email/phone (this one is *not* client-facing — it alerts Valfin), `CRM spreadsheet ID`, and update the monitored-workflow text labels if workflow names differ.
     - **12**: `COMPANY_NAME`, `CLIENT_EMAIL`, `CLIENT_PHONE`, `TWILIO_FROM_NUMBER`, `DEFAULT_TIMEZONE`, `WINDOW_DAYS` (default 30), alert toggles per intake §I.
   - Attach credentials (Sheets, Gmail, Twilio as applicable).
   - Activate each.

7. **Confirm the intake form URL.** Workflow 02's n8n-hosted form gets a fresh URL on import — note it, and (if applicable) embed/link it on the client's website or wherever they direct leads. Same for Workflow 06's booking form.

8. **Run the full verification checklist** — §10 below.

9. **Resolve Twilio verification before announcing go-live.** If A2P 10DLC/toll-free is still pending, the system can be fully configured and tested via email channels and Twilio's test mode, but do not tell the client they're "live" until real SMS delivery is confirmed.

---

## 10. Testing and Validation Procedures

For each workflow, use the n8n `test_workflow` / `get_execution` pattern with pinned test data, then confirm the result in the live Sheet/inbox/phone. Minimum checks per workflow:

| Workflow | Test |
|---|---|
| 01 — CRM Adapter | Test upsert: new lead creates a row with a minted `LEAD-####` ID; re-running with the same identifying info updates rather than duplicates. |
| 02 — Form Capture + Confirmation | Submit a real test lead through the form → confirm: CRM row created, Communication Log entry written, customer receives a Haiku-generated confirmation SMS, owner receives an Every Lead Alert email (and SMS if enabled). |
| 03 — Missed-Call Auto-SMS | Simulate a Twilio no-answer/busy call-status webhook → confirm static SMS sent within seconds and a Communication Log entry is written with **no** Lead row created. |
| 04 — Every Lead Alert | Covered by 02's end-to-end test. Independently: confirm the email is branded (no raw JSON), and if SMS is enabled, confirm SMS delivery too. |
| 05 — Follow-Up Sequence | `test_workflow` with pinned data containing leads at Day 1/3/7/8+ thresholds → confirm correct subset gets messaged, Day 8+ and Booked leads are excluded, Follow-up Count increments correctly. |
| 06 — Appointment Booking | Submit a real test booking → confirm: Appointments row written with correct date/time, customer confirmation SMS sent, lead status updated to `Booked` via CRM Adapter, Follow-Up Sequence and Every Lead Alert unaffected. |
| 07 — Pipeline Status Digest | `test_workflow` → confirm counts (New/Contacted/Booked/Stale) match a hand count of the test sheet, all Stale leads listed, email arrives branded. |
| 08 — Weekly Pipeline Report | `test_workflow` with a week of pinned data → confirm trailing-7-day metrics match hand calculation. |
| 09 — Appointment Reminders | Pin appointments at exactly inside/outside the 24h and 2h windows → confirm correct sends, `Reminder 24h`/`Reminder 2h` flags written, no duplicate sends on a second run. |
| 10 — Reschedule/Cancel | `test_workflow` with pinned inbound SMS for all 4 paths: reschedule-found, cancel-found, not-found, and a standalone opt-out keyword (e.g., `"STOP"`) → confirm the opt-out path produces **zero** automated reply. |
| 11 — System Health Monitor | `test_workflow` twice: once with deliberately stale data (confirm alert fires, correctly formatted) and once with clean data (confirm zero-item silent pass — no email/SMS sent). |
| 12 — Client ROI Report | `test_workflow` with pinned data spanning inside/outside the `WINDOW_DAYS` boundary → confirm all computed metrics match hand-verified expectations and the email reads naturally with the client's brand name. |
| 13 — Appointment Reschedule Notifier | Run twice on a pinned `Scheduled` row: (1) `Appt Date`/`Appt Time` deliberately mismatched against `Notified Appt Date`/`Notified Appt Time` → confirm customer SMS, owner email, `Notified` columns updated, `Reminder 24h`/`Reminder 2h` cleared, and a Communication Log entry via the CRM Adapter; (2) immediately re-run with no further changes → confirm zero items detected and no duplicate send. |

**Final step — real end-to-end SMS smoke test**: from a real phone, trigger a missed call and a form submission against the live client number, and confirm real SMS arrives. This is the one test that cannot be faked with pinned data and is the actual go/no-go signal for Twilio readiness.

---

## 11. Go-Live Checklist

- [ ] Signed Service Agreement on file
- [ ] Setup fee paid and confirmed in Stripe
- [ ] Full intake packet (§6) completed, including §D5 baseline (captured Day 1)
- [ ] CRM spreadsheet created from template, correct spreadsheet ID set in Workflows 01, 05, 06, 07, 08, 09, 10, 11, 12
- [ ] All 4 credentials created and attached to the correct nodes
- [ ] Workflows 01 and 04 imported first; their new IDs re-pointed in every caller (02, 03, 05, 06, 10)
- [ ] All 8 `CONFIG` blocks (04, 06, 07, 08, 09, 10, 11, 12) filled with this client's values
- [ ] All hardcoded per-client constants set (spreadsheet ID, company name, Twilio number — in 02, 03, 05, 06, 09, 10 where not yet CONFIG-driven)
- [ ] All customer-facing copy rewritten in the client's brand voice (intake §E) — nothing Valfin-roofing-flavored remains
- [ ] Intake §G1 (SMS consent) gap addressed — `docs/SMS_CONSENT_LANGUAGE_GUIDE.md` handed to client if needed, and confirmed implemented (not just "recommended")
- [ ] All 13 workflows activated
- [ ] Per-workflow verification (§10) completed for every workflow
- [ ] Twilio number verified (A2P 10DLC / toll-free) — confirmed via a real outbound SMS to an unverified-class number
- [ ] Real end-to-end SMS smoke test passed (missed call + form submission, both produce real SMS)
- [ ] `docs/CLIENT_WELCOME_GUIDE_TEMPLATE.md` filled in for this client
- [ ] Go-live walkthrough call held; welcome guide read aloud; 2–3 real SMS scripts read aloud
- [ ] Recurring monthly Stripe subscription created live on the go-live call
- [ ] Deal-closed date and go-live date both recorded (for the case-study "weeks to launch" metric)

---

## 12. Post-Launch Support Checklist

**Week 1–4 (month 1):**
- [ ] Weekly spot-check of Workflows 05, 07, 08, 09 — confirm scheduled runs executed and look correct
- [ ] Confirm Workflow 11 (System Health Monitor) is reaching the Valfin operator's inbox and staying silent on clean days
- [ ] Respond to client questions within best-effort same-business-day (or per SLA if "Built for you" priority support was purchased)
- [ ] Use the welcome guide's week-1 FAQ as the first line of triage for common questions

**Month 2 onward:**
- [ ] Monthly spot-check of 05/07/08/09/11 (reduce from weekly once stable)
- [ ] Walk the client through their first Workflow 12 ROI report live
- [ ] Watch for stale-data alerts from Workflow 11 — investigate same-day

**Troubleshooting first move:** Workflow 11's alert tells you *what looks stale* (overdue reminders or follow-ups) — start there rather than opening n8n cold. Compare against 09's/05's own threshold logic, since 11 deliberately mirrors them.

---

## 13. Renewal and Expansion Checklist

**Timing:** Combine with the case-study close-out conversation, typically month 2–3.

- [ ] Confirm 60–90-day case-study measurement window has closed (`docs/CASE_STUDY_DATA_PLAN.md`) — capture the six numbers (baseline missed-call rate, response rate/speed, additional jobs/month, revenue recovered, weeks-to-launch, testimonial + attribution permission)
- [ ] Hand the filled case-study data package to the website track — **do not edit `website/src/content/*.ts` directly**; coordinate the handoff
- [ ] Open the renewal conversation: *"As we move into month 3, I want to make sure everything's working the way we planned — and ask if there's anything we could do to make it even more useful."*
- [ ] Lead with the client's own answer, not a menu — let it point to a relevant "Built for you" item:
  - Branded, embeddable web intake form
  - Priority support SLA
  - Multi-location / multi-crew configuration
  - CRM migration (e.g., Sheets → GoHighLevel)
  - Calendar sync (Google Calendar/Outlook)
  - Phase 5 retention workflows (review requests, referral invites, seasonal campaigns) — not yet built; build only once a real client need surfaces
- [ ] Confirm month-to-month contract continues automatically via the recurring Stripe subscription — no action needed unless the client requests a change or cancels with 30-day notice
- [ ] If this is the flagship/first client and the case study is now real and verified: update the "founding-partner" pitch in `docs/CLIENT_ACQUISITION_PLAYBOOK.md` to reference the new verified result for the *next* prospect/vertical

---

## 14. Cloning Into a Different Industry (HVAC, Plumbing, Dental, Legal, etc.)

The framework (§3a) is identical across industries. What changes is entirely in the customization layer (§3b), and it follows the same intake process (§6) — there is no separate "industry mode." Concretely:

**What usually changes:**
- **Vocabulary in copy**: "roof inspection" → "AC tune-up" (HVAC), "leak repair" → "drain cleaning" (plumbing), "free inspection" → "consultation" (dental/legal). This is intake §A3 + §E.
- **Services dropdown** in Workflows 02 and 06's forms.
- **What counts as "urgent"** (intake §D1): a roof leak vs. a no-heat call in winter vs. a burst pipe vs. a same-day dental emergency — same mechanism (it's descriptive copy, not a scoring threshold, since scoring was removed in V1.1), different examples.
- **Business hours / appointment increments** (intake §C1/§C2): a dental office might use 60-minute increments during 9–5; a 24/7 emergency plumber might need `BUSINESS_START_HOUR`/`END_HOUR` to span more of the day, or a "we'll call you back" pattern instead of self-service booking for true emergencies.
- **Average job value and follow-up cadence assumptions** (intake §D2/§D4): a legal consultation's "job value" and decision timeline look very different from a $400 HVAC repair — Workflow 05's Day 1/3/7 cadence may need to become Day 1/3/7/14 for longer sales cycles. This is a deliberate per-client judgment call, not a framework limitation.
- **CRM tab vocabulary**, if the industry genuinely needs different fields than `Leads`/`Appointments`/`Communication Log` cover (e.g., a dental practice might want a "Procedure Type" column). Add columns to the cloned spreadsheet and to the relevant CRM Adapter (01) `Resolve & Build Lead Row` node — this is the one place a structural change might be warranted, and it should only be made if the standard 17/15/9-column schema genuinely can't represent the client's data, not as a default.

**What stays exactly the same:**
- All 13 workflow node graphs and connections
- The CRM Adapter pattern and sub-workflow architecture
- The dual-gate email/SMS notification pattern
- The `CONFIG` block mechanism
- Luxon/timezone handling pattern (only the `DEFAULT_TIMEZONE` value changes)
- The reminder/follow-up/reschedule logic and thresholds (the *numbers* may be tuned per intake, but the *logic* doesn't change)
- The metrics computed by 07/08/11/12 — "leads," "appointments," "missed calls recovered," "follow-ups" are universal service-business vocabulary and require no rewrite

**The acquisition-side mirror** (for context, not part of this deployment prompt's scope): `docs/CLIENT_ACQUISITION_PLAYBOOK.md` describes the equivalent three-change pattern for sales — swap the ICP's industry name, swap sourcing channels for that vertical's equivalent, and update the founding-partner pitch to reference whichever case study is live and verified by then.

---

## 15. Acceptance Checklist — Deployment Is Not Successful Until All of These Are True

This is the final gate. If any item below is unchecked, the deployment is incomplete — regardless of how much configuration work has been done.

- [ ] A real lead submitted through the live form produces, within seconds: a CRM row, a Communication Log entry, a customer confirmation SMS in the client's brand voice, and an owner Every Lead Alert (email, and SMS if enabled)
- [ ] A real missed call to the client's live Twilio number produces a real SMS to the caller within seconds, with no Lead row created
- [ ] A real booking through the live booking form produces an Appointments row, a customer confirmation SMS, and a lead status update to `Booked`
- [ ] Appointment reminders fire correctly at the 24h and 2h marks with no duplicates (verified via pinned-data test, since real-time waiting isn't practical)
- [ ] Texting a standalone opt-out keyword (e.g., "STOP") to the live number produces **zero** automated reply
- [ ] The owner is receiving Pipeline Status Digest and Weekly Pipeline Report on schedule, in their brand voice, with no raw JSON
- [ ] Workflow 11 is confirmed reaching the Valfin operator and has been tested in both its silent and alerting states
- [ ] The client has received and understands their `CLIENT_WELCOME_GUIDE_TEMPLATE.md`, walked through live, including 2–3 real SMS scripts read aloud
- [ ] Intake §D5 baseline data is recorded (cannot be recovered after this point)
- [ ] SMS consent language (per intake §G1) is implemented on the client's actual intake channels, not just recommended
- [ ] Recurring Stripe subscription is active, billing from the go-live date
- [ ] Deal-closed date and go-live date are both recorded in the client's record
- [ ] The client knows how to report something that looks off (per the welcome guide's "if something looks off" section)

When every box above is checked, the deployment is complete and the client moves into Phase 6 (Ongoing Support, §12).
