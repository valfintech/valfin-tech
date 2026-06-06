# Project Audit
_Last updated: 2026-06-06 — Phase 3 in progress_

---

## Verification Summary (2026-06-06)

All Phase 2 workflows inspected via n8n MCP and verified against live execution history. Phase 3 components (04, 05) built and published in the same session.

---

## ✅ Confirmed Working

| Item | Details |
|---|---|
| CRM Adapter active | `wVRHChyFrUNRaH4M` — active, sub-workflow callable from 02, 03, 05 |
| Form Capture active | `HdJc5cy8cmqMBfGR` — form + webhook triggers both live, 16 nodes with hot lead branch |
| Missed-Call Auto-SMS active | `u9I1bqrLW6V5LtLp` — Twilio webhook live |
| Hot Lead Alert active | `KIpMMKM8H5IZB9wb` — published; called by workflow 02 when Hot or Emergency |
| Follow-Up Sequence active | `chYfABnQdnPfiHQx` — published; daily 9 AM ET schedule |
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

---

## Known Issues / Setup Required

| Issue | Impact | Action |
|---|---|---|
| Twilio error 30032 — toll-free number not verified | No customer or owner SMS received | **User action:** complete toll-free verification at [twilio.com/console](https://www.twilio.com/console). Workflows are correct; carrier blocks delivery until verified. |
| Workflow 04 — `OWNER_PHONE_HERE` placeholder | Owner alert SMS will fail until set | **User action:** open workflow `KIpMMKM8H5IZB9wb`, edit `Build Alert Message` node, replace `OWNER_PHONE_HERE` with E.164 number (e.g. `+16175550100`). |

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
