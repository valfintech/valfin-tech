# Project Status
_Last updated: 2026-06-07 — Phase 4 complete (Workflows 09 & 10 live)_

## Current Phase
**Phase 4 — Reminders / Reschedule / Cancel** ✅ **Complete — both workflows (09, 10) live and tested**

Phase 3 is complete (all 5 components live and tested). Phase 4 is now complete: Workflow 09 (Appointment Reminders) sends 24h/2h pre-appointment SMS, and Workflow 10 (Reschedule/Cancel) handles inbound customer replies — classifying "reschedule" vs. "cancel" by keyword, locating the customer's appointment by phone, updating the Appointments sheet (status + audit-trail notes), replying to the customer, and alerting the owner so staff can close the loop by phone. As a prerequisite, Workflow 06's Booking Form was upgraded from free-text date/time fields to structured `date` + `dropdown` fields so appointment times are machine-parseable — the customer-facing confirmation SMS still renders a friendly display string (e.g. "Tuesday, June 10"). Owner phone numbers remain configured and synced across all SMS-sending workflows (`+18575261499`). Phase 4 has zero open setup items — workflow 10's inbound trigger uses the existing Twilio credential natively, requiring no manual webhook configuration. Next up: Phase 5 (Retention).

---

## Live Workflows

| Workflow | n8n ID | n8n URL | Status |
|---|---|---|---|
| CRM Adapter (Google Sheets) | `wVRHChyFrUNRaH4M` | https://valfin.app.n8n.cloud/workflow/wVRHChyFrUNRaH4M | ✅ Active — sub-workflow only |
| Form Capture + AI Scoring | `HdJc5cy8cmqMBfGR` | https://valfin.app.n8n.cloud/workflow/HdJc5cy8cmqMBfGR | ✅ Active — 16 nodes, hot lead branch live |
| Missed-Call Auto-SMS | `u9I1bqrLW6V5LtLp` | https://valfin.app.n8n.cloud/workflow/u9I1bqrLW6V5LtLp | ✅ Active — Twilio webhook live |
| Hot Lead Alert | `KIpMMKM8H5IZB9wb` | https://valfin.app.n8n.cloud/workflow/KIpMMKM8H5IZB9wb | ✅ Active — owner phone set (`+18575261499`) |
| Follow-Up Sequence | `chYfABnQdnPfiHQx` | https://valfin.app.n8n.cloud/workflow/chYfABnQdnPfiHQx | ✅ Active — daily 9 AM ET |
| Appointment Booking | `ax2sMbvv0lqyJHMg` | https://valfin.app.n8n.cloud/workflow/ax2sMbvv0lqyJHMg | ✅ Active — form live, tested end-to-end; **form fields upgraded to structured date/dropdown (2026-06-07)** |
| Pipeline Status Digest | `ehqNYjZRirX5L3sX` | https://valfin.app.n8n.cloud/workflow/ehqNYjZRirX5L3sX | ✅ Active — daily 6 PM ET, owner phone set |
| Weekly Pipeline Report | `Y7ruzhYGMhE001fr` | https://valfin.app.n8n.cloud/workflow/Y7ruzhYGMhE001fr | ✅ Active — Monday 8 AM ET, owner phone set, **tested live (execution 54)** |
| Appointment Reminders | `bJcO5ox2u190bxTr` | https://valfin.app.n8n.cloud/workflow/bJcO5ox2u190bxTr | ✅ Active — hourly check, 24h/2h SMS, **tested live (execution 55)** |
| Reschedule / Cancel | `Bj5b3sUexa8EeQcK` | https://valfin.app.n8n.cloud/workflow/Bj5b3sUexa8EeQcK | ✅ Active — inbound SMS via Twilio Trigger, **tested live (executions 63/64/65)** |
| System Health Monitor | `U6t0b7M6lN8eA1JO` | https://valfin.app.n8n.cloud/workflow/U6t0b7M6lN8eA1JO | ✅ Active — daily 16:00 UTC, alerts owner/operator (not client) on stale appointment-reminder/follow-up data, **tested live (executions 75/76 — both alert-firing and clean-pass paths confirmed)** |
| Client ROI Report | `ocAnTMCh068BxxXz` | https://valfin.app.n8n.cloud/workflow/ocAnTMCh068BxxXz | ✅ Active — every 30 days at 14:00 UTC, texts the *client* (addressed to their brand name) an outcome-framed recap of leads/appointments/missed-call recoveries, **tested live (execution 85 — all 5 computed metrics matched hand-verified expectations exactly)** |

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
| Weekly pipeline report (Mon 8 AM) | — (read only) | — (read only) | None — static aggregation | ✅ SMS report — new leads, bookings, sources, ratio |

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
| Form fields | Lead ID (text, required), **Appointment Date (`date` field — YYYY-MM-DD, required)**, **Appointment Time (`dropdown` — fixed hourly slots 8 AM–5 PM, required)**, Team Member (text, optional), Notes (textarea, optional) |
| Appt ID format | `APT-` + 14-char timestamp (e.g. `APT-20260606143052`) |
| Appointments tab | Direct append — all 15 columns written; Status = `Scheduled`; `Appt Date` stored as raw `YYYY-MM-DD`, `Appt Time` stored as `H:MM AM/PM` — both machine-parseable for workflow 09 |
| Lead status after booking | `Booked` (via CRM Adapter) |
| Assigned To | Set from Team Member field |
| Customer SMS | Static personalized, with friendly display date computed from the structured value: `"Hi [Name], your [Service] appointment with Valfin Tech is confirmed for [Weekday, Month Day] at [Time]. Questions? Call us anytime."` |
| Twilio from | `+18889839308` |
| Data recovery | `Build CRM Update` reads from `Build Booking Payload` by name (Twilio replaces `$json` after SMS) |
| Invalid Lead ID | Workflow halts at IF node — nothing written |
| **2026-06-07 architectural fix** | Form fields were originally free-text (placeholders "e.g. Tuesday, June 10" / "e.g. 2:00 PM"), which produced unparseable strings that blocked reliable reminder-time computation. Patched to structured `date`/`dropdown` field types — a prerequisite for workflow 09 — while `Build Booking Payload` now derives a friendly display string (`formatFriendlyDate()`) for the customer SMS so the user experience is unchanged. Republished; live and tested (execution 55 confirms the new pipeline runs end-to-end). |

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

### Workflow 08 — Weekly Pipeline Report (`Y7ruzhYGMhE001fr`)

**Flow (4 nodes):**
```
Weekly Monday 8 AM ET (scheduleTrigger)
  → Get All Leads (googleSheets — reads Leads tab directly)
  → Build Weekly Report (Code, runOnceForAllItems — aggregates trailing 7-day window + builds SMS text)
  → Send Owner Weekly Report SMS (Twilio)
```

| Property | Value |
|---|---|
| Schedule | Weekly, Monday at 13:00 UTC (8 AM ET) |
| Reads | `Leads` tab directly (read-only, same precedent as workflows 05 and 07) |
| Window | Trailing 7 days — `Date Created` for new-lead metrics, `Last Contact` for status-change metrics (Booked/Stale) |
| Metrics reported | New leads (+ Hot/Emergency breakdown), Booked count, Stale count, Bookings/New ratio (%), top 2 lead sources |
| Bookings/New ratio | **Approximation, not true cohort conversion** — compares leads booked-this-week against leads created-this-week, two overlapping but distinct populations (a lead created 3 weeks ago could be booked this week). Documented as a trend indicator, not a precise funnel metric. |
| Owner phone | `+18575261499` — synced directly from workflow 04's `Build Alert Message` via `update_workflow` (no placeholder, no manual step needed) |
| Twilio from | `+18889839308` |
| Message format | Plain text, no emojis (GSM-7 encoding) — confirmed 2 SMS segments in test execution |
| **Tested live** | Execution `54` (manual run, 2026-06-07): 7 new leads, 0 Hot/Emergency, 1 booked, 0 stale, 14% ratio, top sources `Phone 3, Unknown 2` — SMS queued successfully to `+18575261499` |
| Architecture note | Read-only — no Sheets writes, no CRM Adapter calls; fully independent of all other workflows |

> Why this workflow: completes the visibility stack — workflow 07 gives daily snapshots, workflow 08 gives the weekly trend view (volume, source mix, booking activity) the owner needs to judge whether marketing/ops adjustments are working.

---

### Workflow 09 — Appointment Reminders (`bJcO5ox2u190bxTr`)

**Flow (6 nodes):**
```
Hourly Reminder Check (scheduleTrigger, every hour on the hour)
  → Get All Appointments (googleSheets — reads Appointments tab)
  → Build Reminder Batch (Code, runOnceForAllItems — parses Appt Date/Time,
     computes hoursUntil per appointment, emits one item per reminder due)
  → Loop Over Reminders (splitInBatches, batchSize 1)
      → Send Reminder SMS (Twilio, personalized per appointment)
      → Mark Reminder Sent (googleSheets update — writes Reminder 24h/2h timestamp,
         matched by Appt ID; preserves the other flag's existing value)
      → nextBatch (loop continues)
```

| Property | Value |
|---|---|
| Schedule | Hourly, on the hour (`hoursInterval: 1`, `triggerAtMinute: 0`) |
| Reads | `Appointments` tab directly (read-only fetch; writes are scoped to the two reminder-flag columns only) |
| Eligibility filter | `Status === 'Scheduled'` AND `Appt Date`/`Appt Time` parse successfully AND appointment is in the future |
| 24h window | `hoursUntil` between 20–28, AND `Reminder 24h` flag empty |
| 2h window | `hoursUntil` between 1–3, AND `Reminder 2h` flag empty |
| Idempotency | `Reminder 24h` / `Reminder 2h` columns written with an ISO timestamp on send — checked on every run to prevent duplicate SMS to the same customer |
| Date/time parsing | `parseApptDateTime()` expects `Appt Date` = `YYYY-MM-DD`, `Appt Time` = `H:MM AM/PM`; ET treated as fixed UTC-5 (matches workflows 05/07/08 convention) |
| Friendly display | `formatFriendlyDate()` renders `Weekday, Month Day` (e.g. "Tuesday, June 10") for the SMS body from the stored `YYYY-MM-DD` |
| Customer SMS (24h) | `"Hi [Name], reminder — your [Service] appointment with Valfin Tech is tomorrow, [Weekday, Month Day] at [Time]. Need to reschedule? Call us anytime."` |
| Customer SMS (2h) | `"Hi [Name], your [Service] appointment with Valfin Tech is today at [Time] — about 2 hours from now. See you soon!"` |
| Twilio from | `+18889839308` |
| Sheet write safety | `Mark Reminder Sent` always writes both `Reminder 24h` and `Reminder 2h` columns, but conditionally — the column matching the just-sent reminder type gets the new timestamp, the other column is passed through unchanged from its existing value (prevents accidental overwrites) |
| **Prerequisite fix** | Workflow 06's Booking Form was upgraded from free-text date/time to structured `date`/`dropdown` fields (see Workflow 06 section, "2026-06-07 architectural fix") — required for `Appt Date`/`Appt Time` to be reliably parseable |
| **Tested live** | Execution `55` (manual run, 2026-06-07): read the live Appointments tab (1 row — a legacy test booking with pre-fix free-text values `"Friday"`/`"14:00"`), `parseApptDateTime()` correctly recognized this as unparseable and safely skipped it, `Build Reminder Batch` emitted 0 items, the loop correctly no-op'd on empty input. Confirms the parsing guard, eligibility filter, and zero-item safety all work correctly against live production data — new structured bookings (post-fix) will flow through the full send+mark pipeline. |
| Architecture note | Read + scoped-write only; calls no other workflow; designed to run independently and safely alongside all other workflows |

> Why this workflow: reduces no-shows (the single biggest drag on appointment-completion rate and technician utilization) by reaching customers twice — a day-before nudge that catches early cancellations/reschedules, and a same-day nudge that maximizes show-up rate. Both messages invite a reschedule call, setting up workflow 10's inbound-keyword flow.

---

### Workflow 10 — Reschedule / Cancel (`Bj5b3sUexa8EeQcK`)

**Flow (11 nodes):**
```
Inbound SMS Trigger (twilioTrigger — com.twilio.messaging.inbound-message.received)
  → Normalize Inbound SMS (Code — extracts From/Body, classifies intent: reschedule | cancel | other)
  → Is Reschedule or Cancel? (IF — gates out irrelevant texts; "other" silently ends, no reply)
      true → Get All Appointments (googleSheets — reads Appointments tab)
        → Find Customer Appointment (Code — matches phone to a Status='Scheduled' row,
           sorted nearest-upcoming-first; outputs found:true/false)
        → Appointment Found? (IF)
            true  → Build Reply Plan (Code — branches on intent: builds customer reply,
                     owner alert, new Status, timestamped Notes append)
                     → Update Appointment Row (googleSheets update — Status + Notes, matched by Appt ID)
                     → Send Customer Reply SMS (Twilio)
                     → Notify Owner of Inbound Request (Twilio — full context for staff follow-up)
            false → Send Not Found Reply (Twilio — generic "couldn't find an appointment" message)
```

| Property | Value |
|---|---|
| Trigger | `n8n-nodes-base.twilioTrigger`, `updates: ['com.twilio.messaging.inbound-message.received']` — native Twilio event subscription via the existing `twilioApi` credential. **No manual Twilio-console webhook URL configuration required** (unlike a generic webhook node). |
| Intent classification | Keyword regex (no AI): `cancel\|cancelled\|can't make it\|won't be able` → `cancel`; `reschedule\|resched\|change\|move\|different time\|new time\|push back` → `reschedule`; anything else (or unparseable phone, or a standalone SMS opt-out keyword) → `other` (ignored, no reply sent — avoids noise on "thanks"/"ok"/spam) |
| **Compliance fix (2026-06-07)** | `Normalize Inbound SMS` detects standalone opt-out keywords (`STOP`, `UNSUBSCRIBE`, `QUIT`, `END`, `CANCEL ALL`, etc. — matched only when they constitute the *entire* message) and routes them to `intent: 'other'`, guaranteeing **zero auto-reply** to a likely opt-out text. This is a defense-in-depth backstop alongside Twilio's carrier-level Advanced Opt-Out handling, and removes a real TCPA/compliance risk that existed in the original `cancel\|...\|stop\|...` regex (which would have misread a bare "STOP" as "cancel my appointment" and replied — the opposite of compliant behavior). Verified live: bare `"STOP"` → `intent: 'other'`, no reply (execution 67); `"please cancel my roofing appointment, something came up"` → `intent: 'cancel'`, full flow runs correctly (execution 68) — confirming the word "cancel" inside a real sentence is still handled as an appointment request. |
| Appointment matching | Normalizes both inbound and sheet phone numbers to 10 digits, filters to `Status === 'Scheduled'`, sorts by `Appt Date`/`Appt Time` ascending, picks the nearest upcoming match |
| Cancel outcome | `Status` → `Cancelled` (automatically removes the appointment from future reminder/digest sweeps); customer gets a confirmation + rebooking invite; owner gets an alert to follow up and refill the slot |
| Reschedule outcome | `Status` stays `Scheduled` (staff coordinates the new time directly — avoids fragile SMS slot-negotiation); customer gets an acknowledgment + callback promise; owner gets full context to call back |
| Audit trail | Every request appends a `[ISO-timestamp] Customer {cancelled\|requested reschedule} via SMS reply: "<original message>"` entry to the `Notes` column (existing notes preserved, pipe-separated) |
| Not-found handling | Generic "couldn't find an appointment under this number, please call us" reply — no false matches, no dead-ends |
| Owner alert | Full context SMS to `+18575261499`: customer name/phone, appointment ID/date/time/service, and the requested action — enables an immediate callback |
| Twilio from | `+18889839308` |
| **Tested live** | Simulated inbound SMS via pinned trigger data against the live Appointments row (`APT-20260607144823`, phone `+18575261499`) — three executions, all successful: **(63)** reschedule intent → appointment found → customer reply + owner alert + Notes appended + Status preserved; **(64)** cancel intent on the same row → Status → `Cancelled`, cancellation+rebooking reply, owner alert; **(65)** unmatched phone number → graceful not-found reply with zero false matches. All three branches of the routing logic confirmed correct against live production data shapes. |
| Architecture note | Single linear path with two IF gates (relevance, then found/not-found) — branching logic for cancel-vs-reschedule lives inside `Build Reply Plan` (mirrors the established pattern of keeping conditional logic inside Code nodes when it's a simple discriminator switch, avoiding extra branch+merge complexity) |

> Why this workflow: closes the loop that workflow 09 opens — every reminder invites a reschedule call, and now a text reply gets an instant, reassuring response *and* puts the request directly in front of the owner for same-day action. This protects the appointment-completion rate (cancellations get surfaced immediately for rebooking instead of silently becoming no-shows) and keeps the Appointments sheet accurate (cancelled slots stop generating reminders automatically).

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
| Twilio error 30032 — toll-free SMS blocked by carrier | Medium | **User action:** complete toll-free number verification at twilio.com/console. Workflows are correct and functional; this is a carrier-level hold on unverified toll-free numbers. Explicitly treated as a non-blocking external infrastructure item per user direction (2026-06-07) — Twilio account remains intentionally on trial/unverified status. |

> All `OWNER_PHONE_HERE` placeholders are now resolved. Owner phone `+18575261499` is live and confirmed working in workflows 04, 07, and 08 (set by user in 04/07; synced programmatically into 08 via `update_workflow`).

---

## Phase 3 Progress — ✅ COMPLETE (5/5)

| Component | Status | n8n ID |
|---|---|---|
| Hot Lead Alerting | ✅ Live — owner phone set | `KIpMMKM8H5IZB9wb` (04) |
| Automated Follow-Up Sequences | ✅ Live | `chYfABnQdnPfiHQx` (05) |
| Appointment Booking Workflow | ✅ Live — tested end-to-end in production | `ax2sMbvv0lqyJHMg` (06) |
| Pipeline Status Digest | ✅ Live — owner phone set | `ehqNYjZRirX5L3sX` (07) |
| Weekly Pipeline Report | ✅ Live — owner phone set, tested live (execution 54) | `Y7ruzhYGMhE001fr` (08) |

**Phase 3 is complete.** All five planned components are published, active, and (where applicable) tested against live data.

---

## Phase 4 Progress — ✅ COMPLETE (2/2)

| Component | Status | n8n ID |
|---|---|---|
| Appointment Reminders (24h + 2h SMS) | ✅ Live — tested live (execution 55), idempotent via sheet flags | `bJcO5ox2u190bxTr` (09) |
| Reschedule / Cancel (inbound SMS keyword routing) | ✅ Live — tested live (executions 63/64/65), zero manual setup | `Bj5b3sUexa8EeQcK` (10) |

**Phase 4 is complete.** Both planned components are published, active, and tested against live data/data shapes. Zero open setup items — workflow 10's native Twilio Trigger required no manual webhook configuration. **Next: Phase 5 (Retention)** — post-job review requests, referral invites, seasonal outreach.
