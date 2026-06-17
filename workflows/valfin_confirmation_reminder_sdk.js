import { workflow, node, trigger, switchCase, expr } from '@n8n/workflow-sdk';

// ── Credentials & constants ────────────────────────────────────────────
const GMAIL_CRED  = { gmailOAuth2: { id: 'p0CURt6WXyab0h8P', name: 'Gmail OAuth2 API' } };
const SHEETS_CRED = { googleSheetsOAuth2Api: { id: '14j6qdr9iGD8pjqU', name: 'Google Sheets account' } };
const SHEET_ID    = '1eCzFh9jrzlqFGu9BoXLAsZ7a76tN7oTApm_bVG2n-zg';

// ── Schedule: hourly ───────────────────────────────────────────────────
const hourlyTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Hourly Check',
    parameters: {
      rule: {
        interval: [{ field: 'hours', hoursInterval: 1, triggerAtMinute: 0 }]
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
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', Name: 'Test Lead', 'Booking Status': 'Booked', 'Confirmation Email Sent': '', 'Reminder Email Sent': '', 'Discovery Call Date': '2026-06-20', 'Discovery Call Time': '2:00 PM', 'Meet Link': 'https://meet.google.com/xxx-xxx-xxx' }]
});

// ── Classify: confirmation needed vs 2h reminder needed ────────────────
const classifyBooked = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Classify Booked Leads',
    parameters: {
      jsCode:
        "const now = Date.now();\n" +
        "const results = [];\n" +
        "for (const item of $input.all()) {\n" +
        "  const lead = item.json;\n" +
        "  if (lead['Booking Status'] !== 'Booked') continue;\n" +
        "  const email = lead['Email'];\n" +
        "  if (!email) continue;\n" +
        "  const firstName = (lead['Name'] || '').split(' ')[0] || 'there';\n" +
        "  const callDate = lead['Discovery Call Date'];\n" +
        "  const callTime = lead['Discovery Call Time'];\n" +
        "  const meetLink = lead['Meet Link'] || '';\n" +
        "  // Branded confirmation email (once, immediately after booking is recorded)\n" +
        "  if (!lead['Confirmation Email Sent']) {\n" +
        "    results.push({ json: { ...lead, _action: 'confirmation', _firstName: firstName, _callDate: callDate || '', _callTime: callTime || '', _meetLink: meetLink } });\n" +
        "    continue;\n" +
        "  }\n" +
        "  // 2-hour reminder (once, 1-3 hours before the call)\n" +
        "  if (!callDate || !callTime) continue;\n" +
        "  if (lead['Reminder Email Sent']) continue;\n" +
        "  const match = callTime.match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)$/i);\n" +
        "  if (!match) continue;\n" +
        "  let h = parseInt(match[1]);\n" +
        "  const m = parseInt(match[2]);\n" +
        "  const period = match[3].toUpperCase();\n" +
        "  if (period === 'PM' && h !== 12) h += 12;\n" +
        "  if (period === 'AM' && h === 12) h = 0;\n" +
        "  const callDt = new Date(callDate + 'T' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00-04:00');\n" +
        "  const hoursUntilCall = (callDt.getTime() - now) / 3600000;\n" +
        "  if (hoursUntilCall >= 1 && hoursUntilCall <= 3) {\n" +
        "    results.push({ json: { ...lead, _action: 'reminder', _firstName: firstName, _callDate: callDate, _callTime: callTime, _meetLink: meetLink } });\n" +
        "  }\n" +
        "}\n" +
        "return results;"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', Name: 'Test Lead', _action: 'confirmation', _firstName: 'Test', _callDate: '2026-06-20', _callTime: '2:00 PM', _meetLink: 'https://meet.google.com/xxx-xxx-xxx', 'Booking Status': 'Booked', 'Confirmation Email Sent': '', 'Reminder Email Sent': '' }]
});

// ── Switch on action ───────────────────────────────────────────────────
const actionSwitch = switchCase({
  version: 3.2,
  config: {
    name: 'Route by Action',
    parameters: {
      rules: {
        values: [
          { outputKey: 'confirmation', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' }, conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'confirmation' }], combinator: 'and' } },
          { outputKey: 'reminder',     conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' }, conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'reminder' }],     combinator: 'and' } }
        ]
      },
      options: { fallbackOutput: 'none' }
    }
  }
});

// ── CASE 0: BRANDED CONFIRMATION EMAIL ────────────────────────────────

const buildConfirmationEmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Confirmation Email',
    parameters: {
      jsCode:
        "const lead = $input.first().json;\n" +
        "const firstName = lead._firstName || 'there';\n" +
        "const callDate = lead._callDate || 'TBD';\n" +
        "const callTime = lead._callTime || 'TBD';\n" +
        "const meetLink = lead._meetLink || '';\n" +
        "const meetBtn = meetLink ? '<table cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:16px;\"><tr><td style=\"background:#059669;border-radius:6px;\"><a href=\"' + meetLink + '\" style=\"display:block;padding:12px 24px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;\">Join Google Meet &rarr;</a></td></tr></table>' : '';\n" +
        "const html = '<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head>" +
        "<body style=\"margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f5f5f5;padding:40px 20px;\"><tr><td align=\"center\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;background:#fff;border-radius:8px;overflow:hidden;\">" +
        "<tr><td style=\"background:#0f0f0f;padding:28px 40px;\"><p style=\"margin:0;font-size:20px;font-weight:700;color:#fff;\">Valfin Tech</p></td></tr>" +
        "<tr><td style=\"padding:40px;\">" +
        "<p style=\"margin:0 0 8px;font-size:13px;font-weight:600;color:#059669;text-transform:uppercase;letter-spacing:0.5px;\">YOU ARE ALL SET</p>" +
        "<p style=\"margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;\">Your discovery call is confirmed.</p>" +
        "<table cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:28px;\">" +
        "<tr><td style=\"padding:16px 20px;\"><p style=\"margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;\">Date</p><p style=\"margin:0;font-size:15px;color:#111827;font-weight:600;\">' + callDate + '</p></td></tr>" +
        "<tr><td style=\"padding:16px 20px;border-top:1px solid #e5e7eb;\"><p style=\"margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;\">Time</p><p style=\"margin:0;font-size:15px;color:#111827;font-weight:600;\">' + callTime + ' ET</p></td></tr>" +
        "<tr><td style=\"padding:16px 20px;border-top:1px solid #e5e7eb;\"><p style=\"margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;\">Duration</p><p style=\"margin:0;font-size:15px;color:#111827;font-weight:600;\">30 minutes</p></td></tr></table>" +
        "' + meetBtn + '" +
        "<p style=\"margin:0 0 16px;font-size:14px;line-height:1.6;color:#6b7280;\">What to expect on the call:</p>" +
        "<ul style=\"margin:0 0 24px;padding-left:20px;\">" +
        "<li style=\"font-size:14px;line-height:1.8;color:#6b7280;\">We listen to how your business handles leads today</li>" +
        "<li style=\"font-size:14px;line-height:1.8;color:#6b7280;\">We run through the numbers together</li>" +
        "<li style=\"font-size:14px;line-height:1.8;color:#6b7280;\">If there is a fit, we show you exactly what the system does</li>" +
        "<li style=\"font-size:14px;line-height:1.8;color:#6b7280;\">No sales pressure</li></ul>" +
        "<p style=\"margin:0 0 8px;font-size:14px;line-height:1.6;color:#6b7280;\">Need to reschedule or cancel? Use the link in your Google Calendar confirmation email, or reply here and we will take care of it.</p>" +
        "<p style=\"margin:24px 0 0;font-size:15px;line-height:1.6;color:#374151;\">Looking forward to speaking with you, ' + firstName + '.</p>" +
        "<p style=\"margin:8px 0 0;font-size:15px;color:#374151;\">&mdash; Valfin Tech</p></td></tr>" +
        "<tr><td style=\"background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">" +
        "<p style=\"margin:0;font-size:12px;color:#9ca3af;\">Valfin Tech &middot; <a href=\"https://valfintech.com\" style=\"color:#9ca3af;text-decoration:none;\">valfintech.com</a></p>" +
        "</td></tr></table></td></tr></table></body></html>';\n" +
        "return [{ json: { ...lead, _emailHtml: html } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', _emailHtml: '<html>Conf</html>', _firstName: 'Test', _callDate: '2026-06-20', _callTime: '2:00 PM', _meetLink: 'https://meet.google.com/xxx-xxx-xxx' }]
});

const gmailConfirmation = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Confirmation Email',
    onError: 'continueRegularOutput',
    credentials: GMAIL_CRED,
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr('{{ $json.Email }}'),
      subject: "You're all set — we'll see you soon",
      emailType: 'html',
      message: expr('{{ $json._emailHtml }}'),
      options: { appendAttribution: false }
    }
  },
  output: [{ id: 'msg3', threadId: 'thread3', labelIds: ['SENT'] }]
});

const prepConfirmationUpdate = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep Confirmation Update',
    parameters: {
      jsCode:
        "const lead = $('Build Confirmation Email').item.json;\n" +
        "return [{ json: { 'Lead ID': lead['Lead ID'], 'Confirmation Email Sent': new Date().toISOString() } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', 'Confirmation Email Sent': '2026-06-16T14:00:00.000Z' }]
});

const sheetsConfirmationUpdate = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Confirmation Sent',
    credentials: SHEETS_CRED,
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Lead ID'],
        value: { 'Lead ID': expr("{{ $json['Lead ID'] }}"), 'Confirmation Email Sent': expr("{{ $json['Confirmation Email Sent'] }}") },
        schema: [
          { id: 'Lead ID', displayName: 'Lead ID', required: false, defaultMatch: true, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Confirmation Email Sent', displayName: 'Confirmation Email Sent', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ]
      },
      options: {}
    }
  },
  output: [{}]
});

// ── CASE 1: 2-HOUR REMINDER EMAIL ─────────────────────────────────────

const buildReminderEmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build 2h Reminder Email',
    parameters: {
      jsCode:
        "const lead = $input.first().json;\n" +
        "const firstName = lead._firstName || 'there';\n" +
        "const callDate = lead._callDate || 'today';\n" +
        "const callTime = lead._callTime || 'shortly';\n" +
        "const meetLink = lead._meetLink || '';\n" +
        "const meetBtn = meetLink ? '<table cellpadding=\"0\" cellspacing=\"0\" style=\"margin:24px 0;\"><tr><td style=\"background:#059669;border-radius:6px;\"><a href=\"' + meetLink + '\" style=\"display:block;padding:14px 28px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;\">Join Google Meet &rarr;</a></td></tr></table>' : '';\n" +
        "const html = '<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head>" +
        "<body style=\"margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f5f5f5;padding:40px 20px;\"><tr><td align=\"center\">" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;background:#fff;border-radius:8px;overflow:hidden;\">" +
        "<tr><td style=\"background:#0f0f0f;padding:28px 40px;\"><p style=\"margin:0;font-size:20px;font-weight:700;color:#fff;\">Valfin Tech</p></td></tr>" +
        "<tr><td style=\"padding:40px;\">" +
        "<p style=\"margin:0 0 8px;font-size:13px;font-weight:600;color:#d97706;text-transform:uppercase;letter-spacing:0.5px;\">REMINDER</p>" +
        "<p style=\"margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;\">Your discovery call starts in 2 hours.</p>" +
        "<table cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:8px;\">" +
        "<tr><td style=\"padding:16px 20px;\"><p style=\"margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;\">Date</p><p style=\"margin:0;font-size:15px;color:#111827;font-weight:600;\">' + callDate + '</p></td></tr>" +
        "<tr><td style=\"padding:16px 20px;border-top:1px solid #e5e7eb;\"><p style=\"margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;\">Time</p><p style=\"margin:0;font-size:15px;color:#111827;font-weight:600;\">' + callTime + ' ET</p></td></tr></table>" +
        "' + meetBtn + '" +
        "<p style=\"margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;\">Looking forward to speaking with you.</p>" +
        "<p style=\"margin:0 0 8px;font-size:14px;line-height:1.6;color:#6b7280;\">Need to reschedule or cancel? Reply to this email and we will take care of it right away.</p>" +
        "<p style=\"margin:24px 0 0;font-size:15px;color:#374151;\">&mdash; Valfin Tech</p></td></tr>" +
        "<tr><td style=\"background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">" +
        "<p style=\"margin:0;font-size:12px;color:#9ca3af;\">Valfin Tech &middot; <a href=\"https://valfintech.com\" style=\"color:#9ca3af;text-decoration:none;\">valfintech.com</a></p>" +
        "</td></tr></table></td></tr></table></body></html>';\n" +
        "return [{ json: { ...lead, _emailHtml: html } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', _emailHtml: '<html>Reminder</html>', _firstName: 'Test', _callDate: '2026-06-20', _callTime: '2:00 PM' }]
});

const gmailReminder = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send 2h Reminder Email',
    onError: 'continueRegularOutput',
    credentials: GMAIL_CRED,
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr('{{ $json.Email }}'),
      subject: 'Reminder: Your discovery call starts in 2 hours',
      emailType: 'html',
      message: expr('{{ $json._emailHtml }}'),
      options: { appendAttribution: false }
    }
  },
  output: [{ id: 'msg4', threadId: 'thread4', labelIds: ['SENT'] }]
});

const prepReminderUpdate = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep Reminder Update',
    parameters: {
      jsCode:
        "const lead = $('Build 2h Reminder Email').item.json;\n" +
        "return [{ json: { 'Lead ID': lead['Lead ID'], 'Reminder Email Sent': new Date().toISOString() } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', 'Reminder Email Sent': '2026-06-16T14:00:00.000Z' }]
});

const sheetsReminderUpdate = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Reminder Sent',
    credentials: SHEETS_CRED,
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Lead ID'],
        value: { 'Lead ID': expr("{{ $json['Lead ID'] }}"), 'Reminder Email Sent': expr("{{ $json['Reminder Email Sent'] }}") },
        schema: [
          { id: 'Lead ID', displayName: 'Lead ID', required: false, defaultMatch: true, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Reminder Email Sent', displayName: 'Reminder Email Sent', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ]
      },
      options: {}
    }
  },
  output: [{}]
});

// ── Workflow composition ───────────────────────────────────────────────
export default workflow('valfin-confirmation-reminder', 'Valfin — Discovery Call Confirmation & Reminder')
  .add(hourlyTrigger)
  .to(readLeads)
  .to(classifyBooked)
  .to(
    actionSwitch
      .onCase(0, buildConfirmationEmail.to(gmailConfirmation).to(prepConfirmationUpdate).to(sheetsConfirmationUpdate))
      .onCase(1, buildReminderEmail.to(gmailReminder).to(prepReminderUpdate).to(sheetsReminderUpdate))
  );
