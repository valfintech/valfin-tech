# Project Audit
_Last updated: 2026-06-05_

---

## Missing Files

| File | Status | Notes |
|---|---|---|
| `workflows/03_missed_call_auto_sms.json` | ❌ Not yet built | Phase 2 final piece. Next task. |
| `prompts/missed_call_sms.system.md` | ❌ Not yet built | Will be created alongside workflow 03. |
| `workflows/04_ai_qualifier_agent.json` | ⏳ Phase 3 | Not started. |
| `workflows/05_scheduling_flow.json` | ⏳ Phase 3 | Not started. |
| `workflows/06_team_approval.json` | ⏳ Phase 3 | Not started. |
| `workflows/07_appointment_reminders.json` | ⏳ Phase 4 | Not started. |
| `workflows/08_reschedule_cancel.json` | ⏳ Phase 4 | Not started. |
| `workflows/09_quote_followup_sequence.json` | ⏳ Phase 5 | Not started. |
| `workflows/10_post_job_retention.json` | ⏳ Phase 6 | Not started. |
| `workflows/11_seasonal_campaigns.json` | ⏳ Phase 6 | Not started. |
| Shared Error Trigger workflow | ⚠️ Optional but recommended | Not built. See Phase 2 setup doc §6. Would route all workflow failures to one alert channel. |

---

## Missing Integrations

| Integration | Status | Notes |
|---|---|---|
| Instagram DM → n8n | ❌ Not built | Phase 2 scope item from brief. Requires Meta Business API + webhook. Not yet designed. |
| Facebook Messenger → n8n | ❌ Not built | Phase 2 scope item from brief. Same Meta webhook, different channel routing. |
| SMS inbound reply handling | ❌ Not built | Needed for Phase 4 (reschedule/cancel keywords). Twilio inbound webhook. |
| GoHighLevel CRM | ⏳ Future | CRM adapter (workflow 01) is the swap point. Not needed until client upgrades. |
| Team notification channel (Phase 3) | ⚠️ Decision pending | Brief doesn't specify: SMS to rep mobile, email, or Slack. User decision required before Phase 3 build. |

**Note on Instagram/Facebook:** The project brief lists these as lead sources but they were not included in Phase 2 build scope (the demo focuses on form + missed call). These require a Meta Business account, webhook subscriptions, and a normalization node feeding the same CRM Adapter pipeline. Flag these for Phase 2.5 or Phase 3 scope decision.

---

## Missing Credentials (User Action Required)

These must be created in n8n before any workflow can run. None of these can be provided by this system.

| Credential | Type in n8n | Where Used | Status |
|---|---|---|---|
| Google Sheets OAuth2 | `Google Sheets OAuth2 API` | Workflow 01 (all 3 Sheets nodes) | ❌ Not confirmed created |
| Anthropic API key | `Header Auth` (Name: `x-api-key`) | Workflows 02, 03 (all Claude HTTP Request nodes) | ❌ Not confirmed created |
| Twilio Account | `Twilio API` (Account SID + Auth Token) | Workflows 02, 03 (Send SMS nodes) | ❌ Not confirmed created |

**How to create:** n8n UI → Credentials → New → search for the type above.

---

## Missing Setup Steps (User Action Required)

| Step | Description | Blocking? |
|---|---|---|
| Fix header rows in Google Sheet | Delete any title/description rows so column headers are on Row 1 of every tab. See `PROJECT_STATUS.md` for exact column names required. | ✅ **BLOCKS TESTING** |
| Set company name placeholder | Replace `YOUR_COMPANY_NAME` in the `Build Confirmation Request` node (workflow 02) and the equivalent node in workflow 03 with the actual roofing company name. | Blocks SMS content |
| Set Twilio number | Replace `YOUR_TWILIO_NUMBER` in workflow 02 Send SMS node (and workflow 03 when built) with your Twilio number in E.164 format (e.g. `+16175551234`). | Blocks SMS sending |
| Wire CRM Adapter ID | After deploying workflow 01 to n8n, select it in the two `Execute Workflow` nodes in workflow 02 (and workflow 03). The placeholder `YOUR_CRM_ADAPTER_WORKFLOW_ID` resolves when you pick it in the UI, or via MCP deployment. | Blocks CRM writes |
| Configure Twilio call-status URL | After workflow 03 is live in n8n, copy its webhook URL and paste it into Twilio console: Phone Numbers → your number → Voice → "A call comes in" → Status Callback. | Blocks missed-call flow |

---

## Production Readiness Checklist

### Phase 2 — Form Capture + AI Scoring
- [ ] Workflow 01 (CRM Adapter) live and active in n8n
- [ ] Workflow 02 (Form Capture) live and active in n8n
- [ ] Google Sheets credential set on all 3 nodes in workflow 01
- [ ] Anthropic credential set on both Claude nodes in workflow 02
- [ ] Twilio credential set on Send SMS node in workflow 02
- [ ] Google Sheet headers on Row 1 (all tabs)
- [ ] `YOUR_COMPANY_NAME` replaced in workflow 02
- [ ] `YOUR_TWILIO_NUMBER` replaced in workflow 02
- [ ] CRM Adapter workflow ID wired into both Execute Workflow nodes in workflow 02
- [ ] Test A passed: adapter smoke test (Jane Doe → LEAD-0001 in sheet, no duplicate on re-run)
- [ ] Test B passed: form submit → score → Leads row written with Hot/Warm/Cold
- [ ] Test C passed: full path → confirmation SMS received on real phone

### Phase 2 — Missed-Call Auto-SMS
- [ ] Workflow 03 built and deployed to n8n
- [ ] Haiku 4.5 missed-call SMS prompt verified (under 320 chars, correct tone)
- [ ] Twilio call-status webhook URL configured in Twilio console
- [ ] Twilio credential set on workflow 03 SMS node
- [ ] Test: call Twilio number from a different phone, let it ring to voicemail → SMS received within 30s

### General Production Gates
- [ ] All workflows have Retry On Fail (3×) on every external call node — DONE in 01 + 02
- [ ] Error Trigger workflow created and wired into workflow settings (recommended)
- [ ] Workflows are set to Active (not just saved)
- [ ] Form Production URL copied and ready for demo
- [ ] Real company name confirmed in all SMS messages

---

## Assumptions Made (Documented)

| Assumption | Basis | Where to Override |
|---|---|---|
| Headers on Row 1 after cleanup | Industry standard; simplest setup for n8n | Change `headerRow` value in all 3 Google Sheets nodes in workflow 01 if different |
| Lead de-dupe by phone (digits-only match) | Brief spec | Resolve & Build Lead Row code node in workflow 01 |
| Lead ID format: `LEAD-0001` (4-digit zero-padded) | Brief spec | `pad()` function in Resolve & Build Lead Row |
| Log ID format: `LOG-` + timestamp + random | Unique ID convention | Build Log Row code node in workflow 01 |
| Scoring: Hot=80-100, Warm=50-79, Cold=1-49 | Brief spec | Lead scoring system prompt in workflow 02 `Build Scoring Request` node |
| SMS confirmation: under 320 chars, no emojis, no price promises | Brief spec | Form confirmation prompt in workflow 02 `Build Confirmation Request` node |
| Sonnet 4.6 for scoring, Haiku 4.5 for SMS | Session decision (cost/quality balance) | Change model strings in the HTTP Request nodes |
| `output_config.format` (json_schema) for AI nodes | Enforced clean JSON at API level | HTTP Request node `jsonBody` parameter |
| Company name = `YOUR_COMPANY_NAME` (unknown) | Company name not provided in brief | Replace in `Build Confirmation Request` (workflow 02) and equivalent in 03 |
