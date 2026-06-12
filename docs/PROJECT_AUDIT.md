# Project Audit
_Last updated: 2026-06-07 — Phase 4 complete_

> **V1.1 (2026-06-11):** This audit is a historical snapshot from Phase 4 and predates the V1.1 simplification pass. AI lead scoring (`Lead Score`/`Temperature`/`Urgency`, Sonnet 4.6) was removed system-wide; the `Leads` tab is now 17 columns (down from 20); "Hot Lead Alert" (04) was renamed "Every Lead Alert" and fires for every submission; workflows 07/08/11/12 now email by default (SMS built but disabled by default); all timestamps are `America/New_York` via Luxon. Architecture descriptions below referencing scoring, Hot/Warm/Cold, SMS-only reporting, or the 20-column schema are historical. See `README.md` and `docs/V1_1_RECONCILIATION.md` for the current system.

---

## Verification Summary (2026-06-07)

All Phase 2 workflows inspected via n8n MCP and verified against live execution history. **Phase 3 is complete — all 5 components (04–08) built, published, and configured.** Workflow 06 (Appointment Booking) confirmed working end-to-end in production by user: Lead status updates to Booked, Appointment rows write correctly, Communication Log entries are created, Follow-Up workflow continues running normally, Hot Lead Alert remains published. Workflow 07 (Pipeline Status Digest) built and published — daily owner SMS visibility + Stale/Hot escalation. Workflow 08 (Weekly Pipeline Report) built, published, owner phone synced programmatically (no manual step needed), and **test-executed live against real data (execution 54)** — produced and queued a correct SMS report. Owner phone number `+18575261499` is now confirmed live across all three SMS-alerting workflows (04, 07, 08).

**Phase 4 is now complete.** Before building workflow 09, workflow 06's Booking Form was patched from free-text date/time fields to structured `date`/`dropdown` fields — a prerequisite fix, since free-text values like "Tuesday, June 10" cannot be reliably parsed for reminder-time math. Workflow 09 (Appointment Reminders) was then built, validated, published, and **test-executed live (execution 55)** — it correctly read the live Appointments tab, recognized the one existing row's legacy pre-fix free-text values as unparseable, and safely skipped it with zero false-positive sends, confirming both the parsing guard and zero-item safety work correctly end-to-end against real data.

Workflow 10 (Reschedule/Cancel) was then built, validated, published, and **test-executed live via simulated inbound-SMS pin data (executions 63, 64, 65)** — all three routing branches (reschedule-found, cancel-found, not-found) executed successfully against the shape of live Appointments data, correctly classifying intent, matching the customer's appointment by phone, updating the sheet (`Status` + audit-trail `Notes`), and producing correct customer-reply and owner-alert SMS content. The workflow uses the native `twilioTrigger` node (`com.twilio.messaging.inbound-message.received`) with the existing Twilio credential — **zero manual setup required**, unlike a generic-webhook approach which would have needed the user to paste a URL into the Twilio console. **Phase 4 has zero open setup items.**

**Compliance fix (2026-06-07, executions 67/68):** A pre-launch sellability review surfaced a real TCPA/carrier-compliance exposure in `Normalize Inbound SMS`: the original cancel-intent regex included the bare word `stop`, so a standalone opt-out text like `"STOP"` would have been misclassified as "cancel my appointment" and triggered an automated reply — exactly the behavior carriers and TCPA rules prohibit for opt-out messages. The node was patched live (`update_workflow setNodeParameter`, republished as `activeVersionId: 91bb00e6-...`) to detect standalone opt-out keywords (`STOP`, `UNSUBSCRIBE`, `QUIT`, `END`, `CANCEL ALL`, etc. — matched only when they constitute the entire message) and route them to `intent: 'other'` (silently ignored, zero auto-reply), as a defense-in-depth backstop alongside Twilio's carrier-level Advanced Opt-Out handling. Verified live: execution 67 (`"STOP"` → `intent: 'other'`, no reply sent) and execution 68 (`"please cancel my roofing appointment, something came up"` → `intent: 'cancel'`, full cancellation flow ran correctly) — confirming the fix closes the compliance gap without breaking legitimate cancellation requests. See `docs/CLIENT_DEPLOYMENT_GUIDE.md` §7 for the client-facing compliance checklist this informed.

---

## ✅ Confirmed Working

| Item | Details |
|---|---|
| CRM Adapter active | `wVRHChyFrUNRaH4M` — active, sub-workflow callable from 02, 03, 05 |
| Form Capture active | `HdJc5cy8cmqMBfGR` — form + webhook triggers both live, 16 nodes (V1.1: AI scoring removed, every lead alerted) |
| Missed-Call Auto-SMS active | `u9I1bqrLW6V5LtLp` — Twilio webhook live |
| Every Lead Alert active (formerly "Hot Lead Alert") | `KIpMMKM8H5IZB9wb` — published; called by workflow 02 for every submission (V1.1: no scoring/branching) |
| Follow-Up Sequence active | `chYfABnQdnPfiHQx` — published; daily 9 AM ET schedule |
| Appointment Booking active | `ax2sMbvv0lqyJHMg` — published; form live at `https://valfin.app.n8n.cloud/form/eca6bfbb-ef53-4f82-b909-cbd2b818991a`; **confirmed working end-to-end in production by user (2026-06-07): Lead → Booked, Appointment row written, Comm Log entry created, Follow-Up + Every Lead Alert unaffected** |
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
| Booking form structured fields | `ax2sMbvv0lqyJHMg` patched (2026-06-07): `Appointment Date` is now `fieldType: 'date'` (returns `YYYY-MM-DD`), `Appointment Time` is now `fieldType: 'dropdown'` with 10 fixed hourly slots (8 AM–5 PM). Republished — `activeVersionId daef5531-36ca-47b6-b648-798b5cd97bd3` |
| Booking form friendly-display preserved | `Build Booking Payload` now derives `apptDateDisplay` (e.g. "Tuesday, June 10") via `formatFriendlyDate()` from the structured `YYYY-MM-DD` value, used only in the customer-facing confirmation SMS — the stored `Appt Date`/`Appt Time` columns remain machine-parseable for workflow 09 |
| Appointment Reminders active | `bJcO5ox2u190bxTr` — published; hourly schedule (`hoursInterval: 1`); reads Appointments tab (read scope) + writes only `Reminder 24h`/`Reminder 2h` flag columns (scoped write); **live test execution 55 succeeded** — correctly parsed/skipped a legacy unparseable row, emitted 0 reminders, loop no-op'd cleanly on empty input |
| Reminder idempotency mechanism | `Mark Reminder Sent` writes an ISO timestamp to the just-sent reminder type's column while passing the other column's existing value through unchanged — verified in code logic (`existingReminder24`/`existingReminder2h` round-trip from `Build Reminder Batch`); prevents both duplicate sends and accidental flag overwrites |
| Reminder send isolation | `splitInBatches(batchSize: 1)` + `retryOnFail` on both `Send Reminder SMS` and `Mark Reminder Sent` — one bad phone number or transient Twilio failure cannot block reminders to other customers in the same hourly run |
| Reschedule/Cancel active | `Bj5b3sUexa8EeQcK` — published; native `twilioTrigger` (`com.twilio.messaging.inbound-message.received`) using the existing `twilioApi` credential — **zero manual webhook setup**; reads Appointments tab + writes only `Status`/`Notes` on the matched row (scoped write) |
| Reschedule/Cancel intent classification | `Normalize Inbound SMS` uses keyword regex (no AI) to classify `cancel` / `reschedule` / `other`; **(2026-06-07 compliance fix)** standalone SMS opt-out keywords (`STOP`, `UNSUBSCRIBE`, `QUIT`, `CANCEL ALL`, etc. — matched only when they constitute the entire message) are detected first and forced to `other`, guaranteeing zero auto-reply to a likely carrier opt-out — "cancel" inside a natural sentence ("please cancel my appointment...") is still correctly classified as `cancel`; unparseable phone numbers are also forced to `other` so no reply is attempted to an invalid destination; `other` intents are gated out at `Is Reschedule or Cancel?` — no reply sent, no noise on "thanks"/"ok"/spam/opt-outs |
| Reschedule/Cancel appointment matching | `Find Customer Appointment` normalizes phone numbers to 10 digits, filters to `Status === 'Scheduled'`, and sorts candidates by `Appt Date`/`Appt Time` ascending to pick the nearest-upcoming match — correctly handles customers with multiple appointments and ignores already-resolved rows |
| Reschedule/Cancel sheet update + audit trail | `Build Reply Plan` branches on intent: cancel → `Status: 'Cancelled'` (auto-excludes the slot from future reminder sweeps); reschedule → `Status` unchanged (`'Scheduled'`, staff coordinates); both append a `[ISO-timestamp] Customer {action} via SMS reply: "<message>"` entry to `Notes` (existing notes preserved, pipe-separated) — single `googleSheets update` node, `matchingColumns: ['Appt ID']` |
| Reschedule/Cancel reply + alert content | Customer replies are reassuring and specific (cancel: confirmation + rebooking invite; reschedule: acknowledgment + callback promise); owner alerts carry full context (customer name/phone, appointment ID/date/time/service, requested action) enabling immediate same-day staff follow-up by phone |
| Reschedule/Cancel not-found handling | Unmatched phone numbers receive a generic "couldn't find an appointment, please call us" reply — graceful dead-end with zero false-positive matches |
| Reschedule/Cancel live test | Simulated inbound SMS via pinned trigger + sheet data matching the live row (`APT-20260607144823`, phone `+18575261499`) — **executions 63/64/65 all succeeded**: (63) reschedule → found, correct reply/alert/notes, status preserved; (64) cancel → found, status → `Cancelled`, correct reply/alert/notes; (65) unmatched phone → graceful not-found reply. All three routing branches verified end-to-end. **Compliance-fix executions 67/68 (2026-06-07) also succeeded**: (67) bare `"STOP"` → `intent: 'other'`, zero replies sent; (68) `"please cancel my roofing appointment, something came up"` → `intent: 'cancel'`, full cancellation flow ran correctly — confirming opt-out keywords are silently ignored while real cancellation requests containing "cancel" are still handled properly. |

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
Service Needed | Description | Photos Link | Preferred Time | Status | Last Contact |
Follow-up Count | Assigned To | Notes
```

> **V1.1 (2026-06-11):** `Lead Score`, `Temperature`, and `Urgency` were removed (20 columns → 17). The block above shows the current 17-column schema; see `docs/CRM_SHEET_SCHEMA.md` for the full reference.

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

### Appointment Reminders Architecture

```
Hourly Reminder Check (scheduleTrigger, hours interval, hoursInterval=1, triggerAtMinute=0)
  → Get All Appointments (googleSheets, resource=sheet/operation=read — reads Appointments tab directly)
  → Build Reminder Batch (Code, runOnceForAllItems)
      - parseApptDateTime(): strict regex match on Appt Date (YYYY-MM-DD) and
        Appt Time (H:MM AM/PM); returns null (skip) on any non-conforming value —
        this is what safely filtered out the legacy "Friday"/"14:00" test row
      - ET treated as fixed UTC-5 (Date.UTC(... hour + 5 ...)) — same convention as
        workflows 05/07/08
      - hoursUntil = (apptDateTime - now) / 3600000
      - Eligible only if Status === 'Scheduled' AND hoursUntil >= 0 AND phone
        normalizes to E.164
      - Emits one item per due reminder: 24h window [20,28], 2h window [1,3],
        gated by the corresponding Reminder flag being empty
      - formatFriendlyDate() renders "Weekday, Month Day" for the SMS body
  → Loop Over Reminders (splitInBatches, batchSize=1)
      → Send Reminder SMS (Twilio, resource=sms/operation=send, retryOnFail)
      → Mark Reminder Sent (googleSheets, resource=sheet/operation=update,
         matchingColumns=['Appt ID'], writes Reminder 24h + Reminder 2h —
         conditionally: the just-sent type's column gets sentAt (ISO timestamp),
         the other column passes through its existing value unchanged)
      → nextBatch (loop continues)
```

**Idempotency design (verified in code):** Rather than branching on reminder type with separate IF/Switch + Merge nodes, `Build Reminder Batch` carries `existingReminder24`/`existingReminder2h` (the row's current flag values) alongside `reminderType` and `sentAt` into each emitted reminder item. `Mark Reminder Sent` then writes both columns on every update using ternary expressions keyed on `reminderType`, so the column matching the type just sent gets the new timestamp and the other column is round-tripped untouched. This collapses what would otherwise require branch+merge into a single Google Sheets update node — simpler, fewer failure points, and avoids any window where one flag could be accidentally blanked.

**Date/time parsing — why the prerequisite fix mattered:** `parseApptDateTime()` requires `Appt Date` to match `^\d{4}-\d{2}-\d{2}$` and `Appt Time` to match `^\d{1,2}:\d{2}\s*(AM|PM)$`. Workflow 06's original free-text fields produced values like `"Tuesday, June 10"` / `"2:00 PM"` (sometimes `"Friday"` / `"14:00"` as seen in the live test row) — none of which reliably match these patterns. Rather than attempting fuzzy natural-language date parsing (fragile, locale-dependent, hard to test), the fix was applied at the source: workflow 06's form now emits guaranteed-format values (`date` field → `YYYY-MM-DD`; `dropdown` → one of 10 fixed `H:MM AM/PM` strings), and `parseApptDateTime()` stays a simple, fully-deterministic regex+arithmetic function.

**Live verification:** Manually triggered via `test_workflow` → execution `55` → `status: success`. Inspected node-level output via `get_execution` with `includeData: true`: `Get All Appointments` returned the single live row (`Appt ID: APT-20260607144823`, `Appt Date: "Friday"`, `Appt Time: "14:00"` — a pre-fix legacy test booking), and `Build Reminder Batch` correctly returned 0 items (regex match failed → `parseApptDateTime` returned `null` → `continue`). The downstream loop did not execute (correct zero-item no-op per SDK zero-item-safety guidance — no `alwaysOutputData`, no IF gate). This confirms the parsing guard, eligibility filter, and loop-safety all behave correctly on real production data; the send+mark pipeline will exercise fully once a structured (post-fix) booking enters its 24h or 2h window.

---

### Reschedule/Cancel Architecture

```
Inbound SMS Trigger (twilioTrigger, updates: ['com.twilio.messaging.inbound-message.received'])
  → Normalize Inbound SMS (Code, runOnceForAllItems)
      - Extracts From/Body from the Twilio payload (b.From / b.Body, with b = $json.body || $json
        as a defensive fallback for payload-shape variance)
      - COMPLIANCE CHECK (added 2026-06-07): first tests whether the ENTIRE trimmed message is a
        standalone SMS opt-out keyword (stop|stopall|unsubscribe|cancel\s*all|quit|end|opt[\s-]?out|
        remove, anchored ^...$) — if so, intent is forced to 'other' (silently ignored, zero
        auto-reply), as a defense-in-depth backstop alongside Twilio's carrier-level Advanced
        Opt-Out handling
      - Otherwise classifies intent via keyword regex: cancel|cancelled|can't make it|won't be able
        → 'cancel'; reschedule|resched|change|move|different time|new time|push back → 'reschedule';
        else 'other' (note: 'stop' was REMOVED from the cancel-intent list — see Compliance Fix below)
      - Normalizes phone to E.164; forces intent to 'other' if normalization fails (never reply to
        an unaddressable number)
  → Is Reschedule or Cancel? (IF: intent !== 'other')
      false → ends silently — no reply to "thanks"/"ok"/spam/wrong-number texts (avoids noise + cost)
      true  → Get All Appointments (googleSheets, resource=sheet/operation=read)
        → Find Customer Appointment (Code, runOnceForAllItems)
            - Normalizes both inbound and sheet phone numbers to 10 digits
            - Filters to Status === 'Scheduled' AND phone match
            - Sorts candidates by Appt Date then Appt Time ascending — nearest upcoming wins
            - Outputs found:true (with full appointment context) or found:false
        → Appointment Found? (IF: found === true)
            true  → Build Reply Plan (Code, runOnceForAllItems)
                      - Branches on intent: cancel sets newStatus='Cancelled' + builds a
                        confirmation-and-rebooking-invite customer reply + a "consider following up
                        to rebook" owner alert; reschedule keeps newStatus='Scheduled' + builds an
                        acknowledgment-and-callback-promise customer reply + a "please call them to
                        confirm a new time" owner alert
                      - Both branches append a timestamped, quoted-original-message audit entry to
                        Notes (existing notes preserved, pipe-separated)
                    → Update Appointment Row (googleSheets update, matchingColumns=['Appt ID'],
                       writes Status + Notes only — scoped write)
                    → Send Customer Reply SMS (Twilio, resource=sms/operation=send, retryOnFail)
                    → Notify Owner of Inbound Request (Twilio — full context: name, phone, appt ID,
                       date/time, service, requested action)
            false → Send Not Found Reply (Twilio — generic "couldn't find an appointment" message)
```

**Why acknowledge-and-alert instead of full self-service rebooking (design rationale):** A true two-way SMS slot-negotiation flow (propose available times → parse the customer's free-text reply → re-check availability → confirm) is high-complexity, fragile over a 160-character medium, and easy to derail with an unexpected reply — high cost of error for low marginal value. The simpler, higher-confidence design instantly reassures the customer (stopping them from worrying about a no-show penalty or wondering if their message was received) **and** instantly arms the owner with full context to close the loop by phone — the channel roofing customers actually expect for schedule changes. This mirrors the static-template-no-AI precedent already established in workflows 03/05/06/07/08/09: reliable, zero-cost, instantaneous, and impossible to derail.

**Compliance Fix (2026-06-07) — standalone opt-out keyword detection:** The original keyword regex included `stop` in its cancel-intent list, meaning a bare `"STOP"` text — a legally-significant carrier opt-out signal — would have been misclassified as "cancel my appointment," triggering an automated reply. That is the opposite of compliant behavior: an automated system must never auto-reply to what may be an opt-out message, and never treat it as a different kind of request. The fix detects opt-out keywords (`stop`, `stopall`, `unsubscribe`, `cancel all`, `quit`, `end`, `opt-out`, `remove`) ONLY when they constitute the entire trimmed message (anchored regex `^(...)[.!\s]*$`), routing them to `intent: 'other'` (silently ignored, zero reply) — while preserving correct classification of "cancel" when it appears naturally inside a sentence about an appointment (e.g., "please cancel my roofing appointment, something came up" still → `intent: 'cancel'`). This is a defense-in-depth backstop; Twilio's own Advanced Opt-Out feature may intercept these keywords at the carrier level before the workflow ever sees them, but the workflow must not make things worse if one slips through. Verified live via executions 67/68 (see Live Verification below).

**Why keyword regex instead of AI for intent classification:** "Cancel" and "reschedule" requests are linguistically distinct enough (and the cost of a misclassification is low — both paths find the appointment and alert the owner; only the customer-facing copy and the `Status` write differ) that a keyword regex is reliable, instant, and free. This reserves AI spend for the one place it earns its cost in this system: lead-quality judgment calls (workflow 02's Sonnet 4.6 scoring).

**Why phone-number matching (not Appt ID or conversation threading):** Customers reply via SMS from the same number they used to book — Twilio's inbound payload carries `From` directly, with no appointment-identifying context in the message body. Matching against `Status === 'Scheduled'` rows by normalized phone, then picking the nearest-upcoming match, correctly resolves the common cases (one active appointment; or multiple, where the soonest is almost always the one being referenced) without requiring the customer to type an appointment ID into a text message — which would be a poor, error-prone UX.

**Why `Status` changes differ between cancel and reschedule:** Cancelling sets `Status = 'Cancelled'`, which automatically and immediately removes the appointment from workflow 09's reminder sweeps and from the pipeline digests (07/08) — no race condition where a cancelled appointment still receives a reminder. Rescheduling deliberately leaves `Status = 'Scheduled'` unchanged: the actual new date/time isn't known yet (it requires a human conversation to coordinate), so flipping the status would either incorrectly suppress reminders for a still-active (if soon-to-move) appointment, or require inventing a placeholder state. Both paths write a permanent, timestamped, quoted audit entry to `Notes` regardless — so staff always sees exactly what the customer said and when.

**Live verification:** Since this workflow is triggered by inbound SMS (no scheduled/live executions exist yet — no customer has texted in), it was tested via `test_workflow` with pinned data simulating real Twilio inbound-message payloads and a Google Sheets row matching the shape of the one live Appointments row (`Appt ID: APT-20260607144823`, `Phone: 18575261499`, `Status: 'Scheduled'`). Three executions, inspected via `get_execution` with `includeData: true`:
- **Execution 63** (reschedule, matching phone): `Normalize Inbound SMS` → `intent: 'reschedule'`; `Find Customer Appointment` → `found: true`, correct appointment context; `Build Reply Plan` → correct customer reply ("...we got your reschedule request... Our team will call you shortly..."), correct owner alert ("RESCHEDULE REQUEST via SMS: Hot Lead Test (+18575261499) wants to reschedule appt APT-20260607144823..."), `newStatus: 'Scheduled'` (preserved), `updatedNotes` correctly appended with timestamp + quoted message; flowed through to both SMS sends.
- **Execution 64** (cancel, same phone/row): `Build Reply Plan` → `newStatus: 'Cancelled'`, correct cancellation-and-rebooking-invite customer reply, correct "CANCELLATION via SMS... Consider following up to rebook" owner alert, correct Notes append — flowed through to the sheet update and both SMS sends.
- **Execution 65** (reschedule intent, non-matching phone `+19995550123`): `Find Customer Appointment` → `found: false` (correctly — no row matches); routed to `Send Not Found Reply` with the correct generic message and the customer's own `e164Phone` as the destination.

All three branches of the routing logic — found+reschedule, found+cancel, not-found — are confirmed structurally and logically correct against live-shaped data. The "other"/irrelevant-intent silent-ignore path was confirmed by code inspection (the `Is Reschedule or Cancel?` IF gate has no false-branch connection, so non-relevant texts simply end the execution with zero side effects).

**Compliance-fix live verification (executions 67/68, 2026-06-07):** After patching `Normalize Inbound SMS` live via `update_workflow setNodeParameter` (republished as `activeVersionId: 91bb00e6-ecec-46c1-bfd0-6f52f0af49a7`), two additional `test_workflow` runs confirmed the fix end-to-end:
- **Execution 67** (`Body: "STOP"`): `Normalize Inbound SMS` → `{intent: 'other', ...}` (correctly detected as a standalone opt-out keyword) → `Is Reschedule or Cancel?` routed to its FALSE branch (empty array on the true output) → execution ended silently with **zero replies sent**, exactly the required behavior for a likely carrier opt-out message.
- **Execution 68** (`Body: "please cancel my roofing appointment, something came up"`): `Normalize Inbound SMS` → `{intent: 'cancel', ...}` (correctly recognized "cancel" as part of a natural appointment-related sentence, NOT an opt-out) → full pipeline ran → `Build Reply Plan` produced the correct cancellation reply, owner alert, `newStatus: 'Cancelled'`, and timestamped Notes append — proving the fix does not create false positives on legitimate cancellation requests that happen to contain opt-out-adjacent words.

Together, executions 63–68 now cover all five meaningful inbound-SMS paths: reschedule-found, cancel-found, not-found, irrelevant/silent-ignore, and (newly) standalone-opt-out-silent-ignore.

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
| SMS inbound reply handling | ✅ **Built — workflow 10 (`Bj5b3sUexa8EeQcK`), live and tested** | Native `twilioTrigger` (`com.twilio.messaging.inbound-message.received`) — zero manual webhook config, compatible with current trial-account status (inbound SMS does not require toll-free verification). |
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
| Booking date/time fields: structured (`date`/`dropdown`), not free text | Session decision — prerequisite for workflow 09 | `Booking Form`, workflow 06 — free-text values are not reliably parseable for reminder-time math; friendly display string derived in `Build Booking Payload` keeps customer SMS unchanged |
| Reminder check cadence: hourly, not per-appointment scheduled jobs | Session decision | `Hourly Reminder Check` trigger, workflow 09 — stateless, self-healing single poll; 4–8 hour eligibility windows comfortably tolerate hourly granularity without missed or duplicate sends |
| Reminder windows: 24h = 20–28h out, 2h = 1–3h out | Session decision | `Build Reminder Batch`, workflow 09 — generous bands sized to the hourly check cadence so no appointment falls between two consecutive runs |
| Reminder idempotency: sheet-flag timestamps, not external dedup store | Session decision | `Reminder 24h`/`Reminder 2h` columns (reserved in workflow 06's Appointments tab schema since Phase 3); checked-and-set in the same Code+Sheets pass each hourly run |
| Weekly report window: trailing 7 days | Session decision | `Build Weekly Report`, workflow 08 — simpler and more current than calendar-week boundaries |
| Inbound SMS trigger: native `twilioTrigger`, not generic webhook | Session decision | `Inbound SMS Trigger`, workflow 10 — reuses existing `twilioApi` credential, requires zero manual Twilio-console webhook URL configuration (a generic webhook would have required the user to paste an n8n URL into the Twilio console — a manual step the standing directive aims to avoid) |
| Reschedule/Cancel reply strategy: acknowledge + alert (no AI, no self-service rebooking) | Session decision | `Build Reply Plan`, workflow 10 — two-way SMS slot negotiation is high-complexity/high-risk-of-confusion for low marginal value; instant reassurance + a fully-contextualized owner alert delivers the real business value (protects completion rate, gets staff acting same-day) at zero cost, matching the static-template-no-AI precedent (03/05/06/07/08/09) |
| Reschedule/Cancel intent classification: keyword regex, not AI | Session decision | `Normalize Inbound SMS`, workflow 10 — "cancel" vs. "reschedule" are linguistically distinct enough for reliable, instant, free keyword matching; AI spend reserved for lead-scoring judgment calls |
| Reschedule/Cancel matching: phone number + nearest-upcoming `Status='Scheduled'` row | Session decision | `Find Customer Appointment`, workflow 10 — customers text from their booking number; Twilio's `From` field is the only reliable correlation key available in an inbound SMS payload |
| Reschedule sets no new date/time automatically | Session decision | `Build Reply Plan`, workflow 10 — the new time requires a human conversation to coordinate; `Status` stays `'Scheduled'` so workflow 09 keeps reminding until staff updates the row with the agreed new slot |
