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
| 3. Scheduling + team approval | not started | |
| 4. Reminders / reschedule / cancel | not started | |
| 5. Quote follow-up | not started | |
| 6. Retention | not started | |

### Phase 2 — all live in n8n (`valfin.app.n8n.cloud`)
| Workflow | n8n ID | Description |
|---|---|---|
| `01_crm_adapter_google_sheets` | `wVRHChyFrUNRaH4M` | CRM Adapter — only workflow that touches Google Sheets. Upserts leads, mints LEAD-####, logs to Communication Log. GoHighLevel swap point. |
| `02_form_capture_scoring` | `HdJc5cy8cmqMBfGR` | Form Capture + AI Scoring. n8n Form + parallel webhook → Sonnet 4.6 scores → CRM → Haiku 4.5 confirmation SMS → logged. |
| `03_missed_call_auto_sms` | `u9I1bqrLW6V5LtLp` | Missed-Call Auto-SMS. Twilio call-status → no-answer/busy filter → static SMS within seconds → CRM logs Comm entry only (no Lead). |

**Credentials still needed in n8n UI:** Google Sheets OAuth2 · Anthropic Header Auth · Twilio API.
See `docs/PROJECT_STATUS.md` for the full 11-step credential + activation checklist.
See `docs/phase2_setup.md` for the 3-step end-to-end test procedure (Tests A → B → C).

## Models
- `claude-sonnet-4-6` — lead scoring / qualification (judgment).
- `claude-haiku-4-5` — instant customer replies (volume/speed).
- All AI calls use `output_config.format` (JSON schema) so every node returns clean, parseable JSON.
