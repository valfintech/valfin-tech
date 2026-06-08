# Roofing Lead Automation — Deliverables

n8n + Claude API + Google Sheets CRM for a single Boston-area roofing company. See the project brief (`CLAUDE.md`) for the full spec.

## Folder layout
```
workflows/   importable n8n workflow JSON
prompts/     Claude system prompts (reference copies; live copies live in the workflow Code nodes)
docs/        setup + operating guides
```

## Build status
| Phase | Status | n8n |
|---|---|---|
| 1. Google Sheets CRM | done (pre-existing) | — |
| 2. Missed-call + form capture | ✅ **Complete — live in n8n** | 3 workflows deployed |
| 3. Lead response + follow-up automation | ✅ **Complete — verified live** | 5/5 components live |
| 4. Reminders / reschedule / cancel | ✅ **Complete — 2/2 live & tested** | 2 of 2 workflows deployed |
| 5. Retention | not started | |

### All live workflows in n8n (`valfin.app.n8n.cloud`)
| Workflow | n8n ID | Description |
|---|---|---|
| `01_crm_adapter_google_sheets` | `wVRHChyFrUNRaH4M` | CRM Adapter — only workflow that touches Google Sheets. Upserts leads, mints LEAD-####, logs to Communication Log. Accepts `followUpCount` for Phase 3 sequences. |
| `02_form_capture_scoring` | `HdJc5cy8cmqMBfGR` | Form Capture + AI Scoring. n8n Form + webhook → Sonnet 4.6 scores → CRM → Haiku 4.5 confirmation SMS → hot lead alert branch. |
| `03_missed_call_auto_sms` | `u9I1bqrLW6V5LtLp` | Missed-Call Auto-SMS. Twilio call-status → no-answer/busy filter → static SMS within seconds → CRM logs Comm entry only (no Lead). |
| `04_hot_lead_alert` | `KIpMMKM8H5IZB9wb` | Hot Lead Alert. Sub-workflow called by 02 on Hot/Emergency leads. Sends instant SMS to owner. Owner phone configured (`+18575261499`). |
| `05_follow_up_sequence` | `chYfABnQdnPfiHQx` | Follow-Up Sequence. Daily 9 AM ET. Sends Day 1/3/7 SMS to New/Contacted leads, then updates status + Follow-up Count via CRM Adapter. Stops at 3 attempts. Booked leads auto-excluded. |
| `06_appointment_booking` | `ax2sMbvv0lqyJHMg` | Appointment Booking. Owner form → look up lead → write Appointments tab → customer confirmation SMS → update lead to Booked via CRM Adapter. Form: `https://valfin.app.n8n.cloud/form/eca6bfbb-ef53-4f82-b909-cbd2b818991a`. Date/Time fields upgraded to structured `date`/`dropdown` (machine-parseable for reminders); friendly display string preserved in customer SMS. **Tested end-to-end in production — confirmed working.** |
| `07_pipeline_status_digest` | `ehqNYjZRirX5L3sX` | Pipeline Status Digest. Daily 6 PM ET → reads all leads → tallies New/Contacted/Booked/Stale counts → escalates Stale leads still Hot/Warm by name + phone → reports today's new leads/bookings → single SMS digest to owner. Read-only — no Sheets writes. Owner phone configured (`+18575261499`). |
| `08_weekly_pipeline_report` | `Y7ruzhYGMhE001fr` | Weekly Pipeline Report. Monday 8 AM ET → reads all leads → computes trailing-7-day metrics (new leads, Hot/Emergency split, bookings, stale count, bookings/new ratio, top sources) → single SMS report to owner. Read-only. Owner phone synced programmatically — zero manual setup. **Test-executed live (execution 54) — confirmed working.** |
| `09_appointment_reminders` | `bJcO5ox2u190bxTr` | Appointment Reminders. Hourly check → reads Appointments tab → computes 24h (20-28h out) and 2h (1-3h out) reminder windows → personalized SMS per appointment → flags `Reminder 24h`/`Reminder 2h` columns to prevent duplicates. **Test-executed live (execution 55) — confirmed working** (correctly parsed/skipped a legacy unparseable test row with zero false-positive sends). |
| `10_reschedule_cancel` | `Bj5b3sUexa8EeQcK` | Reschedule/Cancel. Inbound SMS (Twilio Trigger) → classifies "reschedule"/"cancel" intent by keyword → finds the customer's upcoming Scheduled appointment by phone → updates Status (`Cancelled` on cancel, unchanged on reschedule) + appends a timestamped Notes entry → replies to the customer (cancel: confirms + invites rebooking; reschedule: acknowledges + promises a callback) → alerts the owner by SMS to follow up. Irrelevant texts are silently ignored. **Test-executed live via simulated inbound SMS (executions 63/64/65) — all three paths (reschedule found / cancel found / not-found) confirmed working.** |
| `11_system_health_monitor` | `U6t0b7M6lN8eA1JO` | System Health Monitor. Daily check (16:00 UTC) → reads live CRM data freshness (Appointments + Leads tabs) → flags overdue 24h/2h appointment reminders and stalled Day-1/3/7 follow-ups by exactly mirroring workflows 09's and 05's own "overdue" thresholds (plus safety buffers, so it only fires once their own definitions are violated with room to spare) → texts the *owner/operator* (not the client) one consolidated alert if anything looks stale, stays silent otherwise. Alerts the vendor to a possibly-broken scheduled run *before* the client notices — retention-critical infrastructure. Deliberately checks business-outcome data freshness rather than n8n execution metadata (zero new credentials required, strictly larger failure-mode coverage). **Test-executed live (executions 75/76) — both the alert-firing path and the clean-pass zero-SMS path confirmed working.** |

**Credentials configured in n8n UI:** Google Sheets OAuth2 · Anthropic Header Auth · Twilio API. (Twilio account intentionally remains on trial/unverified status — a deliberate, paused, non-blocking external decision.)
See `docs/PROJECT_STATUS.md` for full workflow details and known issues.

**Selling/deploying this to a new client?** Start with `docs/ONBOARDING_SOP.md` — the end-to-end runbook from "prospect says yes" to "client is live and supported," which ties together:
- `docs/PRICING_PACKAGING.md` — internal pricing anchors, ROI framing, and contract structure (reconciled with the live website's "Foundation/Growth/Built for you" custom-pricing model — see that doc's reconciliation note)
- `docs/CLIENT_ONBOARDING_INTAKE.md` — the client-facing questionnaire that collects every configuration value up front, including the one-time-only baseline data needed for the flagship case study
- `docs/CLIENT_DEPLOYMENT_GUIDE.md` — the master technical checklist of every per-client value across all 10 workflows, deployment order of operations, and a post-deploy verification plan
- `docs/CASE_STUDY_DATA_PLAN.md` — the spec for measuring and capturing the real before/after numbers the website's flagship case study (`website/src/content/results.ts`) is currently waiting on — the bridge between this track and the parallel website-build track
- `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` — a fillable contract draft that closes the literal hard gate in `ONBOARDING_SOP.md` Phase 0 ("do not proceed without a signed agreement"); **read its header before using it** — it's a structured starting point for an attorney review, not a finished legal instrument
- `docs/SMS_CONSENT_LANGUAGE_GUIDE.md` — ready-to-hand consent-language recommendations for a client's digital forms, paper forms, phone scripts, and first-touch SMS, plus the "here's exactly how our opt-out handling works" talking points that double as a trust-building selling point in the sales conversation itself
- `docs/CRM_SHEET_SCHEMA.md` + `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx` — the CRM Google Sheet's full column-by-column schema (verified live for `Leads`/`Appointments`/`Communication Log`, clearly-flagged proposals for the five tabs no workflow has built against yet) and a ready-to-clone 8-tab spreadsheet template — closes a long-standing gap where the brief referenced a `Roofing_CRM_Google_Sheets.xlsx` that was never actually in the project folder

Together these are what turn "one custom build" into a repeatable, sellable offering.

> **Note on `website/`:** a Next.js marketing site lives in this repo under `website/` and is under **active independent development in a parallel session** (already shipped: scaffold, Lead Leak Calculator, all core pages, SEO). Don't edit its content from this track — coordinate via `docs/CASE_STUDY_DATA_PLAN.md` when real deployment data is ready to hand off.

## Models
- `claude-sonnet-4-6` — lead scoring / qualification (judgment).
- `claude-haiku-4-5` — instant customer replies (volume/speed).
- All AI calls use `output_config.format` (JSON schema) so every node returns clean, parseable JSON.
