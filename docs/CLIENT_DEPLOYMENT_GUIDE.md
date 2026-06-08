# Client Deployment & Configuration Guide
_Created 2026-06-07 — companion to PROJECT_STATUS.md / PROJECT_AUDIT.md / ROADMAP.md_

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
| 3 | **Google account + a copy of the CRM Google Sheet template** | Every workflow reads/writes here; tabs must match the schema exactly: `Leads`, `Appointments`, `Quotes`, `Jobs`, `Communication Log`, `Follow Ups`, `Team Schedule`, `Dashboard` (see `docs/phase2_setup.md` §0 for the header-row contract) | Minutes (copy the template sheet, grab its ID from the URL) |
| 4 | **Anthropic API key** (for AI lead scoring + confirmation SMS copy) | Workflow 02 — can reuse a Valfin-managed key across clients if billing/usage is tracked per-workflow | Minutes |
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
| **Owner phone** | `+18575261499` | 04, 06 (set by user), 07, 08 (synced programmatically from 04), 10 (`OWNER_PHONE` constant in `Build Reply Plan`) | Set once in 04's `Build Alert Message`; for 08 and 10, either repeat the "read live value + `update_workflow setNodeParameter`" pattern (see ROADMAP "New-workflow owner-phone setup" decision) or hand-edit each `OWNER_PHONE`/`Build Alert Message` constant |
| **Twilio "from" number** | `+18889839308` | 02, 03, 04, 05, 06, 09 (`FROM` constant in `Build Reminder Batch`), 10 (`FROM` constant in `Build Reply Plan`, and hardcoded `from` in `Send Not Found Reply`) | Find-and-replace across every Twilio node's `from` field and every `FROM`/`from` constant in Code nodes |
| **Company name** | `Valfin Tech` | 02 (`Build Confirmation Request` system prompt), every customer-facing SMS template across 03/05/06/09/10 | Find-and-replace in every hardcoded SMS string and AI system prompt |
| **Google Sheet ID** | `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` | Every `googleSheets` node's `documentId.value` (workflows 01, 05, 06, 07, 08, 09, 10) | Replace in every `documentId: {__rl: true, mode: 'id', value: '...'}` block — easiest done via `update_workflow setNodeParameter` per node, or bulk find-replace on exported JSON before import |

### 3b. Sub-workflow Wiring (must point to the *new* instance's cloned IDs, not Valfin's)

| Value | Current (Valfin) | Appears in | How to change |
|---|---|---|---|
| **CRM Adapter workflow ID** | `wVRHChyFrUNRaH4M` | Called from 02, 03, 05, 06, 10 (anywhere a sub-workflow / "Execute Workflow" reference exists, or anywhere the same Google Sheet is written directly per the adapter contract) | Re-point every "Call CRM Adapter" / sub-workflow-execute node to the new instance's cloned Adapter workflow ID — **do this immediately after importing workflow 01**, before activating any caller workflow |
| **Hot Lead Alert workflow ID** | `KIpMMKM8H5IZB9wb` | Called from 02 | Re-point the sub-workflow-execute node in the cloned 02 to the cloned 04's new ID |

> ⚠️ **Import order matters.** Import and obtain new IDs for 01 (CRM Adapter) and 04 (Hot Lead Alert) *first* — every other workflow that calls them needs their freshly-minted IDs before it can be wired up correctly.

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

### 3e. Business-Rule Constants (confirm these still fit the new client — they're currently Valfin-specific judgment calls, not universal truths)

| Value | Current (Valfin) | Appears in | Confirm with client |
|---|---|---|---|
| Lead score thresholds | Hot 80–100 / Warm 50–79 / Cold 1–49 | Workflow 02 system prompt | Brief-spec default — fine for most home-services businesses, but ask |
| Follow-up cadence | Day 1 / Day 3 / Day 7, stop at 3 attempts | Workflow 05 | Some clients may want more/fewer touches |
| Hot-lead trigger | `temperature === 'Hot' OR urgency === 'Emergency'` | Workflow 02/04 | Universal pattern — unlikely to need changing |
| Booking time slots | 10 fixed hourly slots, 8 AM–5 PM | Workflow 06 form `dropdown` options | **Must match the client's actual service hours** |
| Reminder windows | 24h = 20–28h out, 2h = 1–3h out | Workflow 09 | Tied to the hourly check cadence — fine as-is unless the client wants different lead times |

---

## 4. Deployment Order of Operations

Following this order avoids broken sub-workflow references and half-wired chains:

1. **Set up the Google Sheet** from the template (prerequisite §1.3) — confirm all 8 tabs and header rows match the schema
2. **Create the 3 credentials** in the new n8n instance (§2)
3. **Import workflow 01 (CRM Adapter)** → set its Google Sheets nodes to the new Sheet ID → publish → **note its new workflow ID**
4. **Import workflow 04 (Hot Lead Alert)** → set the owner phone → publish → **note its new workflow ID**
5. **Import workflows 02, 03, 05, 06, 10** (anything that calls 01 or 04) → re-point every CRM Adapter / Hot Lead Alert reference to the IDs from steps 3–4 → set Sheet ID, owner phone, Twilio "from," company name, and customer-facing copy in each → publish
6. **Import workflows 07, 08, 09** → set Sheet ID, owner phone, Twilio "from," schedule timezone offsets → publish
7. **Confirm the lead-intake form URL** (freshly generated on import of 02) and share with the client / embed per §3c
8. **Run the verification checklist** (§5) before telling the client they're live
9. **Resolve Twilio carrier verification** (should already be in progress from §1.2) — do not announce go-live to the client until SMS delivery is confirmed end-to-end with a real send to a real phone

---

## 5. Post-Deploy Verification Checklist

This mirrors the live-testing pattern already proven across workflows 06–10 in this build (`test_workflow` + `get_execution` against real/simulated data). Run each before calling the deployment "done":

- [ ] **01 CRM Adapter**: manually upsert a test lead → confirm a `LEAD-####` row appears with correct columns, and a Communication Log entry is written
- [ ] **02 Form Capture**: submit a test lead through the live form → confirm AI score lands in Sheets, confirmation SMS sends (or queues, if Twilio is still unverified), hot-lead branch fires correctly for a high-urgency test submission
- [ ] **03 Missed-Call Auto-SMS**: simulate a Twilio call-status webhook (no-answer/busy) → confirm the static SMS sends and a Comm Log entry is written **without** creating a Lead record
- [ ] **04 Hot Lead Alert**: confirm the owner receives the instant SMS on a Hot/Emergency test lead
- [ ] **05 Follow-Up Sequence**: manually trigger → confirm Day 1/3/7 thresholds compute correctly against test leads at varying ages, and Booked leads are excluded
- [ ] **06 Appointment Booking**: submit a test booking → confirm the Appointments row writes with structured `date`/`dropdown` values, the customer confirmation SMS renders the friendly date, and the lead status updates to `Booked`
- [ ] **07/08 Pipeline Digest / Weekly Report**: manually trigger → confirm the owner receives a correctly-computed SMS summary
- [ ] **09 Appointment Reminders**: manually trigger against a test appointment inside the 24h or 2h window → confirm the SMS sends and the `Reminder 24h`/`Reminder 2h` flag is written (and that re-running doesn't double-send)
- [ ] **10 Reschedule/Cancel**: use `test_workflow` with pinned inbound-SMS data (see the pattern used for executions 63–68 in this build) to verify all four paths — reschedule-found, cancel-found, not-found, and opt-out-keyword-ignored — before relying on a real inbound text
- [ ] **End-to-end real-world smoke test**: once Twilio is verified, send one real SMS to a real phone through the full chain (intake → confirmation → booking → reminder → reply) and confirm delivery at every hop

---

## 6. Optional Enhancements (Not Required for V1 — See ROADMAP for full list)

These create additional sales value but are **not** blockers to a working V1 deployment:
- Branded, embeddable web intake form (replacing the n8n-hosted form URL) — most visible "polish" upgrade for a client-facing sale
- Client-facing ROI/performance report (distinct from the owner's operational digests) — directly supports recurring-fee justification
- System-health monitoring workflow (alerts the *vendor*, not the client, if a scheduled run fails or a credential expires)
- GoHighLevel CRM migration (the adapter pattern already isolates this swap to one workflow)
- Calendar sync (Google Calendar/Outlook) for field-crew scheduling
- Phase 5 retention workflows (review requests, referral invites, seasonal campaigns)

---

## 7. Known Compliance Considerations (Resolve Before Any Client Goes Live)

- **SMS opt-out keyword handling**: Workflow 10 was patched (2026-06-07) to detect standalone opt-out keywords (`STOP`, `UNSUBSCRIBE`, `QUIT`, etc.) and silently ignore them — never auto-replying, never misclassifying them as an appointment-cancellation request. This is a defense-in-depth backstop; **also verify the client's Twilio number's Advanced Opt-Out / messaging-service settings** in the Twilio console, since carriers may intercept these keywords before they ever reach n8n. Test both paths (a bare "STOP" and a sentence containing "cancel") against the live number before go-live.
- **Toll-free / A2P 10DLC verification**: see §1.2 — this is a hard requirement for reliable delivery to a paying client's customer base, not an optional nicety.
- **Quiet hours / TCPA timing**: this build's schedules assume US Eastern business-appropriate hours (9 AM–6 PM). Confirm the client's timezone and adjust schedule-trigger UTC offsets accordingly — sending automated SMS outside locally-reasonable hours is both poor practice and a potential compliance issue.
