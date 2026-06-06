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
| 3. Lead response + follow-up automation | 🔄 **In progress** | 3/5 components live |
| 4. Appointment booking + pipeline | not started | |
| 5. Reminders / reschedule / cancel | not started | |
| 6. Retention | not started | |

### All live workflows in n8n (`valfin.app.n8n.cloud`)
| Workflow | n8n ID | Description |
|---|---|---|
| `01_crm_adapter_google_sheets` | `wVRHChyFrUNRaH4M` | CRM Adapter — only workflow that touches Google Sheets. Upserts leads, mints LEAD-####, logs to Communication Log. Accepts `followUpCount` for Phase 3 sequences. |
| `02_form_capture_scoring` | `HdJc5cy8cmqMBfGR` | Form Capture + AI Scoring. n8n Form + webhook → Sonnet 4.6 scores → CRM → Haiku 4.5 confirmation SMS → hot lead alert branch. |
| `03_missed_call_auto_sms` | `u9I1bqrLW6V5LtLp` | Missed-Call Auto-SMS. Twilio call-status → no-answer/busy filter → static SMS within seconds → CRM logs Comm entry only (no Lead). |
| `04_hot_lead_alert` | `KIpMMKM8H5IZB9wb` | Hot Lead Alert. Sub-workflow called by 02 on Hot/Emergency leads. Sends instant SMS to owner. **Setup: replace `OWNER_PHONE_HERE` in `Build Alert Message` node.** |
| `05_follow_up_sequence` | `chYfABnQdnPfiHQx` | Follow-Up Sequence. Daily 9 AM ET. Sends Day 1/3/7 SMS to New/Contacted leads, then updates status + Follow-up Count via CRM Adapter. Stops at 3 attempts. Booked leads auto-excluded. |
| `06_appointment_booking` | `ax2sMbvv0lqyJHMg` | Appointment Booking. Owner form → look up lead → write Appointments tab → customer confirmation SMS → update lead to Booked via CRM Adapter. Form: `https://valfin.app.n8n.cloud/form/eca6bfbb-ef53-4f82-b909-cbd2b818991a` |

**Credentials configured in n8n UI:** Google Sheets OAuth2 · Anthropic Header Auth · Twilio API.
See `docs/PROJECT_STATUS.md` for full workflow details and known issues.

## Models
- `claude-sonnet-4-6` — lead scoring / qualification (judgment).
- `claude-haiku-4-5` — instant customer replies (volume/speed).
- All AI calls use `output_config.format` (JSON schema) so every node returns clean, parseable JSON.
