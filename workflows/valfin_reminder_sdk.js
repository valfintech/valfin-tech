import { workflow, node, trigger, expr } from '@n8n/workflow-sdk';

// Workflow D — Valfin Discovery Call Reminder
// ID: jrsUuEJI2kV7kDQL
// Trigger: Hourly schedule
// Logic: finds Booked leads with Discovery Call Date/Time set, call within 1-3 hours,
//        Reminder Email Sent empty → sends reminder email → marks Reminder Email Sent
// Meet Link is optional: shows green Join button if present, falls back to calendar invite message

const SHEET_ID = '1eCzFh9jrzlqFGu9BoXLAsZ7a76tN7oTApm_bVG2n-zg';

const scheduleTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: 'Every Hour',
    parameters: {
      rule: { interval: [{ field: 'hours', hoursInterval: 1 }] }
    }
  },
  output: [{ timestamp: '2026-06-16T12:00:00.000Z' }]
});

const readAllLeads = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read All Leads',
    credentials: { googleSheetsOAuth2Api: { id: '14j6qdr9iGD8pjqU', name: 'Google Sheets account' } },
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      filtersUI: {},
      options: {}
    }
  },
  output: [{ 'Lead ID': 'VLEAD-001', Email: 'lead@example.com', Name: 'Test Lead', 'Booking Status': 'Booked', 'Discovery Call Date': '2026-06-16', 'Discovery Call Time': '2:00 PM', 'Meet Link': '', 'Reminder Email Sent': '', row_number: 2 }]
});

const findLeadsNeedingReminder = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Find Leads Needing Reminder',
    parameters: {
      jsCode: "const results = [];\nconst nowUtc = new Date();\nfor (const item of $input.all()) {\n  const lead = item.json;\n  if (lead['Booking Status'] !== 'Booked') continue;\n  if (lead['Reminder Email Sent']) continue;\n  const callDate = lead['Discovery Call Date'] || '';\n  const callTime = lead['Discovery Call Time'] || '';\n  if (!callDate || !callTime) continue;\n  const email = lead['Email'] || '';\n  if (!email) continue;\n  const timeMatch = callTime.match(/(\\d+):(\\d+)\\s*(AM|PM)/i);\n  if (!timeMatch) continue;\n  let hours = parseInt(timeMatch[1]);\n  const minutes = parseInt(timeMatch[2]);\n  const period = timeMatch[3].toUpperCase();\n  if (period === 'PM' && hours !== 12) hours += 12;\n  if (period === 'AM' && hours === 12) hours = 0;\n  const callDateObj = new Date(callDate + 'T' + String(hours).padStart(2,'0') + ':' + String(minutes).padStart(2,'0') + ':00-04:00');\n  const hoursUntilCall = (callDateObj - nowUtc) / (1000 * 60 * 60);\n  if (hoursUntilCall >= 1 && hoursUntilCall <= 3) {\n    const firstName = (lead['Name'] || '').split(' ')[0] || 'there';\n    results.push({ json: { ...lead, _firstName: firstName, _callDate: callDate, _callTime: callTime } });\n  }\n}\nreturn results;"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-001', Email: 'lead@example.com', _firstName: 'Test', _callDate: '2026-06-16', _callTime: '2:00 PM', 'Meet Link': '', row_number: 2 }]
});

const buildReminderEmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Reminder Email',
    parameters: {
      jsCode: "const lead = $input.item.json;\nconst firstName = lead._firstName || 'there';\nconst callDate = lead._callDate;\nconst callTime = lead._callTime;\nconst meetLink = lead['Meet Link'] || '';\nconst subject = 'Reminder: Your Discovery Call Is Coming Up';\nconst meetSection = meetLink\n  ? '<a href=\"' + meetLink + '\" style=\"display:inline-block;background:#34a853;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:15px\">Join Google Meet</a>'\n  : '<p style=\"color:#444;line-height:1.6\">You can join using the Google Meet link in your calendar invitation.</p>';\nconst html = '<div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a\">' +\n  '<div style=\"background:#0a0a0a;padding:24px 32px;border-radius:8px 8px 0 0\">' +\n  '<span style=\"color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px\">Valfin Tech</span>' +\n  '</div>' +\n  '<div style=\"background:#fff;padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px\">' +\n  '<h2 style=\"margin:0 0 16px;font-size:22px;font-weight:700\">Your call is coming up, ' + firstName + '.</h2>' +\n  '<p style=\"margin:0 0 16px;color:#444;line-height:1.6\">Just a quick reminder that your discovery call with Valfin Tech is scheduled for:</p>' +\n  '<div style=\"background:#f5f5f5;border-radius:6px;padding:16px 20px;margin:0 0 24px\">' +\n  '<p style=\"margin:0 0 4px;font-weight:600;color:#1a1a1a\">Date: ' + callDate + '</p>' +\n  '<p style=\"margin:0;font-weight:600;color:#1a1a1a\">Time: ' + callTime + '</p>' +\n  '</div>' +\n  meetSection +\n  '<p style=\"margin:24px 0 4px;color:#444;line-height:1.6\">Looking forward to speaking with you.</p>' +\n  '<p style=\"margin:0 0 4px;color:#1a1a1a;font-weight:600\">Talk soon,</p>' +\n  '<p style=\"margin:0;color:#1a1a1a;font-weight:600\">Valfin Tech</p>' +\n  '</div>' +\n'</div>';\nreturn [{ json: { ...lead, _subject: subject, _html: html } }];"
    }
  },
  output: [{ _subject: 'Reminder: Your Discovery Call Is Coming Up', _html: '<div>...</div>', Email: 'lead@example.com', row_number: 2 }]
});

const sendReminderEmail = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Reminder Email',
    credentials: { gmailOAuth2: { id: 'p0CURt6WXyab0h8P', name: 'Gmail OAuth2 API' } },
    onError: 'continueRegularOutput',
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr("{{ $('Build Reminder Email').item.json.Email }}"),
      subject: expr("{{ $('Build Reminder Email').item.json._subject }}"),
      emailType: 'html',
      message: expr("{{ $('Build Reminder Email').item.json._html }}"),
      options: {}
    }
  },
  output: [{ id: 'msg-003', threadId: 'thread-003', labelIds: ['SENT'] }]
});

const prepReminderUpdate = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep Reminder Update',
    parameters: {
      jsCode: "const lead = $('Build Reminder Email').item.json;\nconst now = new Date().toISOString();\nreturn [{ json: { row_number: lead['row_number'], 'Reminder Email Sent': now } }];"
    }
  },
  output: [{ row_number: 2, 'Reminder Email Sent': '2026-06-16T12:00:00.000Z' }]
});

const markReminderSent = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Reminder Sent',
    credentials: { googleSheetsOAuth2Api: { id: '14j6qdr9iGD8pjqU', name: 'Google Sheets account' } },
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          'row_number': expr('{{ $json.row_number }}'),
          'Reminder Email Sent': expr("{{ $json['Reminder Email Sent'] }}")
        }
      },
      options: { cellFormat: 'USER_ENTERED' }
    }
  },
  output: [{ updatedRange: 'Leads!A2:Z2' }]
});

export default workflow('valfin-discovery-reminder', 'Valfin — Discovery Call Reminder')
  .add(scheduleTrigger)
  .to(readAllLeads)
  .to(findLeadsNeedingReminder)
  .to(buildReminderEmail)
  .to(sendReminderEmail)
  .to(prepReminderUpdate)
  .to(markReminderSent);
