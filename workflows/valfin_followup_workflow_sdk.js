import { workflow, node, trigger, switchCase, expr } from '@n8n/workflow-sdk';

// ── Credentials & constants ────────────────────────────────────────────
const GMAIL_CRED  = { gmailOAuth2: { id: 'p0CURt6WXyab0h8P', name: 'Gmail OAuth2 API' } };
const SHEETS_CRED = { googleSheetsOAuth2Api: { id: '14j6qdr9iGD8pjqU', name: 'Google Sheets account' } };
const SHEET_ID    = '1eCzFh9jrzlqFGu9BoXLAsZ7a76tN7oTApm_bVG2n-zg';
const BOOKING_LINK = 'https://calendar.google.com/calendar/appointments/schedules/REPLACE_WITH_YOUR_SCHEDULE_ID';

// ── Schedule: daily 9 AM ET (14:00 UTC / 9 AM EST / 10 AM EDT) ────────
const dailyTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Daily 9 AM ET',
    parameters: {
      rule: {
        interval: [{ field: 'days', daysInterval: 1, triggerAtHour: 14, triggerAtMinute: 0 }]
      }
    }
  },
  output: [{}]
});

// ── Read all leads from Google Sheets ─────────────────────────────────
const readLeads = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read All Leads',
    credentials: SHEETS_CRED,
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      options: {}
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', Name: 'Test Lead', 'Booking Status': 'Booking Requested', 'Booking Email Sent': '2026-06-15T14:00:00.000Z', 'Reminder 1 Sent': '', 'Reminder 2 Sent': '', Status: 'New' }]
});

// ── Classify leads needing follow-up (one output item per action) ──────
const classifyLeads = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Classify Leads',
    parameters: {
      jsCode:
        "const BOOKING_LINK = '" + BOOKING_LINK + "';\n" +
        "const now = Date.now();\n" +
        "const results = [];\n" +
        "for (const item of $input.all()) {\n" +
        "  const lead = item.json;\n" +
        "  const bookingEmailSent = lead['Booking Email Sent'];\n" +
        "  if (!bookingEmailSent) continue;\n" +
        "  if (lead['Booking Status'] !== 'Booking Requested') continue;\n" +
        "  if (['Won','Lost'].includes(lead['Status'] || '')) continue;\n" +
        "  const hoursElapsed = (now - new Date(bookingEmailSent).getTime()) / 3600000;\n" +
        "  const firstName = (lead['Name'] || '').split(' ')[0] || 'there';\n" +
        "  let action = null;\n" +
        "  if (hoursElapsed >= 168) { action = 'no_response'; }\n" +
        "  else if (hoursElapsed >= 68 && hoursElapsed < 80 && !lead['Reminder 2 Sent']) { action = 'reminder_2'; }\n" +
        "  else if (hoursElapsed >= 20 && hoursElapsed < 32 && !lead['Reminder 1 Sent']) { action = 'reminder_1'; }\n" +
        "  if (!action) continue;\n" +
        "  results.push({ json: { ...lead, _action: action, _firstName: firstName, _bookingLink: BOOKING_LINK } });\n" +
        "}\n" +
        "return results;"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', Name: 'Test Lead', _action: 'reminder_1', _firstName: 'Test', _bookingLink: BOOKING_LINK, 'Booking Status': 'Booking Requested', 'Booking Email Sent': '2026-06-15T14:00:00.000Z', 'Reminder 1 Sent': '', 'Reminder 2 Sent': '', Status: 'New' }]
});

// ── Switch on action type ──────────────────────────────────────────────
const actionSwitch = switchCase({
  version: 3.2,
  config: {
    name: 'Route by Action',
    parameters: {
      rules: {
        values: [
          { outputKey: 'reminder_1', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' }, conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'reminder_1' }], combinator: 'and' } },
          { outputKey: 'reminder_2', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' }, conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'reminder_2' }], combinator: 'and' } },
          { outputKey: 'no_response', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' }, conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'no_response' }], combinator: 'and' } }
        ]
      },
      options: { fallbackOutput: 'none' }
    }
  }
});

// ── CASE 0: REMINDER 1 (24 hours) ─────────────────────────────────────

const buildR1Email = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Reminder 1 Email',
    parameters: {
      jsCode:
        "const lead = $input.first().json;\n" +
        "const firstName = lead._firstName || 'there';\n" +
        "const bookingLink = lead._bookingLink || '';\n" +
        "const html = '<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head>" +
        "<body style=\"margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f5f5f5;padding:40px 20px;\"><tr><td align=\"center\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;background:#fff;border-radius:8px;overflow:hidden;\">" +
        "<tr><td style=\"background:#0f0f0f;padding:28px 40px;\"><p style=\"margin:0;font-size:20px;font-weight:700;color:#fff;\">Valfin Tech</p></td></tr>" +
        "<tr><td style=\"padding:40px;\">" +
        "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;\">Hi ' + firstName + ',</p>" +
        "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;\">Just a quick note — your scheduling link is still open whenever you are ready.</p>" +
        "<p style=\"margin:0 0 32px;font-size:15px;line-height:1.6;color:#374151;\">If you have any questions before the call, just reply to this email and you will hear from a real person.</p>" +
        "<table cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:32px;\"><tr><td style=\"background:#2563eb;border-radius:6px;\">" +
        "<a href=\"' + bookingLink + '\" style=\"display:block;padding:14px 28px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;\">Schedule Your Discovery Call &rarr;</a>" +
        "</td></tr></table>" +
        "<p style=\"margin:0;font-size:15px;line-height:1.6;color:#374151;\">&mdash; Valfin Tech</p></td></tr>" +
        "<tr><td style=\"background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">" +
        "<p style=\"margin:0;font-size:12px;color:#9ca3af;\">Valfin Tech &middot; <a href=\"https://valfintech.com\" style=\"color:#9ca3af;text-decoration:none;\">valfintech.com</a></p>" +
        "</td></tr></table></td></tr></table></body></html>';\n" +
        "return [{ json: { ...lead, _emailHtml: html } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', _emailHtml: '<html>R1</html>', _firstName: 'Test', _bookingLink: BOOKING_LINK }]
});

const gmailR1 = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Reminder 1',
    onError: 'continueRegularOutput',
    credentials: GMAIL_CRED,
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr('{{ $json.Email }}'),
      subject: 'Still time to schedule your Valfin discovery call',
      emailType: 'html',
      message: expr('{{ $json._emailHtml }}'),
      options: { appendAttribution: false }
    }
  },
  output: [{ id: 'msg1', threadId: 'thread1', labelIds: ['SENT'] }]
});

const prepR1Update = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep R1 Update',
    parameters: {
      jsCode:
        "const lead = $('Build Reminder 1 Email').item.json;\n" +
        "return [{ json: { 'Lead ID': lead['Lead ID'], 'Reminder 1 Sent': new Date().toISOString() } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', 'Reminder 1 Sent': '2026-06-16T14:00:00.000Z' }]
});

const sheetsR1 = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Reminder 1 Sent',
    credentials: SHEETS_CRED,
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Lead ID'],
        value: { 'Lead ID': expr("{{ $json['Lead ID'] }}"), 'Reminder 1 Sent': expr("{{ $json['Reminder 1 Sent'] }}") },
        schema: [
          { id: 'Lead ID', displayName: 'Lead ID', required: false, defaultMatch: true, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Reminder 1 Sent', displayName: 'Reminder 1 Sent', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ]
      },
      options: {}
    }
  },
  output: [{}]
});

// ── CASE 1: REMINDER 2 (72 hours) ─────────────────────────────────────

const buildR2Email = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Reminder 2 Email',
    parameters: {
      jsCode:
        "const lead = $input.first().json;\n" +
        "const firstName = lead._firstName || 'there';\n" +
        "const bookingLink = lead._bookingLink || '';\n" +
        "const html = '<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head>" +
        "<body style=\"margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f5f5f5;padding:40px 20px;\"><tr><td align=\"center\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;background:#fff;border-radius:8px;overflow:hidden;\">" +
        "<tr><td style=\"background:#0f0f0f;padding:28px 40px;\"><p style=\"margin:0;font-size:20px;font-weight:700;color:#fff;\">Valfin Tech</p></td></tr>" +
        "<tr><td style=\"padding:40px;\">" +
        "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;\">Hi ' + firstName + ',</p>" +
        "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;\">We wanted to follow up one final time on your inquiry.</p>" +
        "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;\">If you are still interested in seeing how we help businesses stop losing leads to silence, the link below is still active.</p>" +
        "<p style=\"margin:0 0 32px;font-size:15px;line-height:1.6;color:#374151;\">If the timing is not right, no worries at all — we wish you well either way.</p>" +
        "<table cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:32px;\"><tr><td style=\"background:#2563eb;border-radius:6px;\">" +
        "<a href=\"' + bookingLink + '\" style=\"display:block;padding:14px 28px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;\">Schedule Your Discovery Call &rarr;</a>" +
        "</td></tr></table>" +
        "<p style=\"margin:0;font-size:15px;line-height:1.6;color:#374151;\">&mdash; Valfin Tech</p></td></tr>" +
        "<tr><td style=\"background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">" +
        "<p style=\"margin:0;font-size:12px;color:#9ca3af;\">Valfin Tech &middot; <a href=\"https://valfintech.com\" style=\"color:#9ca3af;text-decoration:none;\">valfintech.com</a></p>" +
        "</td></tr></table></td></tr></table></body></html>';\n" +
        "return [{ json: { ...lead, _emailHtml: html } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', _emailHtml: '<html>R2</html>', _firstName: 'Test', _bookingLink: BOOKING_LINK }]
});

const gmailR2 = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Reminder 2',
    onError: 'continueRegularOutput',
    credentials: GMAIL_CRED,
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr('{{ $json.Email }}'),
      subject: 'One last note from Valfin Tech',
      emailType: 'html',
      message: expr('{{ $json._emailHtml }}'),
      options: { appendAttribution: false }
    }
  },
  output: [{ id: 'msg2', threadId: 'thread2', labelIds: ['SENT'] }]
});

const prepR2Update = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep R2 Update',
    parameters: {
      jsCode:
        "const lead = $('Build Reminder 2 Email').item.json;\n" +
        "return [{ json: { 'Lead ID': lead['Lead ID'], 'Reminder 2 Sent': new Date().toISOString() } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', 'Reminder 2 Sent': '2026-06-16T14:00:00.000Z' }]
});

const sheetsR2 = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Reminder 2 Sent',
    credentials: SHEETS_CRED,
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Lead ID'],
        value: { 'Lead ID': expr("{{ $json['Lead ID'] }}"), 'Reminder 2 Sent': expr("{{ $json['Reminder 2 Sent'] }}") },
        schema: [
          { id: 'Lead ID', displayName: 'Lead ID', required: false, defaultMatch: true, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Reminder 2 Sent', displayName: 'Reminder 2 Sent', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ]
      },
      options: {}
    }
  },
  output: [{}]
});

// ── CASE 2: NO RESPONSE (7 days) ──────────────────────────────────────

const prepNoResponse = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep No Response',
    parameters: {
      jsCode:
        "const lead = $input.first().json;\n" +
        "return [{ json: { 'Lead ID': lead['Lead ID'], 'Booking Status': 'No Response', Status: 'No Response' } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', 'Booking Status': 'No Response', Status: 'No Response' }]
});

const sheetsNoResponse = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark No Response',
    credentials: SHEETS_CRED,
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Lead ID'],
        value: { 'Lead ID': expr("{{ $json['Lead ID'] }}"), 'Booking Status': expr("{{ $json['Booking Status'] }}"), Status: expr('{{ $json.Status }}') },
        schema: [
          { id: 'Lead ID', displayName: 'Lead ID', required: false, defaultMatch: true, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Booking Status', displayName: 'Booking Status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Status', displayName: 'Status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ]
      },
      options: {}
    }
  },
  output: [{}]
});

// ── Workflow composition ───────────────────────────────────────────────
export default workflow('valfin-discovery-followup', 'Valfin — Discovery Call Follow-Up')
  .add(dailyTrigger)
  .to(readLeads)
  .to(classifyLeads)
  .to(
    actionSwitch
      .onCase(0, buildR1Email.to(gmailR1).to(prepR1Update).to(sheetsR1))
      .onCase(1, buildR2Email.to(gmailR2).to(prepR2Update).to(sheetsR2))
      .onCase(2, prepNoResponse.to(sheetsNoResponse))
  );
