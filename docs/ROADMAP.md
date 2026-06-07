# Roadmap
_Last updated: 2026-06-07 — Phase 4 underway (Workflow 09 live)_

## Phase Overview

| Phase | Name | Priority | Status | Depends On |
|---|---|---|---|---|
| 1 | Google Sheets CRM | — | ✅ Done (pre-existing) | — |
| 2 | Missed-Call + Form Capture | 🔴 DEMO | ✅ **Complete — verified live** | Phase 1 |
| 3 | Lead Response + Follow-Up Automation | High | ✅ **Complete (5/5) — verified live** | Phase 2 |
| 4 | Reminders / Reschedule / Cancel | High | 🔄 **In progress (1/2)** — Appointment Reminders (09) live & tested | Phase 3 |
| 5 | Retention (reviews, referrals, seasonal) | Low | Not started | Phase 4 |

> Note: the original Phase 4/5/6 numbering in this roadmap ("Appointment Booking + Pipeline" as Phase 4) was superseded once Appointment Booking and Pipeline Status Automation were folded into Phase 3 (workflows 06–08) — they delivered more value sooner there, alongside the rest of the lead-response stack. Phase numbering below has been compressed accordingly: former Phase 5 (Reminders/Reschedule/Cancel) is now Phase 4, and former Phase 6 (Retention) is now Phase 5.

---

## Phase 2 — Missed-Call + Form Capture ✅ COMPLETE

Verified against live n8n on 2026-06-06.

### Delivered

| Workflow | n8n ID | What It Does |
|---|---|---|
| CRM Adapter | `wVRHChyFrUNRaH4M` | Google Sheets sub-workflow. Upserts leads, mints LEAD-####, logs comm entries. `skipLeadCreation` routing ensures missed calls never create Lead records. |
| Form Capture + AI Scoring | `HdJc5cy8cmqMBfGR` | Dual entry (n8n form + webhook) → Sonnet 4.6 scores → CRM upsert → Haiku 4.5 confirmation SMS → outbound log. |
| Missed-Call Auto-SMS | `u9I1bqrLW6V5LtLp` | Twilio call-status → no-answer/busy filter → static SMS → Comm Log only (no Lead). |

### Completion Criteria (All Met)
- [x] Form submitted → lead in Sheets → AI score → confirmation SMS sent
- [x] Missed call → auto SMS within seconds → Comm Log entry written (no Lead created)
- [x] All workflows active in n8n
- [x] Google Sheets, Anthropic, and Twilio credentials set
- [x] Twilio call-status webhook URL configured
- [x] `skipLeadCreation` routing live and tested

### Open Item (Non-Blocking)
- [ ] Twilio toll-free number verification — error 30032 blocks SMS delivery at carrier level. Complete at twilio.com/console. Workflows are ready and correct. **User confirmed (2026-06-07): explicitly non-blocking — external infrastructure item, do not block development on it.**

---

## Phase 3 — Lead Response + Follow-Up Automation ✅ COMPLETE (5/5)

**Goals:** Reduce lead response time, ensure no qualified lead is forgotten, increase appointment booking rate, give the owner pipeline visibility without opening Sheets.

Verified against live n8n on 2026-06-07. All five components published, active, and (where execution-testable) confirmed against live data.

### Delivered

| Workflow | n8n ID | What It Does |
|---|---|---|
| Hot Lead Alert | `KIpMMKM8H5IZB9wb` | Sub-workflow called by 02 when score is Hot or urgency is Emergency. Sends instant SMS to owner with lead name, service, address, and phone. Owner phone `+18575261499` set and live. |
| Follow-Up Sequence | `chYfABnQdnPfiHQx` | Daily 9 AM ET. Reads all New/Contacted leads, filters by time thresholds (Day 1/3/7), sends personalized static SMS templates, updates lead status + Follow-up Count via CRM Adapter. Stops at 3 attempts or status change. Booked leads auto-excluded. |
| Appointment Booking | `ax2sMbvv0lqyJHMg` | Owner-facing n8n form. Looks up lead by ID, writes row to Appointments tab, sends customer confirmation SMS, updates lead status to Booked via CRM Adapter. **Tested end-to-end in production — confirmed working** (Lead → Booked, Appointment row, Comm Log entry, Follow-Up + Hot Alert unaffected). |
| Pipeline Status Digest | `ehqNYjZRirX5L3sX` | Daily 6 PM ET. Reads all leads, tallies counts by status (New/Contacted/Booked/Stale), escalates Stale leads still Hot/Warm by name + phone, reports today's new leads and bookings — single SMS digest to owner. Read-only; no Sheets writes. Owner phone `+18575261499` set and live. |
| Weekly Pipeline Report | `Y7ruzhYGMhE001fr` | Weekly Monday 8 AM ET. Reads all leads, computes trailing-7-day metrics (new leads, Hot/Emergency split, bookings, stale count, bookings/new ratio, top lead sources) — single SMS report to owner. Owner phone synced programmatically (zero manual setup). **Test-executed live (execution 54): correct report computed and SMS queued successfully.** |

### Phase 3 Completion Criteria — All Met ✅
- [x] Hot leads trigger immediate owner SMS notification
- [x] Automated Day 1 / Day 3 / Day 7 follow-up sequence running
- [x] Appointment Booking Workflow live — form, Appointments tab write, customer SMS, lead status update
- [x] Appointment Booking verified end-to-end in production (Lead → Booked, Appointment row, Comm Log, Follow-Up + Hot Alert unaffected)
- [x] Every interaction logged to Communication Log
- [x] CRM Adapter supports `followUpCount` from callers
- [x] Booked leads automatically excluded from follow-up sequence
- [x] Daily pipeline digest live — counts by status + Stale/Hot escalation + today's activity
- [x] Weekly pipeline report live — trailing 7-day metrics, tested against live data
- [x] Owner phone (`+18575261499`) configured and confirmed working across workflows 04, 07, 08

**Phase 3 has zero open setup items.** All `OWNER_PHONE_HERE` placeholders are resolved.

---

## Phase 4 — Reminders / Reschedule / Cancel 🔄 IN PROGRESS (1/2)

### Scope
- 24-hour appointment reminder SMS
- 2-hour reminder SMS
- Reschedule flow: keyword reply ("reschedule", "can't make it") → propose new slot
- Cancel flow: confirmation + optional rebooking offer

### Key Workflows
| Workflow | n8n ID | Status | What It Does |
|---|---|---|---|
| `09_appointment_reminders` | `bJcO5ox2u190bxTr` | ✅ **Live — tested live (execution 55)** | Hourly schedule → reads Appointments tab → computes 24h (20–28h out) and 2h (1–3h out) reminder windows from parsed `Appt Date`/`Appt Time` → sends personalized SMS per appointment → flags `Reminder 24h`/`Reminder 2h` columns to prevent duplicate sends. |
| `10_reschedule_cancel` | _planned_ | 🔄 Up next | Inbound SMS keyword routing — customer replies "reschedule"/"cancel" to a reminder → proposes new slot or confirms cancellation + optional rebooking offer. |

### Prerequisite Fix (Completed 2026-06-07)
Workflow 06's Booking Form originally captured `Appointment Date`/`Appointment Time` as **free-text** fields (placeholders "e.g. Tuesday, June 10" / "e.g. 2:00 PM"), producing strings that could not be reliably parsed for computing "24 hours before" / "2 hours before" reminder timing. Fixed at the source: the form now uses a `date` field type (`YYYY-MM-DD`, machine-parseable) and a `dropdown` field type (fixed hourly time slots, 8 AM–5 PM). `Build Booking Payload` derives a friendly display string (`formatFriendlyDate()` → "Tuesday, June 10") for the customer-facing confirmation SMS, so the user experience is unchanged while the underlying stored data is now parseable. Republished and live-tested.

### Dependencies
- ✅ Phase 3 appointment booking complete (workflow 06, `ax2sMbvv0lqyJHMg`, tested end-to-end)
- ✅ Workflow 06 form fields upgraded to structured date/dropdown — prerequisite for workflow 09, delivered 2026-06-07
- Inbound SMS webhook (Twilio → n8n) — **compatible with current trial-account status; inbound SMS does not require toll-free verification (only outbound to unverified numbers is restricted)**

---

## Phase 5 — Retention

### Scope
- Post-job review request SMS at Day 3 and 14 after job completion
- Referral invite SMS
- Seasonal outreach (pre-storm, spring inspection offer)
- Re-engagement for cold/dormant leads

### Key Workflows
- `11_post_job_retention`
- `12_seasonal_campaigns`

### Dependencies
- Phase 4 complete
- Job completion tracking in `Jobs` tab

---

## Recommended Build Order

```
Phase 2 ✅ → Phase 3 ✅ COMPLETE (Hot Alert + Follow-Up + Booking + Pipeline Digest + Weekly Report, all live & tested)
   → Phase 4 🔄 IN PROGRESS (Appointment Reminders 09 ✅ live & tested → Reschedule/Cancel 10 up next)
   → Phase 5 (Retention)
```

**Rule of thumb:** Each phase must be live and tested before building the next.
The CRM Adapter (`wVRHChyFrUNRaH4M`) is the foundation — all workflows call it. Never write directly to Google Sheets from a non-adapter workflow.

**Owner-notification pattern (established across 04/07/08):** When adding a new SMS-sending workflow, prefer reading the live `OWNER_PHONE` value from an already-configured workflow (e.g. `KIpMMKM8H5IZB9wb` → `Build Alert Message`) and patching it in via `update_workflow` `setNodeParameter` — this avoids a repeat manual setup step for the user. Only fall back to a placeholder + manual-action checklist if no prior workflow has the value yet.

---

## Architectural Decisions (Locked)

| Decision | Choice | Rationale |
|---|---|---|
| CRM backend | Google Sheets (now) → GoHighLevel (future) | Swap isolated to CRM Adapter only |
| AI scoring | Claude Sonnet 4.6 | Judgment calls warrant mid-tier model |
| AI SMS copy — form confirmation | Claude Haiku 4.5 | Volume/speed, lower cost |
| AI SMS copy — missed call | None — static message | User decision after testing: simpler, faster, zero cost |
| AI SMS copy — follow-up sequences | None — static templates | Reliability, zero cost, consistent batch behavior |
| JSON enforcement | `output_config.format` (API-level JSON schema) | Guaranteed parseable JSON, not prompt-dependent |
| Form hosting | n8n Form Trigger + parallel POST webhook | Demo now, website embed later at zero cost |
| Missed-call detection | n8n side only (Twilio call-status webhook) | Clean separation; Twilio only notifies, n8n decides |
| Workflow structure | Sub-workflow pattern for all CRM I/O | Modularity for future CRM swap |
| Lead creation rule | Form submission only | Missed calls → Comm Log only. No phantom leads from unanswered calls. |
| `skipLeadCreation` detection | `source === 'Phone' && logSummary === 'Missed call — auto-SMS sent'` | Keep this string identical in workflow 01 and 03 or routing breaks |
| Owner notification channel | SMS via Twilio (Phase 3) | Simplest, uses existing credentials. Designed for future Slack/email expansion. |
| Hot lead threshold | `temperature === 'Hot'` OR `urgency === 'Emergency'` | Captures both scored and keyword-emergency leads |
| Follow-up stop conditions | Count ≥ 3 OR status not in {New, Contacted} | Prevents over-messaging; status change by any path stops the sequence |
| Pipeline digest schedule | Daily 6 PM ET (22:00 UTC) | End-of-business-day summary — captures the full day's activity before owner's evening review |
| Pipeline digest delivery | SMS, plain text, no AI, read-only | Reliability + zero cost; matches static-template precedent from workflows 03/05/06; GSM-7 encoding minimizes segment count |
| Stale escalation scope | Stale AND Temperature in {Hot, Warm} only | Surfaces revenue-at-risk leads without noise from expected Cold churn |
| Weekly report delivery channel | SMS (not email) | No email credential exists in n8n; SMS reuses proven Twilio infrastructure with zero new setup. Roadmap explicitly allowed either channel. |
| Weekly report schedule | Monday 8 AM ET (13:00 UTC) | Start-of-week look-back at the prior 7 days — gives the owner a trend view to open the week with |
| New-workflow owner-phone setup | Read live value from an existing configured workflow + patch via `update_workflow`, when possible | Eliminates repeat manual setup steps (used for workflow 08 — zero manual action required, unlike 04/07) |
| Booking form date/time capture | Structured `date` + `dropdown` fields (not free text) | Free-text values like "Tuesday, June 10" / "2:00 PM" placeholders are not reliably parseable for reminder-time math; structured fields guarantee `YYYY-MM-DD` / fixed time-slot strings while a derived friendly-display string keeps the customer SMS unchanged |
| Reminder schedule cadence | Hourly check (not per-appointment scheduling) | Simpler, stateless, self-healing — a single recurring poll covers both the 24h and 2h windows for every appointment without per-appointment trigger management; 4–8 hour windows (20–28h, 1–3h) tolerate the hourly granularity |
| Reminder idempotency | `Reminder 24h`/`Reminder 2h` sheet flags written with ISO timestamps, checked before every send | Prevents duplicate SMS on repeat hourly runs; matches the reserved-column design already present in the Appointments tab from workflow 06 |
| Reminder send failure isolation | Each reminder processed independently in a `splitInBatches(1)` loop with `retryOnFail` | One customer's bad phone number or a transient Twilio error doesn't block reminders to other customers in the same run |
