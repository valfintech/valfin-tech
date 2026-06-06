# Project Audit
_Last updated: 2026-06-06 — verified against live n8n workflows_

---

## Verification Summary (2026-06-06)

All three workflows inspected via n8n MCP. Findings below reflect the actual live implementation.

---

## ✅ Confirmed Working

| Item | Details |
|---|---|
| CRM Adapter active | `wVRHChyFrUNRaH4M` — active, sub-workflow callable from 02 and 03 |
| Form Capture active | `HdJc5cy8cmqMBfGR` — form + webhook triggers both live |
| Missed-Call Auto-SMS active | `u9I1bqrLW6V5LtLp` — Twilio webhook live |
| Google Sheets credential | Set on all Sheets nodes in workflow 01 |
| Anthropic credential | Set on all HTTP Request nodes in workflow 02 |
| Twilio credential | Set on SMS nodes in workflows 02 and 03 |
| Google Sheets headers on Row 1 | Confirmed — column mapping uses `defineBelow` with verified names |
| `skipLeadCreation` IF routing | Live in CRM Adapter current version |
| Missed calls → no Lead record | `source: 'Phone'` + `logSummary: 'Missed call — auto-SMS sent'` → `skipLeadCreation: true` → IF routes past Upsert Lead |
| Missed calls → Comm Log entry | Always written regardless of `skipLeadCreation` |
| Claude removed from missed-call flow | `Build SMS Request` (workflow 03) uses static hardcoded SMS — no AI nodes |
| Static SMS content | Directs caller to `https://roofing.valfin.com/request` |
| Twilio from number | `+18889839308` in both workflows 02 and 03 |
| Company name in confirmation SMS | `Valfin Tech` set in `Build Confirmation Request` (workflow 02) |
| CRM Adapter ID wired in callers | `wVRHChyFrUNRaH4M` correctly referenced in workflows 02 and 03 |
| Retry logic | 3× with 2–3 s delay on all external call nodes |
| Form → Lead + Comm Log | Verified — form submissions create/update Lead row and write Comm Log entry |
| Form → AI score + confirmation SMS | Verified — Sonnet 4.6 scores, Haiku 4.5 writes and sends confirmation |

---

## Known Issues

| Issue | Impact | Action |
|---|---|---|
| Twilio error 30032 — toll-free number not verified | No customer SMS received | **User action:** complete toll-free verification at [twilio.com/console](https://www.twilio.com/console). Workflows are correct; carrier blocks delivery until verified. |
| CRM Adapter `activeVersionId ≠ versionId` | None in practice | Published version (old linear flow, sheet `1G-yjm2vR3Qoo3NEmImDejGrmc5mww8-l`) is never used — no external trigger. Sub-workflow callers always run the current saved version with `skipLeadCreation`. Optional: publish current version to clean up n8n UI. |
| Google Sheet ID changed from original | None in practice | Current version uses `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ`. Tests passed. This is the correct live ID. Original docs referenced `1G-yjm2vR3Qoo3NEmImDejGrmc5mww8-l`. |
| Local JSON files out of sync with live n8n | No production impact | `01_crm_adapter_google_sheets.json`: missing IF node, old sheet ID. `02_form_capture_scoring.json`: may have placeholder values. `03_missed_call_auto_sms.json`: file does not exist locally. |
| Workflow 03 description outdated | Cosmetic | n8n description for workflow 03 still mentions "Claude Haiku 4.5" — Claude was removed. Description is stale but does not affect execution. |

---

## Previously Listed as Blockers — Now Resolved

| Item | Resolution |
|---|---|
| Google Sheets credential not set | ✅ Set and verified |
| Anthropic credential not set | ✅ Set and verified |
| Twilio credential not set | ✅ Set and verified |
| Header rows not on Row 1 | ✅ Fixed and verified |
| Workflows not active/published | ✅ All three active |
| `YOUR_COMPANY_NAME` placeholder | ✅ Set to `Valfin Tech` in workflow 02 |
| `YOUR_TWILIO_NUMBER` placeholder | ✅ Set to `+18889839308` in workflows 02 and 03 |
| Workflow 03 not built | ✅ Built and active (`u9I1bqrLW6V5LtLp`) |
| `skipLeadCreation` not live | ✅ Live in CRM Adapter current version |
| Twilio call-status URL | ✅ Configured in Twilio console |
| End-to-end tests | ✅ All passed |

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

### Missed-Call SMS (Static — No AI)

Hardcoded in `Build SMS Request` (workflow 03):
> "Sorry we missed your call. Please complete our quick roofing request form so we can review your project and contact you promptly: https://roofing.valfin.com/request"

To change: edit `Build SMS Request` node in workflow `u9I1bqrLW6V5LtLp`.
`prompts/missed_call_sms.system.md` is a superseded reference — Claude was removed from this flow.

---

## Missing Integrations (Future Scope)

| Integration | Status | Notes |
|---|---|---|
| Instagram DM → n8n | ❌ Not built | Requires Meta Business API + webhook. Not in Phase 2 scope. |
| Facebook Messenger → n8n | ❌ Not built | Same Meta webhook, different channel routing. Not in Phase 2 scope. |
| SMS inbound reply handling | ❌ Not built | Needed for Phase 4. Twilio inbound webhook. |
| GoHighLevel CRM | ⏳ Future | CRM Adapter (`wVRHChyFrUNRaH4M`) is the only swap point. |
| Team notification channel | ⚠️ Decision pending | Needed before Phase 3 build: SMS, n8n email, or Slack? |

---

## Phase 3 Pre-Build Checklist

- [ ] Confirm team notification channel (SMS to rep's mobile, n8n email, or Slack)
- [ ] Populate `Team Schedule` tab in Google Sheet with available time slots
- [ ] Define `Appointments` tab column structure
- [ ] Confirm Twilio toll-free verification complete (SMS delivery unblocked)
- [ ] Confirm company name: `Valfin Tech` is the final name for all customer-facing SMS

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
| Company name: `Valfin Tech` | Set in live workflow | `Build Confirmation Request`, workflow 02 |
| Google Sheet ID: `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` | Live verified | All Sheets nodes, workflow 01 |
