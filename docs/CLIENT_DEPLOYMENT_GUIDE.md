# Client Deployment & Configuration Guide
_Created 2026-06-07 — companion to PROJECT_STATUS.md / PROJECT_AUDIT.md / ROADMAP.md_

> **V1.1 (2026-06-11):** AI lead scoring (`Lead Score`/`Temperature`/`Urgency`, Sonnet 4.6) was removed system-wide — workflow 02 no longer scores leads, and there is no "Hot Lead" branch. Workflow 04 ("Hot Lead Alert") was renamed **"Every Lead Alert"** and now fires for every submission. Workflows 04/07/08/11/12/13 each carry a `CONFIG` block (`EMAIL_ALERTS_ENABLED: true`, `SMS_ALERTS_ENABLED: false`, `OWNER_EMAIL`/`OWNER_PHONE` or `CLIENT_EMAIL`/`CLIENT_PHONE`, `DEFAULT_TIMEZONE: 'America/New_York'`) — email is the default delivery channel, SMS is built but off by default and toggled per client via that block. **Workflow 13 (added 2026-06-12)** is the Appointment Reschedule Notifier — see `docs/ROADMAP.md`'s 2026-06-12 entry. Workflow 06's scheduling constants (`BUSINESS_START_HOUR`, `BUSINESS_END_HOUR`, `APPOINTMENT_INCREMENT_MINUTES`) are also centralized in a `CONFIG` block. References below to AI scoring, Hot/Warm/Cold, "Hot Lead Alert," or SMS-only delivery are historical — see `docs/V1_1_RECONCILIATION.md`.

> **This is the technical half of the onboarding sequence.** For the commercial/operational half — pricing, the client-facing questionnaire that collects the values this guide catalogs, and the day-by-day runbook that ties everything together — see `docs/ONBOARDING_SOP.md` (start there), which in turn references `docs/PRICING_PACKAGING.md` and `docs/CLIENT_ONBOARDING_INTAKE.md`. Use this guide for *how* to configure; use those for *how to sell, collect information, and run the engagement*.

## Purpose

This is the guide that turns the system from **"one custom build for Valfin Tech"** into **"a repeatable product we can stand up for client #2, #3, #N."**

Every workflow in `workflows/01`–`10` currently contains values that are specific to *this* deployment — an owner phone number, a Twilio sender number, a Google Sheet ID, a company name, form URLs, sub-workflow ID references. None of that is dynamic or templated. **Deploying for a new roofing company today means manually finding and changing every value below**, in the order given, then re-running the same live-data verification pattern already proven on this build (see §5).

There is no code-architecture reason this couldn't become a one-click template (n8n supports workflow export/import with variable substitution, and a setup wizard could automate most of §3) — but that is future packaging work (see ROADMAP "optional enhancements"). **This guide is what makes manual cloning fast and error-free today**, and it doubles as the spec for an eventual automated installer.

**Estimated time to clone for a new client, following this guide: 2–4 hours** (excluding Twilio number provisioning/verification, which is carrier-side and can take days — start that first, see §1).

---

## 1. Prerequisites Checklist (start these *before* touching n8n — some take days)

| # | Item | Why it's needed | Typical lead time |
|---|---|---|---|
| 1 | **Twilio account + phone number for the new client** (or a Valfin-owned pooled number with the client's name in the "from" identity) | All customer + owner SMS flows through this number | Minutes to provision |
| 2 | **A2P 10DLC registration or toll-free verification for that number** | **This is the #1 go-live blocker.** Carriers silently drop SMS from unverified numbers (this exact project hit error 30032 on the Valfin trial number). Must be resolved *before* any customer-facing SMS goes out. | **Days** — start this first, in parallel with everything else |
| 3 | **Google account + a copy of the CRM Google Sheet template** | Every workflow reads/writes here; tabs must match the schema exactly: `Leads`, `Appointments`, `Quotes`, `Jobs`, `Communication Log`, `Follow Ups`, `Team Schedule`, `Dashboard`. **Use `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx`** — upload to Drive → "Save as Google Sheets" → delete the `EXAMPLE-` rows. See `docs/CRM_SHEET_SCHEMA.md` for the full column-by-column reference (which tabs are live-verified vs. proposed-only) and `docs/phase2_setup.md` §0 for the conversion steps | Minutes (copy the template sheet, grab its ID from the URL) |
| 4 | **Anthropic API key** (for the Haiku 4.5 confirmation SMS copy) | Workflow 02 — can reuse a Valfin-managed key across clients if billing/usage is tracked per-workflow | Minutes |
| 5 | **n8n instance/workspace for the client** (or a dedicated project inside a shared instance) | Hosts the cloned workflows | Minutes |
| 6 | **Client business facts**: legal/brand name, owner's mobile number, service area, business hours, lead-intake form destination (website embed URL or n8n-hosted form link) | Drives every customer-facing message and the form configuration | Provided by client |

> **Start #2 (carrier verification) immediately.** It is the single longest lead-time item and the actual gate on go-live — everything else in this guide can be completed in an afternoon.

---

## 2. Credentials to Create in the New n8n Instance

Exactly mirrors `docs/phase2_setup.md` §1 — create once, all workflows reference these by name:

| Credential name (must match exactly — workflows reference by name) | Type | Notes |
|---|---|---|
| `Google Sheets account` | Google Sheets OAuth2 API | Connect the client's (or Valfin-managed) Google account |
| `Anthropic API` | Header Auth (`x-api-key`) | Anthropic console API key |
| `Twilio account` | Twilio API | The new client's verified Account SID + Auth Token |

---

## 3. Per-Client Configuration Values — Full Catalog

This is the master checklist. **Every row below must be located and changed** in the cloned workflow set. Columns show the live value in *this* deployment (Valfin Tech) so you know what pattern to search for.

### 3a. Identity & Contact Values (appear across many workflows)

| Value | Current (Valfin) | Appears in | How to change |
|---|---|---|---|
| **Owner phone** | `+18575261499` | 04, 06 (set by user), 07, 08 (synced programmatically from 04), 10 (`OWNER_PHONE` constant in `Build Reply Plan`), 11 (`OWNER_PHONE` constant — SMS recipient in `Send Health Alert SMS`), **12 (`OWNER_PHONE` constant — same recipient, reused deliberately rather than minting a new `CLIENT_PHONE` constant, since it's the same person; see the per-client config-sprawl note in ROADMAP)** | Set once in 04's `Build Alert Message`; for 08, 10, 11, and 12, either repeat the "read live value + `update_workflow setNodeParameter`" pattern (see ROADMAP "New-workflow owner-phone setup" decision) or hand-edit each `OWNER_PHONE`/`Build Alert Message` constant |
| **Twilio "from" number** | `+18889839308` | 02, 03, 04, 05, 06, 09 (`FROM` constant in `Build Reminder Batch`), 10 (`FROM` constant in `Build Reply Plan`, and hardcoded `from` in `Send Not Found Reply`), 11 (`TWILIO_FROM_NUMBER` constant), **12 (`TWILIO_FROM_NUMBER` constant)** | Find-and-replace across every Twilio node's `from` field and every `FROM`/`from`/`TWILIO_FROM_NUMBER` constant in Code nodes |
| **Company name** | `Valfin Tech` | 02 (`Build Confirmation Request` system prompt), every customer-facing SMS template across 03/05/06/09/10, **12 (`COMPANY_NAME` constant in `Build ROI Report` — this is the only report that puts the *client's* brand name front-and-center in owner-facing copy, since it's framed as "here's what your system did for [Company]," not an internal operations digest)** (workflow 11's alert is operator-facing only — its copy doesn't need rebranding, but still references "Workflow 09"/"Workflow 05" by number, which will differ in the cloned instance — see note below) | Find-and-replace in every hardcoded SMS string and AI system prompt |
| **Google Sheet ID** | `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` | Every `googleSheets` node's `documentId.value` (workflows 01, 05, 06, 07, 08, 09, 10, 11 — `CRM_SPREADSHEET_ID` constant, both `Get All Appointments` and `Get All Leads (Health Check)` nodes, **12 — `CRM_SPREADSHEET_ID` constant, all three `Get All ... (ROI Report)` read nodes**) | Replace in every `documentId: {__rl: true, mode: 'id', value: '...'}` block — easiest done via `update_workflow setNodeParameter` per node, or bulk find-replace on exported JSON before import |
| **Report window (days)** | `30` | **12 only — `REPORT_WINDOW_DAYS` constant**, used both for the schedule cadence (`daysInterval`) and the trailing-window math in all three `Compute ... Metrics` Code nodes | Deliberately a single named constant in one place — change it once and both the cadence and the metric-window math stay in sync. A different cadence (e.g. bi-weekly) is a one-line change |
| **Monitored-workflow ID references (text only, in alert copy)** | "Workflow 09 (Appointment Reminders)" / "Workflow 05 (Follow-Up Sequence)" — plain text inside `Build Health Report`'s `alertMessage` string | Workflow 11 only | These are human-readable labels in the alert SMS body, not live workflow-ID references — but if the cloned instance renumbers or renames its reminder/follow-up workflows, update the strings in `Build Health Report`'s `jsCode` so the alert still points the operator to the right place |

### 3b. Sub-workflow Wiring (must point to the *new* instance's cloned IDs, not Valfin's)

| Value | Current (Valfin) | Appears in | How to change |
|---|---|---|---|
| **CRM Adapter workflow ID** | `wVRHChyFrUNRaH4M` | Called from 02, 03, 05, 06, 10 (anywhere a sub-workflow / "Execute Workflow" reference exists, or anywhere the same Google Sheet is written directly per the adapter contract) | Re-point every "Call CRM Adapter" / sub-workflow-execute node to the new instance's cloned Adapter workflow ID — **do this immediately after importing workflow 01**, before activating any caller workflow |
| **Every Lead Alert workflow ID** (formerly "Hot Lead Alert") | `KIpMMKM8H5IZB9wb` | Called from 02 for every submission | Re-point the sub-workflow-execute node in the cloned 02 to the cloned 04's new ID |

> ⚠️ **Import order matters.** Import and obtain new IDs for 01 (CRM Adapter) and 04 (Every Lead Alert) *first* — every other workflow that calls them needs their freshly-minted IDs before it can be wired up correctly.

### 3c. Customer-Facing Surfaces

| Value | Current (Valfin) | Appears in | How to change |
|---|---|---|---|
| **Lead-intake form** | n8n-hosted form at `https://valfin.app.n8n.cloud/form/eca6bfbb-...` (workflow 02) + parallel POST webhook | Workflow 02 trigger | Either keep the n8n-hosted form (gets a fresh URL on import — share that with the client) or — **higher-value for a sellable product** — embed the parallel webhook into a branded page on the client's own site (see §6, "Optional Enhancements") |
| **Booking form** | n8n-hosted form at `https://valfin.app.n8n.cloud/form/eca6bfbb-ef53-...` (workflow 06, owner-facing) | Workflow 06 trigger | Owner-facing only — the fresh n8n-generated URL just needs to be bookmarked/shared with the client's office staff |
| **Static SMS copy referencing a URL** (e.g. missed-call auto-SMS: `"...complete our quick roofing request form... https://roofing.valfin.com/request"`) | Workflow 03 `Build SMS Request` | Replace with the new client's actual intake URL |

### 3d. Schedule & Cadence Values (timezone-sensitive — confirm with each client)

| Value | Current (Valfin) | Appears in | Notes |
|---|---|---|---|
| Follow-up sequence | Daily 9 AM ET (`14:00 UTC`) | Workflow 05 | All schedule triggers assume **fixed UTC-5 (no DST)** per the project's documented convention — verify this is acceptable for the client's timezone, or generalize the date-math if the client is outside US Eastern |
| Pipeline digest | Daily 6 PM ET (`22:00 UTC`) | Workflow 07 | Same UTC-offset assumption |
| Weekly report | Monday 8 AM ET (`13:00 UTC`) | Workflow 08 | Same |
| Reminder check | Hourly on the hour | Workflow 09 | Cadence-only, not timezone-sensitive, but the 24h/2h windows (20–28h / 1–3h) assume the same fixed-UTC-5 date math |
| System health check | Daily 16:00 UTC (11 AM EST / 12 PM EDT) | Workflow 11 | Deliberately scheduled *after* both the hourly reminder check and the 14:00 UTC follow-up run, so it never fires on data those checks haven't had a chance to touch yet. If the client is outside US Eastern, or workflows 05/09's schedules change, re-derive this time so it still trails both — see the workflow's own header-comment rationale |
| Client ROI report | Every 30 days, 14:00 UTC (9 AM ET) | Workflow 12 | Deliberately modeled as a fixed `daysInterval: 30` rather than calendar-month boundaries — avoids all days-in-month edge-case math, and "every 30 days" is itself an easy, generic line to explain to any client regardless of industry. The trailing-window math (`REPORT_WINDOW_DAYS`) and the cadence are driven by the same single constant, so they can never drift out of sync |
| Reschedule notification check | Hourly on the hour | Workflow 13 | Cadence-only, not timezone-sensitive — picks up any `Scheduled` row where the owner has checked `Notify Customer = TRUE` and sends the reschedule-confirmation SMS promptly after the owner finishes editing `Appt Date`/`Appt Time` |

### 3e. Business-Rule Constants (confirm these still fit the new client — they're currently Valfin-specific judgment calls, not universal truths)

| Value | Current (Valfin) | Appears in | Confirm with client |
|---|---|---|---|
| Follow-up cadence | Day 1 / Day 3 / Day 7, stop at 3 attempts | Workflow 05 | Some clients may want more/fewer touches |
| Email/SMS alert toggles | `EMAIL_ALERTS_ENABLED: true`, `SMS_ALERTS_ENABLED: false` | `CONFIG` block in workflows 04, 07, 08, 11, 12 | Email is the default for every client; flip `SMS_ALERTS_ENABLED` to `true` per client once their Twilio number is verified |
| Booking time slots | 10 fixed hourly slots, 8 AM–5 PM | Workflow 06 `CONFIG` block (`BUSINESS_START_HOUR`, `BUSINESS_END_HOUR`, `APPOINTMENT_INCREMENT_MINUTES`) and form `dropdown` options | **Must match the client's actual service hours** |
| Reminder windows | 24h = 20–28h out, 2h = 1–3h out | Workflow 09 | Tied to the hourly check cadence — fine as-is unless the client wants different lead times |

---

## 4. Deployment Order of Operations

Following this order avoids broken sub-workflow references and half-wired chains:

1. **Set up the Google Sheet** from the template (prerequisite §1.3) — confirm all 8 tabs and header rows match the schema
2. **Create the 3 credentials** in the new n8n instance (§2)
3. **Import workflow 01 (CRM Adapter)** → set its Google Sheets nodes to the new Sheet ID → publish → **note its new workflow ID**
4. **Import workflow 04 (Every Lead Alert)** → set `OWNER_EMAIL`/`OWNER_PHONE` and confirm `EMAIL_ALERTS_ENABLED: true` / `SMS_ALERTS_ENABLED: false` in its `CONFIG` block → publish → **note its new workflow ID**
5. **Import workflows 02, 03, 05, 06, 10** (anything that calls 01 or 04) → re-point every CRM Adapter / Every Lead Alert reference to the IDs from steps 3–4 → set Sheet ID, owner phone, Twilio "from," company name, and customer-facing copy in each → publish
6. **Import workflows 07, 08, 09, 11, 12** → set Sheet ID, owner email/phone (`CONFIG` block in 07/08/11/12), Twilio "from," schedule timezone offsets → publish (11 also needs its `CRM_SPREADSHEET_ID` pointed at the same Sheet as the rest, and its alert-copy workflow-number references updated if 05/09 are renumbered in the new instance — see §3 above; 12 also needs `COMPANY_NAME`/`CLIENT_EMAIL`/`CLIENT_PHONE` updated to the *client's* brand and contact — this is the one report where those values are client-facing, not just internal scaffolding). **As of 2026-06-08, `workflows/11_system_health_monitor.json` and `workflows/12_client_roi_report.json` exist as real, importable exports** (re-exported live from the production instance, verified as valid JSON, and brought in line with the credential-placeholder convention every other file in `workflows/` already follows) — this step can now actually be carried out end-to-end using only the repo's own assets, closing what had been a silent "the instruction exists but the file it points to doesn't" integrity gap (full story in `ROADMAP.md`'s 2026-06-08 entry)
7. **Confirm the lead-intake form URL** (freshly generated on import of 02) and share with the client / embed per §3c
8. **Run the verification checklist** (§5) before telling the client they're live
9. **Resolve Twilio carrier verification** (should already be in progress from §1.2) — do not announce go-live to the client until SMS delivery is confirmed end-to-end with a real send to a real phone

---

## 5. Post-Deploy Verification Checklist

This mirrors the live-testing pattern already proven across workflows 06–10 in this build (`test_workflow` + `get_execution` against real/simulated data). Run each before calling the deployment "done":

- [ ] **01 CRM Adapter**: manually upsert a test lead → confirm a `LEAD-####` row appears with correct columns, and a Communication Log entry is written
- [ ] **02 Form Capture**: submit a test lead through the live form → confirm the lead lands in Sheets via the CRM Adapter, the confirmation SMS sends (or queues, if Twilio is still unverified), and Every Lead Alert (04) fires for the submission
- [ ] **03 Missed-Call Auto-SMS**: simulate a Twilio call-status webhook (no-answer/busy) → confirm the static SMS sends and a Comm Log entry is written **without** creating a Lead record
- [ ] **04 Every Lead Alert**: confirm the owner receives an email for a test lead submission (and SMS too, if `SMS_ALERTS_ENABLED: true` for this client)
- [ ] **05 Follow-Up Sequence**: manually trigger → confirm Day 1/3/7 thresholds compute correctly against test leads at varying ages, and Booked leads are excluded
- [ ] **06 Appointment Booking**: submit a test booking → confirm the Appointments row writes with structured `date`/`dropdown` values, the customer confirmation SMS renders the friendly date, and the lead status updates to `Booked`
- [ ] **07/08 Pipeline Digest / Weekly Report**: manually trigger → confirm the owner receives a correctly-computed email summary (and SMS, if enabled)
- [ ] **09 Appointment Reminders**: manually trigger against a test appointment inside the 24h or 2h window → confirm the SMS sends and the `Reminder 24h`/`Reminder 2h` flag is written (and that re-running doesn't double-send)
- [ ] **10 Reschedule/Cancel**: use `test_workflow` with pinned inbound-SMS data (see the pattern used for executions 63–68 in this build) to verify all four paths — reschedule-found, cancel-found, not-found, and opt-out-keyword-ignored — before relying on a real inbound text
- [ ] **11 System Health Monitor**: use `test_workflow` with pinned CRM data twice — once with a stale appointment/lead row (confirm the alert SMS fires with a correctly-formatted message) and once with clean data (confirm the chain stops naturally with zero items and **no** SMS sends, per the zero-item-safety design — see executions 75/76 in this build for the reference pattern)
- [ ] **12 Client ROI Report**: use `test_workflow` with pinned Leads/Appointments/Communication-Log data spanning both inside and outside the trailing-window boundary → confirm each `Compute ... Metrics` node counts only in-window rows, `Combine ROI Metrics` produces exactly 3 grouped items, and `Build ROI Report` renders a correctly-worded, correctly-totaled recap addressed to the *client's* brand name (see execution 85 in this build for the reference pattern — `newLeads`/`appointmentsBooked`/`appointmentsKept`/`missedCallsRecovered` all matched hand-computed expectations exactly)
- [ ] **End-to-end real-world smoke test**: once Twilio is verified, send one real SMS to a real phone through the full chain (intake → confirmation → booking → reminder → reply) and confirm delivery at every hop

---

## 6. Optional Enhancements (Not Required for V1 — See ROADMAP for full list)

These create additional sales value but are **not** blockers to a working V1 deployment:
- Branded, embeddable web intake form (replacing the n8n-hosted form URL) — most visible "polish" upgrade for a client-facing sale
- ~~Client-facing ROI/performance report (distinct from the owner's operational digests) — directly supports recurring-fee justification~~ — **done 2026-06-08, converted to email-by-default 2026-06-11 (V1.1).** `12_client_roi_report` (`ocAnTMCh068BxxXz`) is live: every 30 days it emails the client an outcome-framed recap (new leads, missed calls recovered, appointments booked/kept) addressed to their own brand name (SMS built but disabled by default, toggled via `CONFIG`) — explicitly distinct in *purpose* from 07/08 (which are operational pipeline tools for the owner to act on) even though it draws on overlapping CRM data. Designed deliberately in industry-agnostic language (leads/appointments/missed-calls/follow-ups) so the same copy and metric set transfer to HVAC/plumbing/dental/legal clones with only a brand-name swap — see §3 above for its config values and the README/PROJECT_STATUS entries for test results
- ~~System-health monitoring workflow~~ — **done 2026-06-07, converted to email-by-default 2026-06-11 (V1.1).** `11_system_health_monitor` (`U6t0b7M6lN8eA1JO`) is live: a daily check that reads live CRM data freshness and emails the *vendor/operator* (never the client) if a scheduled workflow looks like it silently stopped running (SMS built but disabled by default, toggled via `CONFIG`). See §3 above for its per-client config values and the README/PROJECT_STATUS entries for test results
- GoHighLevel CRM migration (the adapter pattern already isolates this swap to one workflow)
- Calendar sync (Google Calendar/Outlook) for field-crew scheduling
- Phase 5 retention workflows (review requests, referral invites, seasonal campaigns)

---

## 7. Known Compliance Considerations (Resolve Before Any Client Goes Live)

- **SMS opt-out keyword handling**: Workflow 10 was patched (2026-06-07) to detect standalone opt-out keywords (`STOP`, `UNSUBSCRIBE`, `QUIT`, etc.) and silently ignore them — never auto-replying, never misclassifying them as an appointment-cancellation request. This is a defense-in-depth backstop; **also verify the client's Twilio number's Advanced Opt-Out / messaging-service settings** in the Twilio console, since carriers may intercept these keywords before they ever reach n8n. Test both paths (a bare "STOP" and a sentence containing "cancel") against the live number before go-live.
- **Toll-free / A2P 10DLC verification**: see §1.2 — this is a hard requirement for reliable delivery to a paying client's customer base, not an optional nicety.
- **Quiet hours / TCPA timing**: this build's schedules assume US Eastern business-appropriate hours (9 AM–6 PM). Confirm the client's timezone and adjust schedule-trigger UTC offsets accordingly — sending automated SMS outside locally-reasonable hours is both poor practice and a potential compliance issue.
- **Upstream consent collection (the part outside this system's reach)**: the opt-out handling above governs what the system does *after* a customer is already texting it — it cannot create consent that was never collected at intake. **Use `docs/SMS_CONSENT_LANGUAGE_GUIDE.md`** (created 2026-06-07) to confirm the client's actual lead-intake channels (digital forms, paper sheets, phone scripts — mapped from intake question G1) carry proper consent language *before* go-live. A recommendation handed to the client but never implemented on their live forms closes nothing — verify it's actually live, the same way you verify Twilio carrier status, before flipping workflows to active.
