# Project Status
_Last updated: 2026-06-06 — verified against live n8n workflows_

## Current Phase
**Phase 2 — Missed-Call + Form Capture** ✅ **COMPLETE AND VERIFIED**

All three workflows are live, active, credentialed, and confirmed through end-to-end testing.
Phase 3 (Scheduling + Team Approval) is the recommended next build.

---

## Live Workflows

| Workflow | n8n ID | n8n URL | Status |
|---|---|---|---|
| CRM Adapter (Google Sheets) | `wVRHChyFrUNRaH4M` | https://valfin.app.n8n.cloud/workflow/wVRHChyFrUNRaH4M | ✅ Active — sub-workflow only |
| Form Capture + AI Scoring | `HdJc5cy8cmqMBfGR` | https://valfin.app.n8n.cloud/workflow/HdJc5cy8cmqMBfGR | ✅ Active — form + webhook live |
| Missed-Call Auto-SMS | `u9I1bqrLW6V5LtLp` | https://valfin.app.n8n.cloud/workflow/u9I1bqrLW6V5LtLp | ✅ Active — Twilio webhook live |

---

## Verified Architecture

### Business Rules (Confirmed Live)

| Event | Lead Record | Comm Log | AI Used |
|---|---|---|---|
| Website form submission | ✅ Created / updated | ✅ Written | Sonnet 4.6 (score) + Haiku 4.5 (SMS) |
| Missed call (no-answer / busy) | ❌ Not created | ✅ Written | None — static SMS |

---

## Workflow Details

### Workflow 01 — CRM Adapter (`wVRHChyFrUNRaH4M`)

**Flow (current saved version — used by all sub-workflow calls):**
```
Input → Get Leads → Resolve & Build Lead Row → IF skipLeadCreation?
  true  → Build Log Row → Append Comm Log → Return   (missed call path)
  false → Upsert Lead  → Build Log Row → Append Comm Log → Return   (form path)
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

> **Version note:** n8n shows `activeVersionId ≠ versionId`. The published/active version has the original linear flow (no IF node). This is harmless — the workflow has no external trigger, and `executeWorkflow` always runs the current saved version. The `skipLeadCreation` routing is live and working for all sub-workflow callers.

---

### Workflow 02 — Form Capture + AI Scoring (`HdJc5cy8cmqMBfGR`)

**Flow:**
```
Website Form ──┐
               ├─→ Normalize Lead → Build Scoring Request → Claude - Score Lead (Sonnet 4.6)
Website Webhook┘         → Parse Score → CRM: Upsert + Log Inbound
                         → Build Confirmation Request → Claude - Confirmation SMS (Haiku 4.5)
                         → Parse Confirmation → Send Confirmation SMS
                         → Mark Outbound Log → CRM: Log Outbound SMS
```

| Property | Value |
|---|---|
| Form URL | `https://valfin.app.n8n.cloud/` (webhookId `04605924-a4ad-44ef-94cf-c829cdc5e8fd`) |
| Webhook URL | `https://valfin.app.n8n.cloud/webhook/roofing-intake` |
| Scoring model | `claude-sonnet-4-6` |
| Score output | `lead_score` (1–100), `temperature` (Hot/Warm/Cold), `urgency`, `detected_service`, `summary`, `recommended_next_step` |
| Confirmation SMS model | `claude-haiku-4-5` |
| Twilio from | `+18889839308` |
| Company in SMS prompt | `Valfin Tech` |
| CRM Adapter calls | 2 — inbound lead+log, then outbound SMS log |

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

## Known Issues

| Issue | Severity | Action |
|---|---|---|
| Twilio error 30032 — toll-free SMS blocked by carrier | Medium | **User action:** complete toll-free number verification at twilio.com/console. Workflows are correct and functional; this is a carrier-level hold on unverified toll-free numbers. |
| CRM Adapter published version is outdated | Low | No action needed. No external trigger means the published version never runs. Optional: open workflow 01 in n8n UI and click Publish to sync the active version with the current one. |
| Local JSON files in repo out of sync with live n8n | Low | Does not affect production. See `PROJECT_AUDIT.md` for details. |

---

## Next: Phase 3 — Scheduling + Team Approval

**One decision needed before build:** team notification channel — SMS to rep's mobile, n8n email, or Slack?

See `ROADMAP.md` for full scope and `PROJECT_AUDIT.md` for Phase 3 pre-build checklist.
