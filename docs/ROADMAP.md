# Roadmap
_Last updated: 2026-06-06_

## Phase Overview

| Phase | Name | Priority | Status | Depends On |
|---|---|---|---|---|
| 1 | Google Sheets CRM | — | ✅ Done (pre-existing) | — |
| 2 | Missed-Call + Form Capture | 🔴 DEMO | ✅ **Complete — verified live** | Phase 1 |
| 3 | Scheduling + Team Approval | High | Not started | Phase 2 |
| 4 | Reminders / Reschedule / Cancel | High | Not started | Phase 3 |
| 5 | Quote Follow-up Sequence | Medium | Not started | Phase 3 |
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

## Phase 3 — Scheduling + Team Approval

### Scope
- AI agent collects qualifying details one question at a time
- Scheduling: pull available slots from `Team Schedule` tab → AI proposes → customer confirms
- Team approval: write appointment to `Appointments` tab as `Pending` → notify assigned team member → they confirm or decline
- Customer gets confirmation SMS with appointment details

### Key Workflows
- `04_ai_qualifier_agent` — multi-turn qualifying conversation
- `05_scheduling_flow` — slot availability check → book → confirm
- `06_team_approval` — notification to team member on new appointment

### Decision Required Before Build
**Team notification channel** — choose one:
- SMS to rep's mobile number (simplest, uses existing Twilio)
- n8n email node (no extra cost)
- Slack (requires Slack integration credential)

### Dependencies
- Phase 2 complete ✅
- `Team Schedule` tab populated with available slots
- `Appointments` tab column structure defined
- Team notification channel decision made

---

## Phase 4 — Reminders / Reschedule / Cancel

### Scope
- 24-hour appointment reminder SMS
- 2-hour reminder SMS
- Reschedule flow: keyword reply ("reschedule", "can't make it") → propose new slot
- Cancel flow: confirmation + optional rebooking offer

### Key Workflows
- `07_appointment_reminders` — scheduled 24h + 2h triggers before appointment
- `08_reschedule_cancel` — inbound SMS keyword routing

### Dependencies
- Phase 3 complete
- Inbound SMS webhook (Twilio → n8n) configured

---

## Phase 5 — Quote Follow-up Sequence

### Scope
- Automated follow-up at Day 1, 3, 7, 14 after quote is sent
- AI-personalized messages referencing the specific service need
- Stop sequence on customer reply or status change to `Closed Won` / `Closed Lost`
- Escalation to team after Day 14 with no response

### Key Workflows
- `09_quote_followup_sequence` — scheduled sequence with stop logic

### Dependencies
- Phase 3 complete
- Quote generation process defined

---

## Phase 6 — Retention

### Scope
- Post-job review request SMS at Day 3 and 14 after job completion
- Referral invite SMS
- Seasonal outreach (pre-storm, spring inspection offer)
- Re-engagement for cold/dormant leads

### Key Workflows
- `10_post_job_retention`
- `11_seasonal_campaigns`

### Dependencies
- Phase 4 complete
- Job completion tracking in `Jobs` tab

---

## Recommended Build Order

```
Phase 2 ✅ → Phase 3 → Phase 4 → Phase 5 → Phase 6
              [Now]    [Week 2–3]  [Week 4]
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
| JSON enforcement | `output_config.format` (API-level JSON schema) | Guaranteed parseable JSON, not prompt-dependent |
| Form hosting | n8n Form Trigger + parallel POST webhook | Demo now, website embed later at zero cost |
| Missed-call detection | n8n side only (Twilio call-status webhook) | Clean separation; Twilio only notifies, n8n decides |
| Workflow structure | Sub-workflow pattern for all CRM I/O | Modularity for future CRM swap |
| Lead creation rule | Form submission only | Missed calls → Comm Log only. No phantom leads from unanswered calls. |
| `skipLeadCreation` detection | `source === 'Phone' && logSummary === 'Missed call — auto-SMS sent'` | Keep this string identical in workflow 01 and 03 or routing breaks |
