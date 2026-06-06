# Roadmap
_Last updated: 2026-06-06_

## Phase Overview

| Phase | Name | Priority | Status | Depends On |
|---|---|---|---|---|
| 1 | Google Sheets CRM | — | ✅ Done (pre-existing) | — |
| 2 | Missed-Call + Form Capture | 🔴 DEMO | ✅ **Complete — verified live** | Phase 1 |
| 3 | Lead Response + Follow-Up Automation | High | 🔄 **In Progress (2/5 complete)** | Phase 2 |
| 4 | Appointment Booking + Pipeline | High | Not started | Phase 3 |
| 5 | Reminders / Reschedule / Cancel | High | Not started | Phase 4 |
| 6 | Retention (reviews, referrals, seasonal) | Low | Not started | Phase 5 |

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
- [ ] Twilio toll-free number verification — error 30032 blocks SMS delivery at carrier level. Complete at twilio.com/console. Workflows are ready and correct.

---

## Phase 3 — Lead Response + Follow-Up Automation 🔄 IN PROGRESS

**Goals:** Reduce lead response time, ensure no qualified lead is forgotten, increase appointment booking rate.

### Delivered

| Workflow | n8n ID | What It Does |
|---|---|---|
| Hot Lead Alert | `KIpMMKM8H5IZB9wb` | Sub-workflow called by 02 when score is Hot or urgency is Emergency. Sends instant SMS to owner with lead name, service, address, and phone. |
| Follow-Up Sequence | `chYfABnQdnPfiHQx` | Daily 9 AM ET. Reads all New/Contacted leads, filters by time thresholds (Day 1/3/7), sends personalized static SMS templates, updates lead status + Follow-up Count via CRM Adapter. Stops at 3 attempts or status change. Booked leads auto-excluded. |
| Appointment Booking | `ax2sMbvv0lqyJHMg` | Owner-facing n8n form. Looks up lead by ID, writes row to Appointments tab, sends customer confirmation SMS, updates lead status to Booked via CRM Adapter. |

### Phase 3 Completion Criteria
- [x] Hot leads trigger immediate owner SMS notification
- [x] Automated Day 1 / Day 3 / Day 7 follow-up sequence running
- [x] Appointment Booking Workflow live — form, Appointments tab write, customer SMS, lead status update
- [x] Every interaction logged to Communication Log
- [x] CRM Adapter supports `followUpCount` from callers
- [x] Booked leads automatically excluded from follow-up sequence
- [ ] **SETUP REQUIRED:** Replace `OWNER_PHONE_HERE` in workflow 04 `Build Alert Message` node with real E.164 phone number
- [ ] Pipeline Status Automation (07)
- [ ] Reporting / Dashboarding (08)

### Remaining Phase 3 Work

**Workflow 07 — Pipeline Status Automation:**
- Status change triggers → team notification
- Stale lead escalation
- Booked → job created workflow

**Workflow 08 — Reporting:**
- Weekly summary: new leads, appointments booked, follow-up counts
- Delivered via SMS or email to owner

---

## Phase 4 — Reminders / Reschedule / Cancel

### Scope
- 24-hour appointment reminder SMS
- 2-hour reminder SMS
- Reschedule flow: keyword reply ("reschedule", "can't make it") → propose new slot
- Cancel flow: confirmation + optional rebooking offer

### Key Workflows
- `09_appointment_reminders` — scheduled 24h + 2h triggers before appointment
- `10_reschedule_cancel` — inbound SMS keyword routing

### Dependencies
- Phase 3 appointment booking complete
- Inbound SMS webhook (Twilio → n8n) configured

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
Phase 2 ✅ → Phase 3 (Hot Alert ✅ + Follow-Up ✅ + Booking ✅) → Phase 4 → Phase 5
```

**Rule of thumb:** Each phase must be live and tested before building the next.
The CRM Adapter (`wVRHChyFrUNRaH4M`) is the foundation — all workflows call it. Never write directly to Google Sheets from a non-adapter workflow.

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
