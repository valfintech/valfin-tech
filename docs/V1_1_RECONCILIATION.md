# V1.1 Reconciliation Report — Simplification & Usability Pass

_Completed 2026-06-11. This is the canonical changelog for the V1.1 pass referenced throughout the repo (`README.md`, `ROADMAP.md`, `PROJECT_STATUS.md`, `PROJECT_AUDIT.md`, `CRM_SHEET_SCHEMA.md`, `CLIENT_DEPLOYMENT_GUIDE.md`, and others)._

## Why this pass happened

After the live demo and a full review of the workflows, Google Sheets CRM, and founder-facing docs, real operational feedback identified that the AI lead-scoring layer and several SMS-only reporting/alerting paths added complexity, judgment-call maintenance, and per-client configuration burden without proportional value. **These are intentional product decisions, not bug fixes.** The goal: make Valfin easier to operate, easier to explain, easier to sell, and easier to clone across industries — not to add features.

---

## 1. AI lead scoring removed system-wide

- Removed the entire scoring layer: `Lead Score` (1–100), `Temperature` (Hot/Warm/Cold), `Urgency` (Emergency/Normal), the Claude Sonnet 4.6 scoring call, the scoring system prompt, and every Hot/Emergency branch, condition, and IF node built on top of those values.
- **Workflow 02** (renamed **"Form Capture + Confirmation"**, formerly "Form Capture + AI Scoring"): no longer scores leads. It still uses AI — Claude Haiku 4.5 generates the customer-facing confirmation SMS — but that's the only AI call left anywhere in the system.
- **Workflow 01 (CRM Adapter)**: `leadScore`/`temperature`/`urgency` removed from its input/output contract. The `Resolve & Build Lead Row` and `Upsert Lead` nodes no longer read or write those fields.
- **Workflow 05 (Follow-Up Sequence)**: removed all `Temperature`-based filtering/branching — every unbooked New/Contacted lead gets the same Day 1/3/7 cadence regardless of any prior score.
- **Workflow 07 (Pipeline Status Digest)**: the "Stale AND Temperature in {Hot, Warm}" escalation filter was removed — the digest now lists **all** Stale leads by name + phone, with no temperature filter (there's nothing left to filter on).
- **Workflow 10 (Reschedule/Cancel)**: confirmed it never depended on scoring fields — no change needed beyond the general timezone/CONFIG pass (see §6/§8).
- **Documentation**: every doc that referenced AI scoring, Lead Score, Temperature, Hot/Warm/Cold, or "Hot lead" thresholds was reconciled — see §9.

**Result:** Claude Haiku 4.5 (Workflow 02's confirmation SMS) is the only model in production use. Claude Sonnet 4.6 is no longer called anywhere.

---

## 2. "Hot Lead Alert" → "Every Lead Alert"

- **Workflow 04** was renamed from **"Hot Lead Alert"** to **"Every Lead Alert"**. It now fires unconditionally for **every** form submission (Workflow 02 calls it for every lead, not just ones that scored "Hot" or "Emergency" — there's nothing left to score).
- **Notification channels**: Email is now the default delivery channel (`EMAIL_ALERTS_ENABLED: true`). SMS is fully built but disabled by default (`SMS_ALERTS_ENABLED: false`) — both are per-client toggles in the workflow's `CONFIG` block.
- **Architecture**: Code node → "Check Email Enabled" (IF) → true branch sends via Gmail OAuth2 (`gmailOAuth2`, account `valfintechnologies@gmail.com`) → both branches converge on "Check SMS Enabled" (IF) → true branch sends via Twilio; false branch is a silent terminal dead-end. The same email/SMS toggle pattern was applied to Workflows 07, 08, 11, and 12.
- **Owner contact**: `OWNER_EMAIL` / `OWNER_PHONE` (`+18575261499`) configured via `CONFIG`.

---

## 3. Professionalized lead-notification emails (Workflow 04)

The owner email is now a client-ready, branded summary containing:
- Business name (`COMPANY_NAME` from `CONFIG`)
- Lead name, phone, email
- Requested service
- Requested appointment date/time (if provided)
- Lead source
- Submission timestamp (`America/New_York`)
- A clear call-to-action

No raw JSON or developer-style output is exposed to the owner.

---

## 4. Appointment scheduling UX overhaul (Workflow 06)

- Replaced free-text appointment-time entry with **structured scheduling**: a calendar-picker `date` field plus a fixed-slot `dropdown` for time — no free text anywhere in the booking form.
- Time slots: **8:00 AM – 5:00 PM in 30-minute increments**, `America/New_York` by default.
- All scheduling assumptions centralized into a `CONFIG` block:
  - `DEFAULT_TIMEZONE: 'America/New_York'`
  - `BUSINESS_START_HOUR: 8`
  - `BUSINESS_END_HOUR: 17`
  - `APPOINTMENT_INCREMENT_MINUTES: 30`
- Future clients can override business hours, increment, and timezone by editing this one block — no workflow redesign needed.
- **Tested end-to-end in production — confirmed working** (Lead → Booked, Appointment row written, Comm Log entry, Follow-Up + Every Lead Alert unaffected).

---

## 5. Internal reporting converted from SMS to email (Workflows 07, 08, 11, 12)

| Workflow | Old default | New default |
|---|---|---|
| 07 — Pipeline Status Digest | SMS to owner | **Email to owner** (branded summary); SMS built but disabled by default |
| 08 — Weekly Pipeline Report | SMS to owner | **Email to owner** (branded weekly report); SMS built but disabled by default |
| 11 — System Health Monitor | SMS to operator | **Email to operator** (consolidated alert); SMS built but disabled by default |
| 12 — Client ROI Report | SMS to client | **Email to client**, addressed to their own brand name; SMS built but disabled by default |

All four carry professional subject lines, branded HTML formatting, and clean summaries — no raw JSON or developer output. The architecture leaves room for future extensibility (e.g. charts, richer formatting) without redesign, since the email body is assembled in a single Code node per workflow.

---

## 6. Standardized time handling — `America/New_York` everywhere

- Every timestamp across the entire CRM and all workflows now uses Luxon `DateTime` in `America/New_York` (Boston time) — leads, the Communication Log, appointments, reports, created/updated dates, automated workflow-generated events, and email timestamps.
- Replaced hardcoded-offset hacks (`Date.UTC(...)`, `new Date().toISOString()`) with DST-safe Luxon patterns:
  - `DateTime.now().setZone('America/New_York').toISO()`
  - `DateTime.fromObject({...}, { zone: 'America/New_York' })`
- **Workflow 01 (CRM Adapter)**: `Resolve & Build Lead Row` and `Build Log Row` now use a shared `nowET()` helper instead of `new Date().toISOString()`.
- **Workflow 09 (Appointment Reminders)**: 24h/2h reminder-window math is DST-safe via Luxon.
- **Workflow 12 (Client ROI Report)**: 30-day trailing window math is DST-safe via Luxon.
- `DEFAULT_TIMEZONE: 'America/New_York'` is part of every `CONFIG` block, so a future client in a different timezone is a one-line change.

---

## 7. Google Sheets CRM simplified — `Leads` tab: 20 columns → 17

Removed `Lead Score`, `Temperature`, and `Urgency` from the `Leads` tab. The current 17-column schema:

```
Lead ID | Date Created | Source | First Name | Last Name | Phone | Email | Address |
Service Needed | Description | Photos Link | Preferred Time | Status | Last Contact |
Follow-up Count | Assigned To | Notes
```

- `Appointments` and `Communication Log` tabs were reviewed — no AI-related columns existed there, no changes needed beyond the timezone standardization (§6).
- The 5 "reconstructed" tabs (`Quotes`, `Jobs`, `Follow Ups`, `Team Schedule`, `Dashboard`) remain documented proposals with no live workflow dependency — unchanged by this pass, still flagged in `CRM_SHEET_SCHEMA.md` as optional/no-workflow-touches-this.
- **If a live client spreadsheet still has the 3 old columns**, they're now dead/unused and safe to delete (after archiving any historical data worth keeping) — `workflows/01_crm_adapter_google_sheets.json`'s `Resolve & Build Lead Row` node no longer reads or writes them.
- `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` and `docs/CRM_SHEET_SCHEMA.md` were updated to match.

---

## 8. Centralized configuration — `CONFIG` block pattern

A `const CONFIG = {...}` object was added to the top of the relevant Code node in workflows **04, 06, 07, 08, 09, 10, 11, and 12**, replacing scattered hardcoded assumptions:

| Constant | Used in | Default |
|---|---|---|
| `COMPANY_NAME` | 04, 07, 08, 11, 12 | per-client business name |
| `OWNER_EMAIL` / `OWNER_PHONE` | 04, 07, 08, 09, 10, 11 | `valfintechnologies@gmail.com` / `+18575261499` |
| `CLIENT_EMAIL` / `CLIENT_PHONE` | 12 | per-client |
| `TWILIO_FROM_NUMBER` | 04, 07, 08, 09, 10, 11, 12 | `+18889839308` |
| `EMAIL_ALERTS_ENABLED` | 04, 07, 08, 11, 12 | `true` |
| `SMS_ALERTS_ENABLED` | 04, 07, 08, 11, 12 | `false` |
| `DEFAULT_TIMEZONE` | 04, 06, 07, 08, 09, 10, 11, 12 | `'America/New_York'` |
| `BUSINESS_START_HOUR` | 06 | `8` |
| `BUSINESS_END_HOUR` | 06 | `17` |
| `APPOINTMENT_INCREMENT_MINUTES` | 06 | `30` |
| `WINDOW_DAYS` | 12 | `30` |

Cloning to a new client/industry now means editing these constants in 8 Code nodes — no workflow redesign, no hunting for hardcoded values scattered across nodes.

---

## 9. Documentation reconciled

Real content edits (not just banners) were made to the actively-operational/sales docs:
- `README.md`, `docs/CLIENT_DEPLOYMENT_GUIDE.md`, `docs/CRM_SHEET_SCHEMA.md`, `docs/CLIENT_WELCOME_GUIDE_TEMPLATE.md`, `docs/CLIENT_ONBOARDING_INTAKE.md`, `docs/VALFIN_FOUNDER_OPERATING_MANUAL.md`, `docs/ONBOARDING_SOP.md`, `docs/PRICING_PACKAGING.md`, `docs/FOUNDER_CLIENT_LIFECYCLE_PLAYBOOK.md`, `docs/FOUNDER_TRAINING_PLAN.md`, `docs/PROPOSAL_PLAYBOOK.md`, `docs/CASE_STUDY_DATA_PLAN.md`, `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`, `docs/CLIENT_SYSTEM_LESSONS_LEARNED.md`, `docs/DISCOVERY_CALL_WORKBOOK.md`, `docs/phase2_setup.md`.

Historical-snapshot docs (Phase 4-era, not actively used operationally) got a top-of-document V1.1 banner declaring them historical, plus targeted fixes to their most-referenced summary tables and schema blocks:
- `docs/PROJECT_STATUS.md`, `docs/PROJECT_AUDIT.md`, `docs/ROADMAP.md`.

All removed concepts (`Lead Score`, `Temperature`, `Urgency`, "Hot Lead Alert", AI scoring, SMS-only reporting) are either removed outright from active docs or explicitly annotated as historical/superseded with a pointer to this report.

---

## 10. Validation

- All 12 live n8n workflows (`valfin.app.n8n.cloud`) were updated, validated (`validate_workflow`), and published.
- Local JSON exports in `workflows/` were re-synced to match the live, validated workflows.
- `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` was regenerated via `templates/build_crm_template.py` to match the 17-column `Leads` schema.

---

## Quick reference — what to tell a client or new founder

- **No more "Hot/Warm/Cold" or lead scores.** Every lead gets the same fast notification.
- **You'll get an email for every new lead, every digest, every report, and the monthly ROI recap — by default.** SMS is available for any of these on request (it's already built, just toggle it on).
- **Appointment booking now uses a calendar + time-slot picker** — no more typing in a time by hand.
- **Everything is timed to Boston time (`America/New_York`)** unless reconfigured for a client elsewhere.
- **Cloning to a new client/industry** = filling in one `CONFIG` block per workflow (8 workflows total) — see `CLIENT_DEPLOYMENT_GUIDE.md` §3e.
