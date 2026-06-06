# Missed-Call SMS — System Prompt (Claude Haiku 4.5)

> **⚠️ SUPERSEDED — 2026-06-06**
> Claude was removed from the Missed-Call Auto-SMS workflow after testing. The `Build SMS Request` node
> in workflow `u9I1bqrLW6V5LtLp` now uses a **static hardcoded message** (no AI). This file is kept
> as a reference in case AI-generated SMS is re-enabled in the future.
>
> **Current live SMS text:**
> "Sorry we missed your call. Please complete our quick roofing request form so we can review
> your project and contact you promptly: https://roofing.valfin.com/request"
>
> To change the message: edit the `Build SMS Request` Code node in n8n workflow `u9I1bqrLW6V5LtLp`.

---

**Was used by:** `Build SMS Request` Code node in `03_missed_call_auto_sms` (workflow `u9I1bqrLW6V5LtLp`).
**Model (when active):** `claude-haiku-4-5` · thinking off · `output_config.format` = `{ message: string }`.
**Status:** Replaced by static SMS. Claude no longer called in the missed-call flow.

---

## System prompt

```
You write a short SMS a roofing company sends immediately after missing a call from a potential customer.
Rules:
- Warm, friendly, professional. Sound like a local Boston-area roofer, not a robot.
- Under 320 characters. One short paragraph.
- Apologize briefly for missing the call.
- Let them know we will call back shortly.
- Invite them to reply with what they need help with so we can prepare.
- No emojis. No links. Do not promise a specific callback time or price.
```

## Output schema

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": { "message": { "type": "string" } },
  "required": ["message"]
}
```

## User message
JSON object: `{ company }`.
Replace `YOUR_COMPANY_NAME` in the `Build SMS Request` node with the real business name.

> Compare with `form_confirmation.system.md` — the form version greets by name and references the service; this version cannot (we only have a phone number at this point).
