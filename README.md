# Roofing Lead Automation — Deliverables

n8n + Claude API + Google Sheets CRM for a single Boston-area roofing company. See the project brief (`CLAUDE.md`) for the full spec.

## Folder layout
```
workflows/   importable n8n workflow JSON
prompts/     Claude system prompts (reference copies; live copies live in the workflow Code nodes)
docs/        setup + operating guides
```

## Build status
| Phase | Status | Files |
|---|---|---|
| 1. Google Sheets CRM | done (pre-existing) | — |
| 2. Missed-call + form capture | **in progress** | see below |
| 3. Scheduling + team approval | not started | |
| 4. Reminders / reschedule / cancel | not started | |
| 5. Quote follow-up | not started | |
| 6. Retention | not started | |

### Phase 2 — delivered so far
- `workflows/01_crm_adapter_google_sheets.json` — **CRM Adapter** sub-workflow. The only place that reads/writes Google Sheets (upsert lead by phone/ID + append Communication Log). Swap this one workflow to move the CRM to GoHighLevel later.
- `workflows/02_form_capture_scoring.json` — **Form Capture + AI Scoring**. n8n Form Trigger (+ parallel webhook for a website-embedded form) → AI lead score (Sonnet 4.6) → CRM Adapter → instant AI confirmation SMS (Haiku 4.5) → logged.
- `prompts/lead_scoring.system.md`, `prompts/form_confirmation.system.md`
- `docs/phase2_setup.md` — node-by-node UI setup + a 3-step test procedure. **Start here.**

### Still to come in Phase 2
- `03` Missed-Call → Auto-SMS (Twilio call-status webhook → Haiku SMS within 30s → CRM Adapter log). Reuses the adapter.

## Models
- `claude-sonnet-4-6` — lead scoring / qualification (judgment).
- `claude-haiku-4-5` — instant customer replies (volume/speed).
- All AI calls use `output_config.format` (JSON schema) so every node returns clean, parseable JSON.
