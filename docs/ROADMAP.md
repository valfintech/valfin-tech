# Roadmap
_Last updated: 2026-06-05_

## Phase Overview

| Phase | Name | Priority | Status | Depends On |
|---|---|---|---|---|
| 1 | Google Sheets CRM | — | ✅ Done (pre-existing) | — |
| 2 | Missed-Call + Form Capture | 🔴 DEMO PRIORITY | 🔄 In Progress | Phase 1 |
| 3 | Scheduling + Team Approval | High | Not started | Phase 2 |
| 4 | Reminders / Reschedule / Cancel | High | Not started | Phase 3 |
| 5 | Quote Follow-up Sequence | Medium | Not started | Phase 3 |
| 6 | Retention (reviews, referrals, seasonal) | Low | Not started | Phase 5 |

---

## Phase 2 — Missed-Call + Form Capture (Current)

### Remaining Items
1. **Workflow 03: Missed-Call → Auto-SMS**
   - Twilio call-status webhook (POST trigger in n8n)
   - Validate call status is `no-answer`, `busy`, or `completed` w/ voicemail flag
   - Extract caller phone from Twilio payload (`Called` or `From` field)
   - Haiku 4.5 writes "sorry we missed your call" SMS using `output_config.format` (same pattern as workflow 02)
   - Twilio sends SMS
   - CRM Adapter: create/update minimal lead + log outbound SMS
   - Target: SMS sent within 30 seconds of missed call

2. **n8n deployment of all 3 workflows via MCP**
   - Deploy 01 → get real ID → wire into 02 and 03
   - Deploy 02, 03 with real adapter ID

3. **Credentials wiring in n8n UI** (user action)
   - Google Sheets OAuth2, Anthropic Header Auth, Twilio API

4. **Twilio call-status URL configuration** (user action, after 03 deploy)

5. **End-to-end test** (Tests A, B, C from `phase2_setup.md`)

### Phase 2 Completion Criteria
- [ ] Form submitted → lead in Sheets → AI score → confirmation SMS received on real phone
- [ ] Missed call → auto SMS within 30s → lead created in Sheets → Communication Log entry
- [ ] All workflows active in n8n

---

## Phase 3 — Scheduling + Team Approval

### Scope
- AI agent asks ONE qualifying question at a time to confirm appointment details
- Scheduling flow: available slots pulled from `Team Schedule` tab → AI proposes time → customer confirms
- Team approval: appointment created in `Appointments` tab with `Pending` status → notification to team (SMS or email) → team confirms/declines
- Customer gets confirmation SMS with appointment details

### Key Workflows
- `04_ai_qualifier_agent.json` — multi-turn qualifying conversation (one question at a time)
- `05_scheduling_flow.json` — slot availability check → book → confirm
- `06_team_approval.json` — new appointment notification to assigned team member

### Dependencies
- Phase 2 complete (lead + CRM adapter working)
- `Team Schedule` tab populated with available slots
- Decision needed: team notification channel (SMS to rep's mobile vs. n8n email vs. Slack)

---

## Phase 4 — Reminders / Reschedule / Cancel

### Scope
- 24-hour appointment reminder SMS (Haiku 4.5)
- 2-hour reminder SMS
- Reschedule flow triggered by keyword reply ("reschedule", "can't make it", etc.)
- Cancel flow with cancellation confirmation + optional rebooking offer

### Key Workflows
- `07_appointment_reminders.json` — scheduled triggers (24h + 2h before appointment)
- `08_reschedule_cancel.json` — inbound SMS keyword routing

### Dependencies
- Phase 3 complete
- Inbound SMS handling (Twilio webhook routing for replies)

---

## Phase 5 — Quote Follow-up Sequence

### Scope
- Automated follow-up sequence after a quote is sent (Days 1, 3, 7, 14)
- AI-personalized follow-up messages referencing their specific service need
- Stop sequence on customer reply or when `Status` changes to `Closed Won` / `Closed Lost`
- Escalation to team after Day 14 with no response

### Key Workflows
- `09_quote_followup_sequence.json` — scheduled sequence with stop logic

### Dependencies
- Phase 3 complete
- Quote generation process defined

---

## Phase 6 — Retention (Reviews, Referrals, Seasonal)

### Scope
- Post-job review request SMS (Google/Yelp link) at 3 days and 14 days after job completion
- Referral program invite SMS
- Seasonal outreach (pre-storm season check-in, spring inspection offer)
- Re-engagement for cold/dormant leads

### Key Workflows
- `10_post_job_retention.json`
- `11_seasonal_campaigns.json`

### Dependencies
- Phase 4 complete
- Job completion tracking in `Jobs` tab

---

## Recommended Build Order

```
Phase 2 (finish) → Phase 3 → Phase 4 → Phase 5 → Phase 6
     ↓                 ↓           ↓
 [DEMO NOW]      [Week 2-3]    [Week 4]
```

**Rule of thumb:** Each phase must be live and tested before building the next. The CRM adapter is the foundation — never bypass it for direct Sheets access.

---

## Architectural Decisions (Locked)

| Decision | Choice | Rationale |
|---|---|---|
| CRM backend | Google Sheets (now) → GoHighLevel (future) | Swap isolated to `01_crm_adapter` only |
| AI scoring | Claude Sonnet 4.6 | Judgment calls warrant mid-tier model |
| AI SMS copy | Claude Haiku 4.5 | Volume/speed, lower cost |
| JSON enforcement | `output_config.format` (API-level) | Guaranteed parseable JSON, not prompt-dependent |
| Form hosting | n8n Form Trigger (now) + parallel webhook (later) | Demo today, website embed later at zero cost |
| Missed-call detection | n8n side only; Twilio configured by user | Clean separation of concerns |
| Workflow structure | Sub-workflow pattern for CRM | Modularity for future CRM swap |
