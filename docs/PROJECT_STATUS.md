# Project Status
_Last updated: 2026-06-05_

## Current Phase
**Phase 2 — Missed-Call + Form Capture** ✅ **COMPLETE** (all workflows deployed to n8n)

---

## Completed Work

### Phase 2 — All Delivered and Live in n8n

| n8n Workflow | ID | URL | Status |
|---|---|---|---|
| CRM Adapter (Google Sheets) | `wVRHChyFrUNRaH4M` | https://valfin.app.n8n.cloud/workflow/wVRHChyFrUNRaH4M | Deployed, needs credentials |
| Form Capture + AI Scoring | `HdJc5cy8cmqMBfGR` | https://valfin.app.n8n.cloud/workflow/HdJc5cy8cmqMBfGR | Deployed, needs credentials |
| Missed-Call Auto-SMS | `u9I1bqrLW6V5LtLp` | https://valfin.app.n8n.cloud/workflow/u9I1bqrLW6V5LtLp | Deployed, needs credentials |

| File | Description |
|---|---|
| `workflows/01_crm_adapter_google_sheets.json` | CRM Adapter — local reference copy. Spreadsheet ID `1G-yjm2vR3Qoo3NEmImDejGrmc5mww8-l` set. headerRow: 1 explicit on all Sheets nodes. |
| `workflows/02_form_capture_scoring.json` | Form Capture — local reference copy. CRM Adapter ID wired. |
| `prompts/lead_scoring.system.md` | Sonnet 4.6 scoring prompt reference. |
| `prompts/form_confirmation.system.md` | Haiku 4.5 form confirmation SMS prompt reference. |
| `prompts/missed_call_sms.system.md` | Haiku 4.5 missed-call SMS prompt reference. |
| `docs/phase2_setup.md` | Node-by-node setup guide + 3-step test procedure. |
| `docs/PROJECT_STATUS.md` | This file. |
| `docs/ROADMAP.md` | Phase roadmap and architectural decisions. |
| `docs/PROJECT_AUDIT.md` | Missing files, credentials, production readiness checklist. |
| `README.md` | Project overview and folder map. |

### Infrastructure
- Google Sheet ID `1G-yjm2vR3Qoo3NEmImDejGrmc5mww8-l` confirmed live.
- n8n MCP connected to `valfin.app.n8n.cloud` (OAuth authorized).
- Git repo: `valfintech/valfin-tech` on GitHub, branch `main`.

---

## In-Progress Work
None — Phase 2 workflows are all deployed. Waiting on user to complete credential setup.

---

## Next Task
**Connect credentials in n8n UI** (user action — cannot be done via MCP).

See the step-by-step checklist in the "Blockers" section below.

After credentials are connected, run Tests A → B → C from `docs/phase2_setup.md`.

Once tests pass, move to **Phase 3: Scheduling + Team Approval** (see `docs/ROADMAP.md`).

---

## Known Blockers
All remaining blockers are user-action items — no further build work is blocked.

| # | Action | Where in n8n |
|---|---|---|
| 1 | **Fix Google Sheet header rows** — headers must be on Row 1 of every tab. Delete any title/description rows above them. | Google Sheet `1G-yjm2vR3Qoo3NEmImDejGrmc5mww8-l` |
| 2 | **Create Google Sheets credential** — type: `Google Sheets OAuth2 API`, name: `Google Sheets account`. Authorize your Google account. | n8n → Credentials → New |
| 3 | **Create Anthropic credential** — type: `Header Auth`, name: `Anthropic API`. Header name: `x-api-key`, value: your Anthropic API key. | n8n → Credentials → New |
| 4 | **Create Twilio credential** — type: `Twilio API`, name: `Twilio account`. Account SID + Auth Token from Twilio console. | n8n → Credentials → New |
| 5 | **Assign credentials in workflow 01** — open workflow `wVRHChyFrUNRaH4M`, click each of the 3 Google Sheets nodes, select `Google Sheets account`. | n8n workflow editor |
| 6 | **Assign credentials in workflow 02** — open `HdJc5cy8cmqMBfGR`, assign `Anthropic API` on `Claude - Score Lead` and `Claude - Confirmation SMS`, assign `Twilio account` on `Send Confirmation SMS`. | n8n workflow editor |
| 7 | **Set company name** — in workflow 02, open `Build Confirmation Request` node, replace `YOUR_COMPANY_NAME` with the real roofing company name. Do the same in workflow 03 `Build SMS Request`. | n8n workflow editor |
| 8 | **Set Twilio number** — in workflow 02 `Send Confirmation SMS` and workflow 03 `Send Missed Call SMS`, replace `YOUR_TWILIO_NUMBER` with your E.164 number (e.g. `+16175551234`). | n8n workflow editor |
| 9 | **Assign credentials in workflow 03** — open `u9I1bqrLW6V5LtLp`, assign `Anthropic API` on `Claude - Missed Call SMS`, assign `Twilio account` on `Send Missed Call SMS`. | n8n workflow editor |
| 10 | **Configure Twilio call-status URL** — in your Twilio console, go to your phone number → Voice → Status Callback. Set URL to the webhook URL from workflow 03 (open the `Twilio Call Status` node to see the URL). | Twilio console |
| 11 | **Activate workflows 02 and 03** — toggle to Active. (Workflow 01 does not need to be active — it runs as a sub-workflow.) | n8n workflow editor → toggle |

---

## Sheet Header Fix (Action Required Before Testing)

The n8n Google Sheets nodes read **Row 1 as headers**. `headerRow: 1` is explicitly set.

**For each tab — Leads and Communication Log — Row 1 must be the column header row:**

Leads tab Row 1 must have exactly:
`Lead ID | Date Created | Source | First Name | Last Name | Phone | Email | Address | Service Needed | Description | Photos Link | Preferred Time | Lead Score | Temperature | Urgency | Status | Last Contact | Follow-up Count | Assigned To | Notes`

Communication Log tab Row 1 must have:
`Log ID | Date/Time | Lead ID | Customer Name | Channel | Direction | Handler | Message Summary | Notes`

If extra rows exist above these headers, delete them.
