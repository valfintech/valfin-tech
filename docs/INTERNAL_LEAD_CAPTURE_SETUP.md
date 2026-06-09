# Valfin Internal Lead Capture — Setup Guide

**Status:** Workflow created, website wired. Requires one-time configuration before activating.  
**Workflow:** `Valfin — Website Lead Capture` (n8n ID: `OIakSYLK2iMWsB32`)  
**URL:** https://valfin.app.n8n.cloud/workflow/OIakSYLK2iMWsB32

---

## What this system does

Every "Talk to us" submission on the Valfin website flows through this pipeline:

```
Contact Form → /api/contact → n8n Webhook → Google Sheets (append row)
                                          → Email alert to hello@valfintech.com
                                          → SMS alert to your mobile
                                          → Respond { received: true }
```

If n8n is unreachable at submission time, a failsafe email fires via Resend so no lead is ever silently dropped.

---

## Required accounts

| Account | Purpose | Status |
|---|---|---|
| n8n (valfin.app.n8n.cloud) | Workflow orchestration | ✅ Already active |
| Google account (valfintechnologies@gmail.com) | Hosts the Leads Google Sheet | ✅ Already connected |
| Twilio | SMS alerts to your mobile | ✅ Existing `twilioApi` credential reused |
| SMTP provider | Email alerts (hello@valfintech.com) | ⚠️ New credential needed |
| Resend (optional) | Failsafe email if n8n is down | ⚠️ Recommended — free tier sufficient |

---

## Step 1 — Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) while signed in as `valfintechnologies@gmail.com`
2. Create a new spreadsheet — name it **"Valfin Internal Leads"**
3. Rename `Sheet1` to **`Leads`**
4. In row 1, add these 14 column headers exactly (spelling and capitalisation matter):

```
Lead ID | Date Created | Source | Name | Email | Phone | Business Name | Message | Calc Monthly Leads | Calc Avg Value | Calc Monthly Loss | Status | Last Contact | Notes
```

5. Copy the **Sheet ID** from the URL:
   - URL pattern: `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`
   - It's the long alphanumeric string between `/d/` and `/edit`

---

## Step 2 — Configure the n8n workflow

Open the workflow: https://valfin.app.n8n.cloud/workflow/OIakSYLK2iMWsB32

### 2a — Google Sheets node
1. Click **"Append to Valfin Leads Sheet"**
2. In the **Document ID** field, replace the placeholder with your Sheet ID from Step 1
3. Verify **Sheet Name** is set to `Leads`
4. The **Google Sheets** credential should already show "Google Sheets account" — this is the existing credential tied to `valfintechnologies@gmail.com`. No action needed.

### 2b — Twilio SMS node
1. Click **"Send Lead SMS Alert"**
2. Set **From** to your Twilio phone number (E.164 format, e.g. `+16175550123`)
3. Set **To** to your personal mobile number (E.164 format, e.g. `+16175550100`)
4. The **Twilio** credential shows "Twilio account" — this is the same credential the roofing workflows use. No action needed.

### 2c — Email node (SMTP credential — new)
1. Click **"Send Lead Email Alert"**
2. Click the **Credential** dropdown → **Create new credential**
3. Credential type: **SMTP**
4. Fill in the SMTP settings for `hello@valfintech.com`:

   **Option A — Gmail / Google Workspace (recommended if hello@valfintech.com is a Google Workspace account)**
   - Host: `smtp.gmail.com`
   - Port: `465`
   - SSL: Yes
   - User: `hello@valfintech.com`
   - Password: Create an [App Password](https://myaccount.google.com/apppasswords) (not your regular password — 2FA must be enabled)

   **Option B — Any other ESP (Postmark, Mailgun, etc.)**
   - Use the SMTP credentials from that provider's dashboard

5. Save the credential
6. Verify `From Email` = `hello@valfintech.com` and `To Email` = `hello@valfintech.com`

---

## Step 3 — Activate the workflow

1. In the workflow editor, toggle **Active** to ON (top-right switch)
2. The production webhook URL becomes live:  
   `https://valfin.app.n8n.cloud/webhook/valfin-leads`

> **Important:** The webhook only receives submissions when the workflow is active. In test mode, use the test URL instead (see Step 5).

---

## Step 4 — Configure environment variables

### Local development (`.env.local`)
The file already exists at `/website/.env.local`. It contains:

```
N8N_VALFIN_LEADS_WEBHOOK_URL=https://valfin.app.n8n.cloud/webhook/valfin-leads
RESEND_API_KEY=          ← fill this in (see Step 4b)
```

The production URL is already set. Fill in `RESEND_API_KEY` if you want the failsafe email.

### Production (Vercel)
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:

| Variable | Value |
|---|---|
| `N8N_VALFIN_LEADS_WEBHOOK_URL` | `https://valfin.app.n8n.cloud/webhook/valfin-leads` |
| `RESEND_API_KEY` | Your Resend API key (optional but recommended) |

### Step 4b — Resend setup (optional failsafe)
1. Create a free account at https://resend.com
2. Add and verify the domain `valfintech.com` (DNS records — adds 3 TXT records to Cloudflare)
3. Create an API key → copy it into `RESEND_API_KEY`
4. This ensures that even if n8n is down, you receive an email with the lead data

---

## Step 5 — Test the pipeline

### Test via n8n (recommended first)
1. In the n8n workflow, click the **Webhook** node → **Listen for test event**
2. Submit the contact form at http://localhost:3200/company (scroll to "Let's talk")
3. n8n should receive the test payload and show it in the node's output panel
4. Step through each node to verify: Sheets row appended, email sent, SMS received
5. Check the Google Sheet — a new row should appear under the `Leads` tab

### Test via curl (optional)
```bash
curl -X POST https://valfin.app.n8n.cloud/webhook-test/valfin-leads \
  -H "Content-Type: application/json" \
  -d '{
    "source": "contact_form",
    "name": "Test Lead",
    "email": "test@example.com",
    "phone": "+16175550100",
    "businessName": "Test Roofing Co.",
    "message": "This is a test submission from the setup guide.",
    "calcMonthlyLeads": null,
    "calcAvgValue": null,
    "calcMonthlyLoss": null
  }'
```

Expected response: `{ "received": true }`

### Verify the failsafe
To test the failsafe, temporarily set `N8N_VALFIN_LEADS_WEBHOOK_URL` to an invalid URL and submit the form. With `RESEND_API_KEY` set, a failsafe email should arrive at `hello@valfintech.com`. Without it, the error and lead data appear in Vercel logs (Functions tab).

---

## Lead statuses (manual — update in Google Sheet)

| Status | Meaning |
|---|---|
| **New** | Just arrived — not yet contacted |
| **Contacted** | First outreach sent |
| **Qualified** | Confirmed fit, real opportunity |
| **Proposal Sent** | Sent a proposal or pricing |
| **Won** | Became a client |
| **Lost** | Did not move forward (add reason in Notes) |

Update the `Status` and `Last Contact` columns in the Google Sheet after each interaction. This is your accountability layer — it ensures no lead sits at "New" indefinitely.

---

## What is and isn't captured

### What gets captured
- Every contact form submission with a valid name + email + message
- Optional: `phone`, `businessName`, `calcMonthlyLeads`, `calcAvgValue`, `calcMonthlyLoss` (when passed from the calculator flow)

### What is NOT captured (by design for V1)
- Anonymous calculator completions without contact details — the calculator is a computation tool, not a lead form. Capturing sessions with no name or email creates noise in the sheet without actionable data.
- To capture calculator context alongside a lead: pass the calc values as additional fields when the contact form is submitted (the route already accepts `calcMonthlyLeads`, `calcAvgValue`, `calcMonthlyLoss` — the form just needs to be updated to include them if the user came from the calculator).

---

## How this is isolated from the roofing client system

| | Valfin Internal | Roofing Client |
|---|---|---|
| n8n workflow | `OIakSYLK2iMWsB32` (new) | Workflows 01–12 (untouched) |
| Google Sheet | Valfin Internal Leads (new) | `1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ` (untouched) |
| Twilio credential | Reuses `twilioApi` (read-only reuse — no changes to existing config) | Same credential |
| SMTP credential | New credential (Send Lead Email Alert) | Not used in any client workflow |

No existing roofing client workflow, sheet, or credential was modified.

---

## Required accounts summary

| Account | Required? | Why |
|---|---|---|
| n8n (already active) | Yes | Workflow orchestration |
| Google Workspace / Gmail | Yes | Google Sheets leads database |
| Twilio (already active) | Yes | SMS alerts |
| SMTP provider | Yes | Email alerts (new credential in n8n) |
| Resend | Strongly recommended | Failsafe email if n8n is unreachable |
| Vercel | Yes (for production) | Hosts the Next.js website |

## Required environment variables summary

| Variable | Required? | Where to set |
|---|---|---|
| `N8N_VALFIN_LEADS_WEBHOOK_URL` | Yes | `.env.local` + Vercel |
| `RESEND_API_KEY` | Strongly recommended | `.env.local` + Vercel |

---

## Checklist before activating

- [ ] Google Sheet created with `Leads` tab and 14 header columns
- [ ] Sheet ID pasted into the n8n Google Sheets node
- [ ] Twilio `from` and `to` numbers set in the n8n Twilio node
- [ ] SMTP credential created and assigned in the n8n Email node
- [ ] Workflow toggled Active in n8n
- [ ] `N8N_VALFIN_LEADS_WEBHOOK_URL` set in Vercel environment variables
- [ ] `RESEND_API_KEY` set in Vercel environment variables (failsafe)
- [ ] Test submission verified: row appears in Google Sheet, email received, SMS received
- [ ] Failsafe tested: email arrives when n8n webhook URL is invalid
