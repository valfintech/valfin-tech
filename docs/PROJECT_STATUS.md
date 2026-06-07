# Project Status
_Last updated: 2026-06-07 — Phase 3 in progress_

## Current Phase
**Phase 3 — Scheduling + Automation** 🔄 **IN PROGRESS**

Phase 2 is complete and verified. Phase 3 has delivered Hot Lead Alerting (04), Automated Follow-Up Sequences (05), Appointment Booking (06, tested end-to-end in production), and Pipeline Status Digest (07). Reporting/Dashboarding is next.

---

## Live Workflows

| Workflow | n8n ID | n8n URL | Status |
|---|---|---|---|
| CRM Adapter (Google Sheets) | `wVRHChyFrUNRaH4M` | https://valfin.app.n8n.cloud/workflow/wVRHChyFrUNRaH4M | ✅ Active — sub-workflow only |
| Form Capture + AI Scoring | `HdJc5cy8cmqMBfGR` | https://valfin.app.n8n.cloud/workflow/HdJc5cy8cmqMBfGR | ✅ Active — 16 nodes, hot lead branch live |
| Missed-Call Auto-SMS | `u9I1bqrLW6V5LtLp` | https://valfin.app.n8n.cloud/workflow/u9I1bqrLW6V5LtLp | ✅ Active — Twilio webhook live |
| Hot Lead Alert | `KIpMMKM8H5IZB9wb` | https://valfin.app.n8n.cloud/workflow/KIpMMKM8H5IZB9wb | ✅ Active — **owner phone setup required** |
| Follow-Up Sequence | `chYfABnQdnPfiHQx` | https://valfin.app.n8n.cloud/workflow/chYfABnQdnPfiHQx | ✅ Active — daily 9 AM ET |
| Appointment Booking | `ax2sMbvv0lqyJHMg` | https://valfin.app.n8n.cloud/workflow/ax2sMbvv0lqyJHMg | ✅ Active — form live, tested end-to-end |
| Pipeline Status Digest | `ehqNYjZRirX5L3sX` | https://valfin.app.n8n.cloud/workflow/ehqNYjZRirX5L3sX | ✅ Active — daily 6 PM ET, **owner phone setup required** |

---

## Verified Architecture

### Business Rules (Current)

| Event | Lead Record | Comm Log | AI Used | Owner Alert |
|---|---|---|---|---|
| Website form — Cold/Warm lead | ✅ Created / updated | ✅ Written | Sonnet 4.6 (score) + Haiku 4.5 (SMS) | ❌ |
| Website form — Hot lead | ✅ Created / updated | ✅ Written | Sonnet 4.6 (score) + Haiku 4.5 (SMS) | ✅ Instant SMS to owner |
| Missed call (no-answer / busy) | ❌ Not created | ✅ Written | None — static SMS | ❌ |
| Follow-up cadence (daily 9 AM) | ✅ Updated | ✅ Written | None — static templates | ❌ |
| Owner books appointment (form) | ✅ Updated → Booked | ✅ Written | None — static SMS | ❌ |
| Daily pipeline digest (6 PM) | — (read only) | — (read only) | None — static aggregation | ✅ SMS digest + Stale/Hot escalation |

---

## Workflow Details

### Workflow 01 — CRM Adapter (`wVRHChyFrUNRaH4M`)

**Flow:**
```
Input → Get Leads → Resolve & Build Lead Row → IF skipLeadCreation?
  true  → Build Log Row → Append Comm Log → Return   (missed call path)
  false → Upsert Lead  → Build Log Row → Append Comm Log → Return   (form / follow-up path)
```

| Property | Value |
|---|---|
| Google Sheet ID (live) | `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` |
| Tabs used | `Leads`, `Communication Log` |
| Lead dedup | By `leadId` first, then phone (digits-only match) |
| Lead ID format | `LEAD-0001` (4-digit, auto-incremented) |
| Log ID format | `LOG-` + timestamp + random suffix |
| Column mapping | `defineBelow` — explicit field-by-field |
| Comm Log date column | `Date / Time` (Google Sheet header — spaces around `/`) |
| Retry | 3× with 2 s delay on all Sheets nodes |
| `skipLeadCreation` trigger | `source === 'Phone' && logSummary === 'Missed call — auto-SMS sent'` |
| Phase 3 patch | `followUpCount` accepted from callers — CRM Adapter now increments Follow-up Count when provided |

---

### Workflow 02 — Form Capture + AI Scoring (`HdJc5cy8cmqMBfGR`)

**Flow (16 nodes):**
```
Website Form ──┐
               ├─→ Normalize Lead → Build Scoring Request → Claude - Score Lead (Sonnet 4.6)
Website Webhook┘         → Parse Score → CRM: Upsert + Log Inbound
                         → Build Confirmation Request → Claude - Confirmation SMS (Haiku 4.5)
                         → Parse Confirmation → Send Confirmation SMS
                         → Mark Outbound Log → CRM: Log Outbound SMS
                         → Prep Alert Data → IF: Hot Lead?
                              Hot / Emergency → Alert: Hot Lead (calls workflow 04)
                              Warm / Cold     → (end)
```

| Property | Value |
|---|---|
| Form URL | `https://valfin.app.n8n.cloud/` (webhookId `04605924-a4ad-44ef-94cf-c829cdc5e8fd`) |
| Webhook URL | `https://valfin.app.n8n.cloud/webhook/roofing-intake` |
| Scoring model | `claude-sonnet-4-6` |
| Score output | `lead_score` (1–100), `temperature` (Hot/Warm/Cold), `urgency`, `detected_service`, `summary`, `recommended_next_step` |
| Confirmation SMS model | `claude-haiku-4-5` |
| Twilio from | `+18889839308` |
| Hot lead threshold | `temperature === 'Hot'` OR `urgency === 'Emergency'` (OR combinator) |
| Phase 3 additions | `Prep Alert Data`, `IF: Hot Lead?`, `Alert: Hot Lead` nodes added at end |

---

### Workflow 03 — Missed-Call Auto-SMS (`u9I1bqrLW6V5LtLp`)

**Flow:**
```
Twilio Call Status (POST /twilio-call-status)
  → Validate Missed Call → Build SMS Request → Send Missed Call SMS
  → Build CRM Log → CRM: Create Lead + Log
```

| Property | Value |
|---|---|
| Webhook URL | `https://valfin.app.n8n.cloud/webhook/twilio-call-status` |
| Triggers on | `CallStatus = no-answer` or `busy` only |
| SMS | Static hardcoded — no Claude |
| SMS text | `"Sorry we missed your call. Please complete our quick roofing request form so we can review your project and contact you promptly: https://roofing.valfin.com/request"` |
| Twilio from | `+18889839308` |
| CRM result | Comm Log entry only — `skipLeadCreation` prevents Lead row creation |

---

### Workflow 04 — Hot Lead Alert (`KIpMMKM8H5IZB9wb`)

**Flow:**
```
Input (executeWorkflowTrigger) → Build Alert Message → Send Owner Alert (Twilio) → Return
```

**Called by:** Workflow 02 `Alert: Hot Lead` node when `temperature === 'Hot'` or `urgency === 'Emergency'`.

| Property | Value |
|---|---|
| SMS format | `🔥 HOT LEAD (Score: 87/100) / John Smith — Roof Replacement / 14 Oak St / Call: 617-555-0142 \| LEAD-0001` |
| Emergency prefix | `🚨 EMERGENCY` instead of `🔥 HOT LEAD` |
| Owner phone | **⚠️ SETUP REQUIRED** — edit `Build Alert Message` node, replace `OWNER_PHONE_HERE` with E.164 number |
| Twilio from | `+18889839308` |

---

### Workflow 05 — Follow-Up Sequence (`chYfABnQdnPfiHQx`)

**Flow:**
```
Daily 9 AM ET → Get All Leads → Filter & Build Messages
  → Loop Over Leads (batch=1)
      → Send Follow-Up SMS → Build CRM Update → CRM: Update Lead + Log → (next)
```

| Property | Value |
|---|---|
| Schedule | Daily at 14:00 UTC (9 AM ET) |
| Qualifying leads | Status `New` or `Contacted`, Follow-up Count < 3, time threshold met |
| Time thresholds | Count 0 → 24h, Count 1 → 72h, Count 2 → 96h |
| Messages | Static templates — Day 1, Day 3, Day 7. Personalized with name + service. |
| Status after count 2 | Set to `Stale` |
| Comm log | Each SMS logged with `logSummary: 'Follow-up N SMS — Day X'` |
| Twilio from | `+18889839308` |
| Data pattern | `Build CRM Update` reads from `Filter & Build Messages` by name (Twilio replaces `$json`) |

> Note: leads with Status `Booked` are automatically excluded. Booking a lead via workflow 06 stops the follow-up sequence with no additional configuration.

---

### Workflow 06 — Appointment Booking (`ax2sMbvv0lqyJHMg`)

**Flow (10 nodes):**
```
Booking Form (owner opens URL)
  → Normalize Booking
  → Get All Leads (executeOnce)
  → Find Lead (runOnceForAllItems — matches by Lead ID)
  → IF: Lead Found?
      true  → Build Booking Payload → Write Appointment → Send Confirmation SMS
             → Build CRM Update → CRM: Book Lead + Log
      false → (stop — form already shows "Submitted")
```

| Property | Value |
|---|---|
| Form URL | `https://valfin.app.n8n.cloud/form/eca6bfbb-ef53-4f82-b909-cbd2b818991a` |
| Form fields | Lead ID (required), Appointment Date (required), Appointment Time (required), Team Member (optional), Notes (optional) |
| Appt ID format | `APT-` + 14-char timestamp (e.g. `APT-20260606143052`) |
| Appointments tab | Direct append — all 15 columns written; Status = `Scheduled` |
| Lead status after booking | `Booked` (via CRM Adapter) |
| Assigned To | Set from Team Member field |
| Customer SMS | Static personalized: `"Hi [Name], your [Service] appointment with Valfin Tech is confirmed for [Date] at [Time]. Questions? Call us anytime."` |
| Twilio from | `+18889839308` |
| Data recovery | `Build CRM Update` reads from `Build Booking Payload` by name (Twilio replaces `$json` after SMS) |
| Invalid Lead ID | Workflow halts at IF node — nothing written |

---

### Workflow 07 — Pipeline Status Digest (`ehqNYjZRirX5L3sX`)

**Flow (4 nodes):**
```
Daily 6 PM ET (scheduleTrigger)
  → Get All Leads (googleSheets — reads Leads tab directly)
  → Build Pipeline Digest (Code, runOnceForAllItems — aggregates + builds SMS text)
  → Send Owner Digest SMS (Twilio)
```

| Property | Value |
|---|---|
| Schedule | Daily at 22:00 UTC (6 PM ET) |
| Reads | `Leads` tab directly (read-only — no writes, no CRM Adapter call needed) |
| Pipeline counts | New / Contacted / Booked / Stale (status tally across all leads) |
| Escalation rule | Status = `Stale` AND Temperature in {`Hot`, `Warm`} → surfaced by name + phone for a personal rescue call (top 3 shown, "+N more" if longer) |
| Daily activity | `newToday` = leads with `Date Created` = today; `bookedToday` = leads with Status `Booked` and `Last Contact` = today |
| Message format | Plain text, no emojis (keeps GSM encoding — fewer SMS segments than Unicode/emoji text) |
| Owner phone | **⚠️ SETUP REQUIRED** — edit `Build Pipeline Digest` node, replace `OWNER_PHONE_HERE` with E.164 number (same number as workflow 04) |
| Twilio from | `+18889839308` |
| Data flow | Single Code node aggregates all leads in one pass (`mode: runOnceForAllItems`) — no loop needed since this only sends one SMS |
| Architecture note | Read-only digest — does not write to Sheets or call the CRM Adapter; safe to run independently of all other workflows |

> Why this workflow: gives the owner daily pipeline visibility without opening Google Sheets, and proactively surfaces Stale-but-still-warm leads that are at risk of being lost — turning passive tracking into an actionable daily prompt.

---

## Credentials (Confirmed Set)

| Credential | Type | Status |
|---|---|---|
| Google Sheets OAuth2 | `googleSheetsOAuth2Api` | ✅ Configured |
| Anthropic API | `httpHeaderAuth` (`x-api-key`) | ✅ Configured |
| Twilio | `twilioApi` | ✅ Configured |

---

## Infrastructure

| Item | Value |
|---|---|
| n8n instance | `valfin.app.n8n.cloud` |
| n8n MCP | Connected and authorized |
| Google Sheet ID (live) | `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` |
| Git repo | `valfintech/valfin-tech` on GitHub, branch `main` |

---

## Known Issues / Setup Required

| Issue | Severity | Action |
|---|---|---|
| Twilio error 30032 — toll-free SMS blocked by carrier | Medium | **User action:** complete toll-free number verification at twilio.com/console. Workflows are correct and functional; this is a carrier-level hold on unverified toll-free numbers. Explicitly treated as a non-blocking external infrastructure item per user direction (2026-06-07). |
| Workflow 04 — `OWNER_PHONE_HERE` placeholder | **High — must be set before 04 fires** | Open workflow `KIpMMKM8H5IZB9wb` in n8n. Edit `Build Alert Message` node. Replace `OWNER_PHONE_HERE` with the owner/rep's E.164 number (e.g. `+16175550100`). |
| Workflow 07 — `OWNER_PHONE_HERE` placeholder | **High — must be set before 07 fires** | Open workflow `ehqNYjZRirX5L3sX` in n8n. Edit `Build Pipeline Digest` node. Replace `OWNER_PHONE_HERE` with the same E.164 number used in workflow 04. |

---

## Phase 3 Progress

| Component | Status | n8n ID |
|---|---|---|
| Hot Lead Alerting | ✅ Live | `KIpMMKM8H5IZB9wb` (04) |
| Automated Follow-Up Sequences | ✅ Live | `chYfABnQdnPfiHQx` (05) |
| Appointment Booking Workflow | ✅ Live — tested end-to-end in production | `ax2sMbvv0lqyJHMg` (06) |
| Pipeline Status Digest | ✅ Live | `ehqNYjZRirX5L3sX` (07) |
| Reporting / Dashboarding | 🔲 Not started | — |

**Next:** Reporting / Dashboarding (08) — weekly summary of new leads, appointments booked, and follow-up activity. Daily pipeline visibility is now covered by workflow 07; workflow 08 would add a longer-horizon (weekly/monthly) trend view, likely via email given the larger payload size.
