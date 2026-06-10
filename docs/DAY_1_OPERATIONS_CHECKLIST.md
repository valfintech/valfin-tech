# Valfin — Day 1 Operations Checklist

**Status (2026-06-10):** Valfin's own lead pipeline is live. This is the practical, repeatable checklist for handling a real lead that comes in through `valfintech.com` — not a setup guide (see `INTERNAL_LEAD_CAPTURE_SETUP.md` for that) and not the client/demo system (see `CRM_SHEET_SCHEMA.md` / `phase2_setup.md` for that).

This document is intentionally short. It's meant to be followed in under 5 minutes per lead, every time.

---

## Where leads come from

Every submission of the "Talk to us" form on `valfintech.com/company` flows through:

```
Contact Form → /api/contact → n8n (Valfin — Website Lead Capture, ID OIakSYLK2iMWsB32)
                                  → Google Sheet "Valfin Internal Leads" (tab: Leads)
                                  → Gmail alert → valfintechnologies@gmail.com
                                  → SMS alert → +18575261499 (Twilio, pending toll-free verification)
```

**Sheet:** [Valfin Internal Leads](https://docs.google.com/spreadsheets/d/1eCzFh9jrzlqFGu9BoXLAsZ7a76tN7oTApm_bVG2n-zg/edit) — tab `Leads`

**Columns (14):** `Lead ID | Date Created | Source | Name | Email | Phone | Business Name | Message | Calc Monthly Leads | Calc Avg Value | Calc Monthly Loss | Status | Last Contact | Notes`

---

## When a lead comes in

### 1. You'll be notified two ways
- **Email** to `valfintechnologies@gmail.com` (instant, working today)
- **SMS** to `+18575261499` (will start once Twilio toll-free verification clears — until then, treat email as primary)

### 2. Open the row in the Leads sheet
Find the new row by `Lead ID` (most recent = bottom). Read:
- `Name`, `Email`, `Phone`, `Business Name`
- `Message` — what they actually said
- `Calc Monthly Leads` / `Calc Avg Value` / `Calc Monthly Loss` — if they used the Lead Leak Calculator before submitting, these show their self-reported numbers. Use them to personalize your reply (e.g. "you mentioned you're missing ~12 leads/month at $450 avg job value — that's about $5,400/month on the table").

### 3. Reply within 1 business day (sooner is better)
- Reply by email to the address they gave you. This is a real, individual reply — not a template blast.
- Reference their specific situation (industry, message content, calculator numbers if present).
- Goal of the first reply: book a short call, or answer their question directly if it's a quick one.
- If they gave a phone number and SMS consent applies (see `SMS_CONSENT_LANGUAGE_GUIDE.md`), a follow-up text is fine once Twilio is verified.

### 4. Update the sheet after every touch
- `Status` — move it forward as things progress. Suggested values: `New` → `Contacted` → `Booked` → `Won` / `Lost` / `Stale`
- `Last Contact` — set to today's date (ISO format, e.g. `2026-06-10`) every time you reach out
- `Notes` — one line per touch, e.g. `2026-06-10: Replied via email, proposed Tue/Thu call times.`

### 5. Check for stale leads
Leads with `Status = New` or `Contacted` and no `Last Contact` update in 3+ days should get a follow-up nudge. There's no automated follow-up sequence for Valfin's *own* leads (that's a roofing-client-only workflow, see item 8 below) — this is a manual check for now.

---

## Daily routine (suggested, ~5 min/day minimum)

1. Check `valfintechnologies@gmail.com` for new lead alerts
2. Open the Leads sheet, scan for any row with `Status = New`
3. Reply to each new lead (step 3 above)
4. Update `Status` / `Last Contact` / `Notes` for anything you touched
5. Glance at rows with `Status = Contacted` older than 3 days — follow up if needed

---

## If something looks broken

| Symptom | Likely cause | What to do |
|---|---|---|
| Form submits but no row appears in the sheet | n8n workflow down or Google Sheets auth expired | Check [n8n execution log](https://valfin.app.n8n.cloud/workflow/OIakSYLK2iMWsB32) for failed runs |
| Row appears but no Gmail alert | Gmail OAuth2 credential expired | Re-authenticate the Gmail node in n8n |
| No SMS alert | Expected until Twilio toll-free verification completes | No action needed yet — email is the reliable channel for now |
| Form shows an error to the visitor | `/api/contact` or n8n webhook unreachable | A Resend failsafe email is planned but not yet configured (see `INTERNAL_LEAD_CAPTURE_SETUP.md`) — check Vercel function logs for `/api/contact` |

---

## What this checklist deliberately does NOT cover

- The 12 client/demo roofing workflows and their CRM (separate system, separate Google Sheet, see `CRM_SHEET_SCHEMA.md`) — this checklist is **only** for leads coming through Valfin's own website.
- Onboarding a new paying client — see `ONBOARDING_SOP.md` and `CLIENT_ONBOARDING_INTAKE.md`.
- Legal/compliance language for SMS — see `SMS_CONSENT_LANGUAGE_GUIDE.md` and the `/privacy` and `/terms` pages.
