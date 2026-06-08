# CRM Google Sheet — Schema Reference & Template
_Created 2026-06-08 — companion to CLIENT_DEPLOYMENT_GUIDE.md / phase2_setup.md / PROJECT_AUDIT.md_

## Why this document exists

The original project brief stated that a file named **`Roofing_CRM_Google_Sheets.xlsx`** would be present in the project folder, defining the CRM's column schema across 8 tabs: `Leads`, `Appointments`, `Quotes`, `Jobs`, `Communication Log`, `Follow Ups`, `Team Schedule`, `Dashboard`.

**That file was never present.** The earliest project memory (`roofing-phase2-decisions`, 2026-06-05) records this explicitly: _"The brief says `Roofing_CRM_Google_Sheets.xlsx` is in the folder, but the folder was empty at kickoff. Built workflows against the column spec in the brief."_ The brief's *prose description* of the schema apparently existed at the time (whoever wrote the early workflows clearly had it), but the spreadsheet file itself did not — and as of this writing, **no `.xlsx`/`.csv` template, and no standalone written-out copy of that original column spec, exists anywhere in this repository.**

This means: if a future session needed to clone the CRM for a new client (per `CLIENT_DEPLOYMENT_GUIDE.md` §1.3 — _"a copy of the CRM Google Sheet template"_) or simply needed to know what belongs in the `Quotes`/`Jobs`/`Follow Ups`/`Team Schedule`/`Dashboard` tabs, **there was nothing to point to** — only a live spreadsheet (Spreadsheet ID `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ`) that happens to work, plus scattered partial column lists buried in audit docs.

**This document — plus the generated template at `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx`** — closes that gap permanently. It does two distinct things, and is careful never to blur them:

1. **Documents, as verified ground truth**, the exact schema of the three tabs that live workflows actually read/write today (`Leads`, `Appointments`, `Communication Log`) — extracted directly from the live workflow source code, not from memory or reconstruction.
2. **Proposes, as clearly-flagged reconstructions**, reasonable starting schemas for the five tabs that were *named* in the original brief but that **no live workflow has ever touched** (`Quotes`, `Jobs`, `Follow Ups`, `Team Schedule`, `Dashboard`) — so a future session has a documented starting point instead of a blank page and a half-remembered brief.

> **If you are cloning this system for a new client:** use `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` as your starting Google Sheet (upload → "Save as Google Sheets" — see `docs/phase2_setup.md` §0). It already has all 8 tabs, the correct header rows, frozen header panes, and clearly-marked example rows you should delete before go-live.

---

## How the live schema was verified (so this doesn't drift into "memory" itself)

Rather than trust any prior summary (including this project's own memory files, which are explicitly point-in-time and may be stale), the three "live" schemas below were re-extracted directly from the **current production workflow source**:

| Tab | Verified from | How |
|---|---|---|
| `Leads` | `workflows/01_crm_adapter_google_sheets.json` — the adapter's upsert contract | Documented in `docs/PROJECT_AUDIT.md` lines 118–123, cross-checked against the adapter's `Resolve & Build Lead Row` code node |
| `Communication Log` | `workflows/01_crm_adapter_google_sheets.json` — the adapter's `Build Log Row` / `Append Comm Log` nodes | Documented in `docs/PROJECT_AUDIT.md` lines 125–130 |
| `Appointments` | `workflows/06_appointment_booking.json` — the **`Write Appointment`** Google Sheets node's `columns.value` mapping (read directly from the live workflow JSON on 2026-06-08, not from a prior summary) | See exact extraction below |

If you need to re-verify any of these in the future (e.g. before a client clone), the most reliable method is the same one used here: open the relevant workflow's JSON (or call `get_workflow_details` against its live n8n ID) and read the Google Sheets node's `columns.value` mapping directly — that mapping **is** the schema contract; nothing downstream can disagree with it without breaking.

---

## ✅ VERIFIED LIVE — Tab 1: `Leads` (20 columns)

Read and written by **Workflow 01 (CRM Adapter)** — the only workflow permitted to touch Google Sheets directly (see its modular "GoHighLevel swap" contract in `docs/phase2_setup.md` §3). Read by workflows 02, 05, 07, 08, 11.

```
Lead ID | Date Created | Source | First Name | Last Name | Phone | Email | Address |
Service Needed | Description | Photos Link | Preferred Time | Lead Score | Temperature |
Urgency | Status | Last Contact | Follow-up Count | Assigned To | Notes
```

| Column | Notes |
|---|---|
| `Lead ID` | **Match key.** Format `LEAD-####`, minted by the adapter (reads the whole tab, increments the max — see the adapter's documented tiny-duplicate-ID-risk-under-concurrency caveat) |
| `Date Created` | ISO 8601 timestamp, set once at creation, never overwritten |
| `Source` | Free text — e.g. `Website Form`, `Phone (Missed Call)`, `Referral` |
| `Phone` | **Secondary match key** — matched digits-only (normalizes `+1`/formatting away) when no `Lead ID` is supplied |
| `Lead Score` | Integer 1–100, set by AI scoring (workflow 02, Sonnet 4.6). Brief-spec bands: Hot 80–100 / Warm 50–79 / Cold 1–49 |
| `Temperature` | One of `Hot` / `Warm` / `Cold` — drives the hot-lead-alert branch (`temperature === 'Hot' OR urgency === 'Emergency'`) |
| `Status` | One of `New` / `Contacted` / `Booked` / `Stale` / (others as the business defines) — drives follow-up eligibility (workflow 05 qualifies `New`/`Contacted` only) and pipeline reporting (07/08) |
| `Last Contact` | ISO 8601 timestamp or blank — workflow 05's overdue-follow-up math falls back to `Date Created` when blank; **workflow 11 mirrors this exact fallback** |
| `Follow-up Count` | Integer 0–3 — workflow 05 stops sequencing at 3; workflow 11 mirrors this cap |
| `Assigned To` | Free text — staff/crew name, set by booking (workflow 06) or manually |

**Never rename or remove a column here** — virtually every workflow in the system (01, 02, 05, 06, 07, 08, 09, 11) depends on these exact header strings via `mappingMode: 'defineBelow'` / `'autoMapInputData'` Google Sheets configurations.

---

## ✅ VERIFIED LIVE — Tab 2: `Appointments` (15 columns)

Written directly by **Workflow 06 (Appointment Booking)** — append-only, no dedup concern, intentionally bypasses the CRM Adapter (a documented exception to the "Adapter is the only Sheets-toucher" rule, because this tab is a pure log). Read by workflows 09, 10, 11; updated (specific columns only) by workflows 09 and 10.

Extracted verbatim from the live `Write Appointment` node's column mapping (`workflows/06_appointment_booking.json`):

```
Appt ID | Lead ID | Customer Name | Phone | Address | Service Type | Appt Date | Appt Time |
Status | Team Member | Team Approval | Calendar Event ID | Reminder 24h | Reminder 2h | Notes
```

| Column | Notes |
|---|---|
| `Appt ID` | **Match key.** Format `APT-` + 14-digit timestamp (e.g. `APT-20260606143052`), minted at booking time |
| `Customer Name` | Denormalized copy of the lead's name at booking time (not a live join — if the lead's name changes later, this does not update) |
| `Service Type` | Free text, copied from the lead's `Service Needed` at booking time |
| `Appt Date` | **Must be exactly `YYYY-MM-DD`.** Workflow 06's booking form uses a structured `date` field to guarantee this (a 2026-06-07 fix — the original free-text field produced unparseable values like `"Tuesday, June 10"`). Workflows 09 and 11 both parse this with the strict regex `/^(\d{4})-(\d{2})-(\d{2})$/` — anything else is silently skipped (by design — see the parsing-guard verification in `docs/PROJECT_AUDIT.md`) |
| `Appt Time` | **Must be exactly `H:MM AM/PM`** (e.g. `2:00 PM`, `10:00 AM`). Guaranteed by the booking form's fixed-slot `dropdown` field (10 hourly slots, 8 AM–5 PM). Parsed with `/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i` by workflows 09 and 11 |
| `Status` | One of `Scheduled` / `Cancelled` (set by workflow 10 on a cancel reply — reschedules leave it `Scheduled`, staff coordinates manually) |
| `Team Member` | Set from the booking form's optional "Team Member" field |
| `Team Approval` | **Reserved, currently always blank.** Named in the brief; no live workflow reads or writes it. Presumably intended for a future crew-acceptance step |
| `Calendar Event ID` | **Reserved, currently always blank.** Presumably intended for a future Google Calendar / Outlook sync (cataloged as an optional enhancement in `CLIENT_DEPLOYMENT_GUIDE.md` §6) |
| `Reminder 24h` / `Reminder 2h` | **Write-only flag columns**, managed exclusively by workflow 09 (writes an ISO timestamp to whichever flag was just sent, round-trips the other untouched) and read by workflow 11 (treats any non-empty value as "already sent"). Leave blank when seeding new rows — never pre-fill |
| `Notes` | Free text; workflow 10 appends timestamped `[ISO] Customer {action} via SMS reply: "..."` entries here, pipe-separated, preserving prior notes |

---

## ✅ VERIFIED LIVE — Tab 3: `Communication Log` (9 columns)

Written exclusively by **Workflow 01 (CRM Adapter)** on every inbound/outbound touch — append-only audit trail.

```
Log ID | Date / Time | Lead ID | Customer Name | Channel | Direction | Handler | Message Summary | Notes
```

| Column | Notes |
|---|---|
| `Log ID` | Format `LOG-` + timestamp + random suffix |
| **`Date / Time`** | ⚠️ **The header has spaces around the slash** (`Date / Time`, not `Date/Time`). The adapter's internal JSON key is `Date/Time` (no spaces) — its `defineBelow` column mapping explicitly translates between the two. **Do not "fix" the header spacing** — doing so breaks the mapping silently (see `docs/PROJECT_AUDIT.md` line 130's explicit warning, preserved here because it is exactly the kind of one-character trap that survives a brief going missing but doesn't survive a careless re-creation of the sheet) |
| `Lead ID` | Blank for missed-call entries that never created a Lead record (`source: 'Phone'` + `skipLeadCreation: true` routing) |
| `Channel` | e.g. `SMS`, `Phone`, `Form`, `Email` |
| `Direction` | `Inbound` / `Outbound` |
| `Handler` | e.g. `AI (Haiku 4.5)`, `AI (Sonnet 4.6)`, `System`, or a staff name |

---

## ⚠️ RECONSTRUCTED — NOT YET LIVE — Tabs 4–8

**No live workflow currently reads from or writes to any of the five tabs below.** They were named in the original brief as part of the 8-tab spec, and the live spreadsheet (and the generated template) carries them as empty/example-only tabs so the structure matches what the brief promised — but **the column definitions below are reconstructions proposed during this pass, not verified specifications**. Treat them as a documented starting point for future build sessions, not as an existing contract anything depends on.

**Before building a workflow against any of these tabs:** (1) confirm the client actually needs that capability — field-service businesses vary widely in how they track quotes/jobs/crew schedules, and some already use dedicated tools (QuickBooks, Housecall Pro, ServiceTitan) that would make a given tab redundant; (2) once a real schema is implemented and live, **update this document and the template** so the "verified" section above grows and this section shrinks — that is the entire point of writing this down now.

### `Quotes` — proposed schema (11 columns)
```
Quote ID | Lead ID | Customer Name | Date Created | Service Type | Quote Amount | Status |
Valid Until | Sent Via | Notes | Created By
```
Proposed `Status` values: `Draft` / `Sent` / `Accepted` / `Declined` / `Expired`. Would naturally sit between a `Booked` appointment (inspection) and a `Jobs` row (accepted work) in a future quote→job pipeline.

### `Jobs` — proposed schema (13 columns)
```
Job ID | Lead ID | Appt ID | Customer Name | Phone | Address | Service Type | Job Value |
Status | Start Date | Completion Date | Assigned To | Notes
```
Referenced once already, in passing, as a future enhancement: `docs/ROADMAP.md` line 135, "Job completion tracking in `Jobs` tab." This tab would be the natural source for the **"$ recovered"** and **"additional jobs/month"** numbers that `docs/CASE_STUDY_DATA_PLAN.md` (Metrics 3–4) currently must derive manually from `Appointments` + client-reported average job value — wiring this up would directly automate part of that data-collection burden, and would feed a future client-facing ROI report (the other still-open Open Item) with real, system-of-record numbers instead of estimates.

### `Follow Ups` — proposed schema (9 columns)
```
Follow-up ID | Lead ID | Customer Name | Sequence Day | Date Sent | Channel |
Message Summary | Response Received | Notes
```
**Important distinction:** the live Follow-Up Sequence workflow (05) does **not** write to a tab by this name — it tracks progress via a single `Follow-up Count` integer column on `Leads`, plus per-touch entries already landing in `Communication Log`. This proposed tab would be a more granular *per-touch* audit/reporting view (useful for e.g. A/B-testing sequence copy or computing response rates per touch) layered on top of — not replacing — the existing mechanism. **`Follow-up Count` + `Communication Log` remain the system of record** until/unless this is built.

### `Team Schedule` — proposed schema (5 columns)
```
Date | Team Member | Shift / Availability | Assigned Jobs | Notes
```
No live crew-scheduling or calendar-sync workflow exists yet (calendar sync is cataloged as a Phase-5+ optional enhancement in `CLIENT_DEPLOYMENT_GUIDE.md` §6, and `Appointments.Calendar Event ID` is reserved for it). This is the thinnest of the five reconstructions — deliberately so, since the right shape depends heavily on whether a given client already uses a dedicated crew-scheduling tool.

### `Dashboard` — **not a data tab; a formula/summary view**
```
Metric | Value | Notes
```
Unlike the other seven tabs, `Dashboard` was never meant to hold rows of records — it's a summary view driven by formulas (`COUNTIFS`/`SUMIFS`) referencing the other tabs. No workflow reads or writes it; the system instead delivers owner-facing reporting via SMS digests (workflows 07, 08) and, as of 2026-06-07, Workflow 11's health alerts. The generated template seeds this tab with placeholder metric labels and starting-point formula suggestions in the Notes column (e.g. "Stale Leads" mirrors workflow 07's own staleness definition — **keep any live formula here in sync with that workflow's definition**, so the Dashboard never contradicts the SMS digest the owner already trusts).

---

## The template file

**`templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx`** (generated 2026-06-08, build script alongside it at `templates/build_crm_template.py` for reproducibility/future edits) contains all 8 tabs with:
- Exact header rows matching the verified-live schemas for `Leads`, `Appointments`, `Communication Log`
- Proposed header rows (clearly marked `⚠️ RECONSTRUCTED — NOT YET LIVE`) for the other five tabs
- Bold, frozen header rows
- 1–2 example rows per tab, prefixed `EXAMPLE-` and explicitly described as such — **delete these before using the sheet for a real client**
- An in-sheet note (final row of each tab) restating the verified/reconstructed status and any tab-specific gotchas (e.g. the `Date / Time` spacing trap)

**To use it for a new client clone** (per `CLIENT_DEPLOYMENT_GUIDE.md` §1.3 / §4 step 1):
1. Upload `Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` to the client's Google Drive
2. **File → Save as Google Sheets**
3. Delete the `EXAMPLE-` rows from every tab
4. Grab the new Spreadsheet ID from the URL and proceed through `CLIENT_DEPLOYMENT_GUIDE.md` §4

---

## Summary — what was missing, and what now exists

| Was missing | Now exists |
|---|---|
| `Roofing_CRM_Google_Sheets.xlsx` referenced by the brief, never present in the repo | `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` — a complete, ready-to-clone 8-tab template (regeneratable via `templates/build_crm_template.py`) |
| No written-out copy of the full original column spec anywhere in the repo | This document — the exact live schema for the 3 active tabs (re-verified from current workflow source, not from memory), plus clearly-flagged proposed schemas for the 5 inactive tabs |
| No way to know which of the 8 brief-named tabs are actually load-bearing vs. aspirational | The verified/reconstructed split above — `Leads`, `Appointments`, `Communication Log` are load-bearing; `Quotes`, `Jobs`, `Follow Ups`, `Team Schedule`, `Dashboard` are currently inert placeholders worth building toward, not against |
