# Phase 2 Setup — Missed-Call + Form Capture

This guide gets the **Form Capture + AI Scoring** flow live and tested. It depends on the **CRM Adapter** sub-workflow, so we set that up first. (The Missed-Call auto-SMS workflow is the next deliverable and reuses the same adapter.)

> You do the clicks in the n8n UI and connect your own Google / Anthropic / Twilio accounts. I can't operate the GUI or hold your credentials — every account step is spelled out below.

---

## 0. Prerequisites (one time)

1. **The CRM lives in Google Sheets, not a local `.xlsx`.** Create (or open) the Google Sheet that has these tabs with header rows exactly as named in the brief: `Leads`, `Appointments`, `Quotes`, `Jobs`, `Communication Log`, `Follow Ups`, `Team Schedule`, `Dashboard`.
   - **Use `templates/Roofing_CRM_Google_Sheets_TEMPLATE.xlsx`** (generated 2026-06-08 — see `docs/CRM_SHEET_SCHEMA.md` for the full rationale and column-by-column reference): in Google Drive, **New → File upload**, then open it and **File → Save as Google Sheets**. Delete the `EXAMPLE-` rows before using it for real data. _(Historical note: the brief originally referenced a file called `Roofing_CRM_Google_Sheets.xlsx` that was never actually present in the project folder — `docs/CRM_SHEET_SCHEMA.md` documents that gap and how the generated template closes it. If you're starting completely fresh and the generated template is somehow unavailable, that doc also gives you the exact verified header rows to recreate by hand.)_
   - Grab the **Spreadsheet ID** from the URL: `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID`**`/edit`.
2. The `Leads` header row must include a **`Lead ID`** column and a **`Phone`** column (used as the match keys). The `Communication Log` headers must match the brief exactly (`Log ID`, `Date/Time`, `Lead ID`, `Customer Name`, `Channel`, `Direction`, `Handler`, `Message Summary`, `Notes`).

---

## 1. Credentials (create these once in n8n)

In n8n: **Credentials → New**.

| Credential | Type | Fields |
|---|---|---|
| **Google Sheets account** | *Google Sheets OAuth2 API* | Connect your Google account; grant Sheets + Drive access. |
| **Anthropic API** | *Header Auth* | **Name:** `x-api-key` · **Value:** your Anthropic API key (from console.anthropic.com). |
| **Twilio account** | *Twilio API* | Account SID + Auth Token from your Twilio console. (Only needed for the confirmation SMS — skip for the first dry run.) |

> The Anthropic node uses **Header Auth** for `x-api-key`; the `anthropic-version` and `content-type` headers are already set inside the HTTP node, so you don't add them to the credential.

---

## 2. Import the workflows

1. **Workflows → Import from File →** `workflows/01_crm_adapter_google_sheets.json`. Save.
2. **Import from File →** `workflows/02_form_capture_scoring.json`. Save.

---

## 3. Wire up the CRM Adapter (`01`)

Open **CRM Adapter (Google Sheets)**. There are 3 Google Sheets nodes — fix each:

- **Get Leads** and **Upsert Lead**: click the node → in **Document**, switch the picker to **By ID** and paste your Spreadsheet ID (or pick from the list) → in **Sheet**, select **`Leads`**.
- **Append Comm Log**: same Document → **Sheet** = **`Communication Log`**.
- All three already use **Map Automatically** — the Code nodes output objects whose keys are the exact column names, so leave mapping on auto. Confirm each node shows your real columns.
- The **Upsert Lead** node matches on **`Lead ID`** (already set). The **Append Comm Log** node just appends.

**How the adapter behaves (the modular contract):**
- Input it expects (any subset): `source, firstName, lastName, phone, email, address, serviceNeeded, description, photosLink, preferredTime, leadScore, temperature, urgency, status, assignedTo, notes, leadId` plus log fields `logChannel, logDirection, logHandler, logSummary, logNotes`.
- It **upserts the lead**: matches an existing row by `leadId` if you pass one, else by `Phone` (digits only). New leads get a fresh `LEAD-####`. Existing non-empty fields are never blanked out.
- It **always appends one Communication Log row**.
- It **returns** `{ leadId, isNew, temperature, leadScore, status }`.
- **This is the only workflow that touches Google Sheets.** To move to GoHighLevel later, rebuild *only this workflow* with the same input/output contract — nothing else changes.

> ⚠️ ID generation reads the whole `Leads` tab and increments the max. Fine for one business; under truly simultaneous submissions there's a tiny duplicate-ID risk. We'll harden this if volume ever demands it.

---

## 4. Point the Form workflow at the adapter (`02`)

Open **Form Capture + AI Scoring**. Two nodes call the adapter — **CRM: Upsert + Log Inbound** and **CRM: Log Outbound SMS**. In each:
- Open the node → **Workflow** field → select **CRM Adapter (Google Sheets)** from the list. (The placeholder ID won't resolve until you pick it.)

Then set the remaining placeholders:
- **Build Confirmation Request** (Code node): replace `YOUR_COMPANY_NAME` with the real business name.
- **Send Confirmation SMS** (Twilio): set **From** = your Twilio number (E.164, e.g. `+1617...`). **To** is already mapped to the lead's phone.
- Select the **Anthropic API** credential on both `Claude - ...` nodes, the **Google Sheets account** is on the adapter, and **Twilio account** on the SMS node.

The two entry points:
- **Website Form** (n8n-hosted) — open it, copy the **Production URL** (and **Test URL** for testing). This is your shareable form for the demo.
- **Website Webhook (optional)** — for when the form lives on the company's real site later. Have that site POST JSON (keys `First Name`, `Phone`, etc., or camelCase) to the webhook URL. It feeds the exact same pipeline. Leave it; it costs nothing until called.

---

## 5. Test it (in order — don't skip)

**Test A — Adapter alone (no AI, no SMS).**
1. Open **CRM Adapter**, click **Execute Workflow**, and when prompted for input, paste:
   ```json
   { "source": "Manual Test", "firstName": "Jane", "lastName": "Doe", "phone": "617-555-0101", "address": "12 Beacon St, Boston MA", "serviceNeeded": "Roof Repair", "logChannel": "Test", "logSummary": "adapter smoke test" }
   ```
2. Check your Sheet: a new `LEAD-0001`-style row in **Leads** and a row in **Communication Log**. Run it again with the same phone → it should **update the same lead**, not duplicate it. ✅

**Test B — Form path without SMS.**
1. In `02`, temporarily **disable** `Send Confirmation SMS`, `Mark Outbound Log`, and `CRM: Log Outbound SMS` (right-click → Disable) so you can test scoring + CRM before Twilio is connected.
2. Open **Website Form**, hit the **Test URL**, submit a realistic lead (e.g. "Active leak in the ceiling after last night's storm, need someone ASAP").
3. In the execution view confirm: **Claude - Score Lead** returns clean JSON; **Parse Score** shows `leadScore`/`temperature`/`urgency`; the Leads row is written with a score and the lead reads **Hot**. ✅

**Test C — Full path with SMS.**
1. Connect the **Twilio account** credential, set the **From** number, re-enable the three nodes.
2. Submit the form with **your own mobile** as the phone. You should get the AI-written confirmation text within seconds, and an **Outbound / SMS** row appears in the Communication Log. ✅

---

## 6. Error handling & retries (already built in)

- Every external call (Anthropic, Google Sheets, Twilio) has **Retry On Fail = 3 tries** with a back-off, set on the node.
- Recommended add-on: create one **Error Trigger** workflow (n8n → new workflow → *Error Trigger* node → notify yourself via Gmail/Slack). In each workflow's **Settings → Error Workflow**, select it. That gives you a single alert channel for any failed run across all phases. (I can build this as a small shared workflow on request.)

---

## 7. Go live

Once Tests A–C pass: toggle both workflows to **Active**. Use the Form's **Production URL** for the demo. The adapter does not need to be Active (it's called as a sub-workflow), but saving it is enough.

---

### Notes / known placeholders to replace
- `YOUR_GOOGLE_SHEET_ID` — in all 3 Google Sheets nodes (set via the Document picker).
- `YOUR_CRM_ADAPTER_WORKFLOW_ID` — auto-resolved when you select the adapter in the two Execute-Workflow nodes.
- `YOUR_TWILIO_NUMBER` — the **From** field on the SMS node.
- `YOUR_COMPANY_NAME` — in **Build Confirmation Request**.
- If any node fails to import due to an n8n version mismatch, tell me the node + version and I'll adjust the `typeVersion`.
