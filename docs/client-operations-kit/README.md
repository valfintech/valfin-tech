# Valfin Tech — Client Operations Kit

The complete operating system for everything that happens after a client says "yes." Every document below is production-ready and immediately usable with a real client.

**Last built:** 2026-06-15  
**Version:** 1.0 — covers Foundation, Growth, and Built-for-you tiers, 13 workflows (Wf 01–13, V1.1)

---

## Founder Quick-Start: "I just landed a client. What do I do next?"

**Day 0 — Same day as yes:**
1. Send **Welcome Email** → `templates/COMMUNICATION_SCRIPTS.docx` (Phase 1)
2. Send **Free Trial Agreement** → `agreements/FREE_TRIAL_AGREEMENT.docx` (or PDF)
3. Attach the **Statement of Work** → `agreements/STATEMENT_OF_WORK_TEMPLATE.docx`
4. Do not proceed until the FTA is signed.

**Day 0–1 — Agreement signed:**
5. Send **Client Intake Form** → `intake/CLIENT_INTAKE_FORM.docx`
6. Send **Access Request Checklist** alongside it → `intake/ACCESS_REQUEST_CHECKLIST.docx`
7. Schedule the kickoff call (within 2–3 business days)
8. **★ At the kickoff call: capture the baseline metrics (Intake D5) — missed calls/month and jobs/month BEFORE the system. You cannot recover this number after go-live.**

**Day 1 — Before touching n8n:**
9. Open **Internal Build Brief** → `implementation/INTERNAL_BUILD_BRIEF_TEMPLATE.docx`
10. Transfer every intake answer into it
11. Start Twilio carrier verification immediately — it's the long-lead item

**Day 1–5 — Build and QA:**
12. Follow the Internal Build Brief Section 8 (build progress tracker)
13. Run the **QA Checklist** → `qa/IMPLEMENTATION_QA_CHECKLIST.docx`
14. Do not go live until every QA item passes AND Twilio verification is confirmed

**Day 5–14 — Go-live:**
15. Fill in the **Welcome Packet** → `templates/WELCOME_PACKET.docx`
16. Run the go-live walkthrough call using **Kickoff Agenda Part 2** → `templates/KICKOFF_AGENDA.docx`
17. Read 2–3 real SMS scripts aloud on the call
18. Flip workflows to active after the call

**Day 30–60 — Trial review:**
19. Pull numbers from the system, fill in the **Results Report** → `reporting/RESULTS_REPORT_TEMPLATE.docx`
20. Build the **Success Review Presentation** → `presentations/SUCCESS_REVIEW_PRESENTATION_TEMPLATE.pptx`
21. Run the review call (script in `templates/COMMUNICATION_SCRIPTS.docx` — Trial Review)
22. If they say yes → send **Master Service Agreement** same-day → `agreements/MASTER_SERVICE_AGREEMENT.docx`

**Month 2+ — Ongoing:**
23. Monthly Review every month → `reporting/MONTHLY_REVIEW_TEMPLATE.docx`
24. Any scope changes → **Change Request Form first** → `templates/CHANGE_REQUEST_FORM.docx`
25. If relationship ends → **Offboarding Checklist** → `offboarding/CLIENT_OFFBOARDING_CHECKLIST.docx`

---

## Complete File Index

### Master Playbook (start here)

| File | Purpose | When to Use |
|---|---|---|
| `CLIENT_LIFECYCLE_PLAYBOOK.docx` | Master 10-phase operating manual with checklists. Open on Day 0 and check off phases as you complete them. | Every new client, every phase |

### Presentations

| File | Purpose | When to Use |
|---|---|---|
| `presentations/Valfin_Client_Delivery_Playbook.pptx` | 19-slide exec deck covering the complete lifecycle, all 17 required topics. Use for internal orientation and as a reference for onboarding new team members. | Internal reference / team onboarding |
| `presentations/SUCCESS_REVIEW_PRESENTATION_TEMPLATE.pptx` | 10-slide trial results presentation. Fill in [brackets] with real numbers before the review meeting. | Phase 7 — trial review meeting |

### Agreements (send in this order)

| File | Purpose | When to Use |
|---|---|---|
| `agreements/FREE_TRIAL_AGREEMENT.docx` + `.pdf` | Plain-English trial agreement. No fees, cancel anytime, no obligation to continue. | Day 0 — must be signed before any build work begins |
| `agreements/STATEMENT_OF_WORK_TEMPLATE.docx` | Scope, workflows, milestones, and acceptance criteria for this specific client and tier. Attach to both the FTA and the MSA. | Day 0 (attach to FTA) + Phase 8 (attach to MSA) |
| `agreements/MASTER_SERVICE_AGREEMENT.docx` + `.pdf` | Full paid service contract. **Flagged for attorney review** — do not use with first paying client until reviewed. | Phase 8 — paid conversion only |

### Intake (send together, Day 0–1)

| File | Purpose | When to Use |
|---|---|---|
| `intake/CLIENT_INTAKE_FORM.docx` | 9-section, 40+ question onboarding form. Covers identity, phones, hours, lead handling, brand voice, tools, compliance, goals, and contacts. Send or walk through on the kickoff call. | Day 0–1, post-signature |
| `intake/ACCESS_REQUEST_CHECKLIST.docx` | All access items classified as Required / Optional / Depends on tier, with written justifications for each. | Day 0–1, alongside intake |

### Implementation (internal use)

| File | Purpose | When to Use |
|---|---|---|
| `implementation/INTERNAL_BUILD_BRIEF_TEMPLATE.docx` | Internal synthesis doc — transfer every intake answer into this before touching n8n. Covers identity/contact values, brand voice, approved SMS copy, schedule UTC offsets, business-rule constants, compliance checklist, credentials log, and build progress tracker. | After intake is returned — before build begins |

### QA (non-negotiable gate)

| File | Purpose | When to Use |
|---|---|---|
| `qa/IMPLEMENTATION_QA_CHECKLIST.docx` | 14-section pre-launch testing checklist covering forms, SMS, routing, CRM, error handling, follow-up, reporting, escalation, and end-to-end smoke test. Both conditions must be met before go-live: all items pass + Twilio carrier verified. | Phase 5 — before every go-live |

### Reporting

| File | Purpose | When to Use |
|---|---|---|
| `reporting/RESULTS_REPORT_TEMPLATE.docx` | Trial performance summary — 6 metrics, before/after comparison, ROI math, workflow activity, and conversion ask. Pull numbers from the system; do not estimate. | Phase 7 — trial review meeting (Day 30–60) |
| `reporting/MONTHLY_REVIEW_TEMPLATE.docx` | Monthly cadence template with metrics table, system health check, 30-min call agenda, decisions/actions log, and internal renewal health assessment. | Phase 9 — every month, ongoing |

### Templates

| File | Purpose | When to Use |
|---|---|---|
| `templates/COMMUNICATION_SCRIPTS.docx` | All client-facing message scripts: welcome email, agreement follow-up, payment confirmation, intake send, kickoff confirmation, build started, go-live confirmation, post-launch check-in, week-1 check-in, trial review invitation, conversion (yes/not yet/no), monthly review invitation and summary. Plus reference table of all automated system SMS templates. | Throughout the entire lifecycle |
| `templates/KICKOFF_AGENDA.docx` | Two-part agenda: Part 1 (kickoff call — intake walkthrough, baseline capture, access setup) and Part 2 (go-live walkthrough — Welcome Packet reading, system activation). | Phase 2 (kickoff) + Phase 6 (go-live) |
| `templates/WELCOME_PACKET.docx` | Fillable go-live leave-behind covering: what the system does, what you'll receive and when, how to read the CRM, what your customers experience, how to report issues, and week-1 FAQ. Read together on the walkthrough call, then leave with the client. | Phase 6 — go-live walkthrough call |
| `templates/CLIENT_CONTACT_DIRECTORY.docx` | Client-side and Valfin-side contacts, third-party service contacts, access log, and change log. Keep current throughout the engagement — update within 24 hours of any contact change. Required for clean offboarding. | Day 0 setup, updated throughout |
| `templates/CHANGE_REQUEST_FORM.docx` | Required before any out-of-scope work begins. Documents what's being added, cost, timeline, and both-party sign-off. References MSA §9. | Any time a client requests work outside the SOW |
| `templates/CLIENT_PROPOSAL_TEMPLATE.docx` | Existing proposal template (copied from docs/). Use with PROPOSAL_PLAYBOOK.md for pre-signing conversations. | Pre-signature (prospect phase) |

### Offboarding

| File | Purpose | When to Use |
|---|---|---|
| `offboarding/CLIENT_OFFBOARDING_CHECKLIST.docx` | Complete wind-down checklist: communication, data export, access revocation (all systems), provider-side data deletion, final invoicing, and internal retrospective notes. | Phase 10 — whenever a client relationship ends |

---

## Order of Use (by phase)

```
Day 0:   FREE_TRIAL_AGREEMENT + STATEMENT_OF_WORK_TEMPLATE + COMMUNICATION_SCRIPTS (welcome email)
Day 0-1: CLIENT_INTAKE_FORM + ACCESS_REQUEST_CHECKLIST
Day 2-3: KICKOFF_AGENDA (Part 1) — capture baseline metrics at this call
Day 1:   INTERNAL_BUILD_BRIEF_TEMPLATE (fill in before touching n8n)
Day 1-5: [build] → IMPLEMENTATION_QA_CHECKLIST (run before any go-live)
Day 5-14: WELCOME_PACKET + KICKOFF_AGENDA (Part 2) — go-live walkthrough
Week 1:  COMMUNICATION_SCRIPTS (post-launch check-in, week-1 check-in)
Day 30-60: RESULTS_REPORT_TEMPLATE + SUCCESS_REVIEW_PRESENTATION_TEMPLATE
Conversion: MASTER_SERVICE_AGREEMENT + STATEMENT_OF_WORK_TEMPLATE (updated)
Monthly: MONTHLY_REVIEW_TEMPLATE
As needed: CHANGE_REQUEST_FORM, CLIENT_CONTACT_DIRECTORY (keep current)
End: CLIENT_OFFBOARDING_CHECKLIST
```

---

## Legal Items Requiring Attorney Review

Before using these documents with a real client, have an attorney review:

| Document | Sections That Need Review |
|---|---|
| `agreements/MASTER_SERVICE_AGREEMENT.docx` | §8 Limitation of Liability & Disclaimers (flagged in document), §5 Data & Privacy, §6 Compliance/TCPA, §10 General Provisions (Governing Law, Assignment) |
| `agreements/FREE_TRIAL_AGREEMENT.docx` | §7 Confidentiality, §8 No Obligation to Continue / termination-at-will, §10 Client Data Ownership — lighter-touch than MSA but still warrants a quick review |
| All agreements | Replace all `[STATE]` placeholders with your actual governing-law state |

The MSA template contains a prominent "READ FIRST — ATTORNEY REVIEW REQUIRED" callout box at the top. Do not remove it until legal review is complete.

---

## Notes for Valfin Tech V1.1 Compatibility

All documents are built against the V1.1 system state (2026-06-15):
- 13 active workflows (Wf 01–13, including Wf 13 Reschedule Notifier added 2026-06-12)
- "Hot Lead Alert" renamed to "Every Lead Alert" — all docs use the new name
- Email is the default delivery channel for alerts/reports; SMS is built but off by default
- AI lead scoring (Temperature/Hot/Warm/Cold) was removed in V1.1 — no references in this kit
- The "Built for you" tier includes Wf 12 (ROI Report) and Wf 13 (Reschedule Notifier)
