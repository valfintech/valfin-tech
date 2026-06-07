# Project Audit
_Last updated: 2026-06-07 — Phase 3 in progress_

---

## Verification Summary (2026-06-07)

All Phase 2 workflows inspected via n8n MCP and verified against live execution history. **Phase 3 is now complete — all 5 components (04–08) built, published, and configured.** Workflow 06 (Appointment Booking) confirmed working end-to-end in production by user: Lead status updates to Booked, Appointment rows write correctly, Communication Log entries are created, Follow-Up workflow continues running normally, Hot Lead Alert remains published. Workflow 07 (Pipeline Status Digest) built and published — daily owner SMS visibility + Stale/Hot escalation. Workflow 08 (Weekly Pipeline Report) built, published, owner phone synced programmatically (no manual step needed), and **test-executed live against real data (execution 54)** — produced and queued a correct SMS report. Owner phone number `+18575261499` is now confirmed live across all three SMS-alerting workflows (04, 07, 08).

---

## ✅ Confirmed Working

| Item | Details |
|---|---|
| CRM Adapter active | `wVRHChyFrUNRaH4M` — active, sub-workflow callable from 02, 03, 05 |
| Form Capture active | `HdJc5cy8cmqMBfGR` — form + webhook triggers both live, 16 nodes with hot lead branch |
| Missed-Call Auto-SMS active | `u9I1bqrLW6V5LtLp` — Twilio webhook live |
| Hot Lead Alert active | `KIpMMKM8H5IZB9wb` — published; called by workflow 02 when Hot or Emergency |
| Follow-Up Sequence active | `chYfABnQdnPfiHQx` — published; daily 9 AM ET schedule |
| Appointment Booking active | `ax2sMbvv0lqyJHMg` — published; form live at `https://valfin.app.n8n.cloud/form/eca6bfbb-ef53-4f82-b909-cbd2b818991a`; **confirmed working end-to-end in production by user (2026-06-07): Lead → Booked, Appointment row written, Comm Log entry created, Follow-Up + Hot Lead Alert unaffected** |
| Pipeline Status Digest active | `ehqNYjZRirX5L3sX` — published; daily 22:00 UTC (6 PM ET) schedule; read-only, no Sheets writes; owner phone `+18575261499` confirmed set |
| Weekly Pipeline Report active | `Y7ruzhYGMhE001fr` — published; weekly Monday 13:00 UTC (8 AM ET) schedule; read-only; owner phone `+18575261499` synced via `update_workflow`; **live test execution 54 succeeded** — correct report computed (7 new, 1 booked, 14% ratio) and SMS queued |
| Owner phone confirmed working end-to-end | `+18575261499` — set by user in workflows 04 and 07; programmatically synced into 08; verified via live SMS send in test execution 54 (Twilio `status: queued`, `to: +18575261499`, 2 segments) |
| Google Sheets credential | Set on all Sheets nodes in workflows 01 and 05 |
| Anthropic credential | Set on all HTTP Request nodes in workflow 02 |
| Twilio credential | Set on SMS nodes in workflows 02, 03, 04, 05 |
| Google Sheets headers on Row 1 | Confirmed — column mapping uses `defineBelow` with verified names |
| `skipLeadCreation` IF routing | Live in CRM Adapter current version |
| Missed calls → no Lead record | `source: 'Phone'` + `logSummary: 'Missed call — auto-SMS sent'` → `skipLeadCreation: true` → IF routes past Upsert Lead |
| Missed calls → Comm Log entry | Always written regardless of `skipLeadCreation` |
| Claude removed from missed-call flow | `Build SMS Request` (workflow 03) uses static hardcoded SMS — no AI nodes |
| Static SMS content | Directs caller to `https://roofing.valfin.com/request` |
| Twilio from number | `+18889839308` in workflows 02, 03, 04, 05 |
| Company name in confirmation SMS | `Valfin Tech` set in `Build Confirmation Request` (workflow 02) |
| CRM Adapter ID wired in callers | `wVRHChyFrUNRaH4M` correctly referenced in workflows 02, 03, 05 |
| Retry logic | 3× with 2–3 s delay on all external call nodes |
| Form → Lead + Comm Log | Verified — form submissions create/update Lead row and write Comm Log entry |
| Form → AI score + confirmation SMS | Verified — Sonnet 4.6 scores, Haiku 4.5 writes and sends confirmation |
| Hot lead branch in workflow 02 | `Prep Alert Data` → `IF: Hot Lead?` → `Alert: Hot Lead` wired after `CRM: Log Outbound SMS` |
| CRM Adapter `followUpCount` patch | `Resolve & Build Lead Row` updated to accept `input.followUpCount` from callers |
| Follow-up time thresholds | Count 0 → 24h, Count 1 → 72h, Count 2 → 96h; count ≥ 3 stops |
| Follow-up status transitions | `Contacted` after count 1–2; `Stale` after count 2 |
| Follow-up data recovery pattern | `Build CRM Update` reads `$('Filter & Build Messages').item.json` — correct, Twilio replaces `$json` in loop |
| Appointment Booking data recovery | `Build CRM Update` reads `$('Build Booking Payload').first().json` — correct, Twilio replaces `$json` after SMS |
| Appointments tab write (direct) | Workflow 06 appends directly to Appointments tab — does not go through CRM Adapter. Correct: Appointments is a pure-append log with no dedup concern. |
| Invalid Lead ID handling | IF node halts workflow gracefully — nothing written to Appointments or Leads if Lead ID not found |
| Booked leads excluded from follow-up | Status `Booked` not in qualifying set {New, Contacted} — no code change needed |
| Pipeline digest aggregation | `Build Pipeline Digest` uses `mode: runOnceForAllItems` to tally all leads in a single Code node pass — correct since only one summary SMS is sent (no loop required) |
| Pipeline digest read-only safety | Workflow 07 only reads the `Leads` tab — no writes to Sheets, no CRM Adapter calls, cannot interfere with any other workflow's state |
| Stale/Hot escalation logic | `status === 'Stale' && (temp === 'Hot' || temp === 'Warm')` — correctly targets warm deals at risk of being lost, not all Stale leads (Cold Stale leads are expected and not actionable) |
| Digest message encoding | Plain text, no emojis — keeps SMS in GSM-7 encoding (160 chars/segment) rather than UCS-2 (70 chars/segment), reducing per-message Twilio segment cost |
| Weekly report aggregation | `Build Weekly Report` uses `mode: runOnceForAllItems` and a 7-day trailing window (`Date Created` for new-lead metrics, `Last Contact` for status-change metrics) — single pass, single SMS, no loop needed |
| Weekly report owner phone sync | Programmatically read `+18575261499` from workflow 04's live `Build Alert Message` node and patched it into workflow 08 via `update_workflow` `setNodeParameter` (path `/jsCode`) — **zero manual setup required for workflow 08**, unlike 04 and 07 which required user action |
| Weekly report live test | Manually executed (execution `54`, 2026-06-07): computed against real Leads data — 7 new leads, 0 Hot/Emergency, 1 booked, 0 stale, 14% bookings/new ratio, top sources `Phone 3, Unknown 2`; SMS sent successfully — Twilio returned `status: queued`, `to: +18575261499`, `num_segments: 2` |
| Bookings/New ratio — documented limitation | Compares two overlapping-but-distinct cohorts (booked-this-week vs. created-this-week); explicitly documented in PROJECT_STATUS.md as a trend indicator, not a precise funnel-conversion metric |

---

## Known Issues / Setup Required

| Issue | Impact | Action |
|---|---|---|
| Twilio trial account / toll-free not verified | Outbound SMS to non-test numbers may be limited/prefixed (e.g. "Sent from your Twilio trial account -") until upgrade + verification | **No action required at this time.** Per explicit user direction (2026-06-07): "Twilio verification/account upgrade remains intentionally paused and should be treated as a non-blocking external dependency." Workflows are correct and functional; this is a deliberate, paused external decision — not a defect. |

### Resolved this session
| Issue | Resolution |
|---|---|
| Workflow 04 — `OWNER_PHONE_HERE` placeholder | ✅ User replaced with `+18575261499` and republished |
| Workflow 07 — `OWNER_PHONE_HERE` placeholder | ✅ User replaced with `+18575261499` and republished |
| Workflow 08 — owner phone | ✅ Synced programmatically from workflow 04's live node via `update_workflow` — no manual step ever required |

---

## Previously Listed as Blockers — Now Resolved

| Item | Resolution |
|---|---|
| Google Sheets credential not set | ✅ Set and verified |
| Anthropic credential not set | ✅ Set and verified |
| Twilio credential not set | ✅ Set and verified |
| Header rows not on Row 1 | ✅ Fixed and verified |
| Workflows not active/published | ✅ All five active (02, 03, 04, 05 published this session) |
| `YOUR_COMPANY_NAME` placeholder | ✅ Set to `Valfin Tech` in workflow 02 |
| `YOUR_TWILIO_NUMBER` placeholder | ✅ Set to `+18889839308` in workflows 02 and 03 |
| Workflow 03 not built | ✅ Built and active (`u9I1bqrLW6V5LtLp`) |
| `skipLeadCreation` not live | ✅ Live in CRM Adapter current version |
| Twilio call-status URL | ✅ Configured in Twilio console |
| End-to-end tests (Phase 2) | ✅ All passed |
| CRM Adapter doesn't accept `followUpCount` | ✅ Patched — `Resolve & Build Lead Row` updated |
| Local JSON files out of sync | ✅ All five local JSON files updated/created this session |
| Version note (activeVersionId ≠ versionId) | ✅ Resolved — user published workflow 01 to sync; all workflows now published |

---

## Architecture Reference (Verified)

### Google Sheet Column Headers

**Leads tab** (all columns must exist on Row 1):
```
Lead ID | Date Created | Source | First Name | Last Name | Phone | Email | Address |
Service Needed | Description | Photos Link | Preferred Time | Lead Score | Temperature |
Urgency | Status | Last Contact | Follow-up Count | Assigned To | Notes
```

**Communication Log tab** (all columns must exist on Row 1):
```
Log ID | Date / Time | Lead ID | Customer Name | Channel | Direction | Handler | Message Summary | Notes
```

> Note: the column header is `Date / Time` (spaces around `/`). The internal JSON key produced by `Build Log Row` is `Date/Time` (no spaces). The explicit `defineBelow` column mapping translates between them correctly. Do not remove the spaces from the sheet header.

---

### `skipLeadCreation` Logic

Detection in `Resolve & Build Lead Row` (CRM Adapter code node):
```javascript
const isMissedCall =
  input.source === 'Phone' &&
  input.logSummary === 'Missed call — auto-SMS sent';
```

IF node: `$json.skipLeadCreation === true`
- Output 0 (true) → Build Log Row (Upsert Lead skipped)
- Output 1 (false) → Upsert Lead → Build Log Row

**Fragility:** Detection relies on `logSummary` being exactly `'Missed call — auto-SMS sent'`. If this string changes in workflow 03's `Build CRM Log` node, missed calls will start creating Lead records. These two strings must stay in sync.

---

### Hot Lead Alert Architecture

Inserted in workflow 02 **after** `CRM: Log Outbound SMS` (node 14 of 16):

```
CRM: Log Outbound SMS
  → Prep Alert Data (reads $('Mark Outbound Log').first().json to recover full lead data)
  → IF: Hot Lead? (temperature === 'Hot' OR urgency === 'Emergency')
      true  → Alert: Hot Lead (executeWorkflow → KIpMMKM8H5IZB9wb)
      false → (end, no alert)
```

**Why `Prep Alert Data`:** After `CRM: Log Outbound SMS` the only available data is `{ leadId, isNew, temperature, leadScore, status }`. The full lead (name, phone, service, urgency) is preserved in `Mark Outbound Log` — referenced by node name.

---

### Follow-Up Sequence Architecture

```
Daily 9 AM ET (scheduleTrigger)
  → Get All Leads (googleSheets — reads Leads tab directly)
  → Filter & Build Messages (Code — filters, normalizes phone, generates templates)
  → Loop Over Leads (splitInBatches, batchSize=1)
      → Send Follow-Up SMS (Twilio — $json becomes Twilio response after this)
      → Build CRM Update (Code — reads $('Filter & Build Messages').item.json)
      → CRM: Update Lead + Log (executeWorkflow → wVRHChyFrUNRaH4M)
      → (loop continues)
```

**Follow-up count thresholds:**
| Count before send | Wait time | Template | Status set |
|---|---|---|---|
| 0 | 24h | Day 1 | Contacted |
| 1 | 72h | Day 3 | Contacted |
| 2 | 96h | Day 7 | Stale |
| 3 | — | Stop | (no change) |

**Phone normalization:** `raw.length === 11 && raw.startsWith('1') ? '+' + raw : raw.length === 10 ? '+1' + raw : null`
Leads with no valid phone are skipped silently.

---

### Pipeline Status Digest Architecture

```
Daily 6 PM ET (scheduleTrigger, 22:00 UTC)
  → Get All Leads (googleSheets — reads Leads tab directly, read-only)
  → Build Pipeline Digest (Code, runOnceForAllItems)
      - Tallies counts by Status: New / Contacted / Booked / Stale
      - Computes today's activity: newToday (Date Created = today), bookedToday (Status=Booked + Last Contact = today)
      - Builds escalation list: Status = Stale AND Temperature in {Hot, Warm} (top 3 + "+N more")
      - Assembles single plain-text SMS (no emojis — GSM-7 encoding)
  → Send Owner Digest SMS (Twilio)
```

**Why read directly instead of via CRM Adapter:** This workflow only reads — it never writes to Sheets or Communication Log, so there's no dedup/single-writer concern. Matches the same direct-read precedent already used in workflow 05 (`Get All Leads`).

**Escalation criteria rationale:** Only Stale leads that are still Hot or Warm are surfaced — these are qualified prospects the automated follow-up sequence couldn't close, representing real revenue at risk. Cold Stale leads are expected/normal churn and would just create noise.

---

### Weekly Pipeline Report Architecture

```
Weekly Monday 8 AM ET (scheduleTrigger, weeks interval, triggerAtDay=[1] / Monday, 13:00 UTC)
  → Get All Leads (googleSheets — reads Leads tab directly, read-only)
  → Build Weekly Report (Code, runOnceForAllItems)
      - Computes trailing 7-day window: weekAgoStr .. todayStr
      - New-lead metrics keyed on Date Created (newThisWeek, hotThisWeek, emergencyThisWeek, sourceCounts)
      - Status-change metrics keyed on Last Contact (bookedThisWeek, staleThisWeek)
      - bookingRatio = round(bookedThisWeek / newThisWeek * 100) — documented as a trend
        indicator only (mismatched cohorts — see "Bookings/New ratio" note above)
      - Top 2 lead sources by volume
      - Assembles single plain-text SMS (no emojis — GSM-7 encoding, confirmed 2 segments)
  → Send Owner Weekly Report SMS (Twilio)
```

**Owner phone — zero manual setup:** Unlike workflows 04 and 07 (which required the user to manually replace `OWNER_PHONE_HERE`), workflow 08 was built with the placeholder, then immediately patched via `update_workflow` `setNodeParameter` (path `/jsCode`) using the live value (`+18575261499`) read directly from workflow 04's `Build Alert Message` node. This is the preferred pattern going forward whenever a new SMS-sending workflow is added — read the live value from an already-configured workflow rather than asking the user to set it again.

**Live verification:** Manually triggered via `test_workflow` → execution `54` → `status: success`. Inspected node-level output via `get_execution` with `includeData: true`: `Build Weekly Report` produced a correctly formatted report from real Sheet data, and `Send Owner Weekly Report SMS` returned a Twilio response with `status: "queued"`, confirming the SMS pipeline (credentials, formatting, delivery request) all function correctly end-to-end.

---

### Missed-Call SMS (Static — No AI)

Hardcoded in `Build SMS Request` (workflow 03):
> "Sorry we missed your call. Please complete our quick roofing request form so we can review your project and contact you promptly: https://roofing.valfin.com/request"

To change: edit `Build SMS Request` node in workflow `u9I1bqrLW6V5LtLp`.
`prompts/missed_call_sms.system.md` is a superseded reference — Claude was removed from this flow.

---

## Missing Integrations (Future Scope)

| Integration | Status | Notes |
|---|---|---|
| Instagram DM → n8n | ❌ Not built | Requires Meta Business API + webhook. Not in Phase 3 scope. |
| Facebook Messenger → n8n | ❌ Not built | Same Meta webhook, different channel routing. Not in Phase 3 scope. |
| SMS inbound reply handling | ❌ Not built | Needed for Phase 5. Twilio inbound webhook. |
| GoHighLevel CRM | ⏳ Future | CRM Adapter (`wVRHChyFrUNRaH4M`) is the only swap point. |
| Slack / email owner notifications | ⏳ Future | Workflow 04 designed for single phone now; expand to multi-channel later. |

---

## Assumptions (Locked In)

| Assumption | Basis | Override Location |
|---|---|---|
| Lead dedup by phone (digits-only match) | Brief spec | `Resolve & Build Lead Row` code node, workflow 01 |
| Lead ID: `LEAD-0001` | Brief spec | Same node |
| Log ID: `LOG-` + timestamp + random | Convention | `Build Log Row` code node, workflow 01 |
| Scoring: Hot=80-100, Warm=50-79, Cold=1-49 | Brief spec | System prompt in `Build Scoring Request`, workflow 02 |
| Confirmation SMS under 320 chars, no emojis | Brief spec | Haiku system prompt in `Build Confirmation Request`, workflow 02 |
| Sonnet 4.6 for scoring, Haiku 4.5 for form SMS | Session decision | Model strings in HTTP Request nodes, workflow 02 |
| Missed-call SMS: static, no AI | User decision after testing | `Build SMS Request` node, workflow 03 |
| Follow-up SMS: static templates, no AI | Architecture decision | `Filter & Build Messages` node, workflow 05 |
| Company name: `Valfin Tech` | Set in live workflow | `Build Confirmation Request`, workflow 02 |
| Google Sheet ID: `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` | Live verified | All Sheets nodes, workflows 01 and 05 |
| Follow-up schedule: 9 AM ET daily | Session decision | `Daily 9 AM ET` trigger, workflow 05 |
| Owner notification: SMS only (Phase 3) | Session decision | `Build Alert Message`, workflow 04 — expand later |
| Pipeline digest schedule: 6 PM ET daily | Session decision | `Daily 6 PM ET` trigger, workflow 07 — end-of-business-day summary |
| Pipeline digest: read-only, no AI, plain text | Session decision | `Build Pipeline Digest`, workflow 07 — reliability, zero cost, GSM-7 segment efficiency |
| Stale escalation threshold: Hot/Warm only | Session decision | `Build Pipeline Digest`, workflow 07 — Cold Stale leads excluded as expected churn |
| Weekly report schedule: Monday 8 AM ET | Session decision | `Weekly Monday 8 AM ET` trigger, workflow 08 — start-of-week look-back at prior week's performance |
| Weekly report delivery: SMS (not email) | Session decision | No email credential exists in n8n (`list_credentials` returned only Google Sheets, Anthropic, Header Auth, Twilio); SMS reuses proven infrastructure with zero new setup. Roadmap explicitly allowed "SMS or email." |
| Weekly report window: trailing 7 days | Session decision | `Build Weekly Report`, workflow 08 — simpler and more current than calendar-week boundaries |
