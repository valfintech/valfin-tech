import { workflow, node, trigger, switchCase, newCredential, expr } from '@n8n/workflow-sdk';

// Workflow C — Valfin Discovery Call Status Handler
// ID: qV1lLTRYSPK4oOOJ
// Trigger: Google Sheets Trigger, polls every minute, watches Booking Status column
// Routes: Booked → fetches calendar event → sends confirmation + auto-fills call details
//         Needs Reschedule → sends reschedule proposal email
// Idempotency: checks Confirmation Email Sent / Reschedule Email Sent before acting
// UPDATE BOOKING_LINK IN TWO PLACES BELOW after Google Calendar setup

const SHEET_ID = '1eCzFh9jrzlqFGu9BoXLAsZ7a76tN7oTApm_bVG2n-zg';
const BOOKING_LINK = 'https://calendar.google.com/calendar/appointments/schedules/REPLACE_WITH_YOUR_SCHEDULE_ID';

const sheetsTrigger = trigger({
  type: 'n8n-nodes-base.googleSheetsTrigger',
  version: 1,
  config: {
    name: 'Booking Status Changed',
    credentials: { googleSheetsTriggerOAuth2Api: { id: '14j6qdr9iGD8pjqU', name: 'Google Sheets account' } },
    parameters: {
      pollTimes: { item: [{ mode: 'everyMinute' }] },
      documentId: { __rl: true, mode: 'id', value: SHEET_ID },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      event: 'rowUpdate',
      includeInOutput: 'new',
      options: { columnsToWatch: ['Booking Status'] }
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', Name: 'Test Lead', 'Booking Status': 'Booked', 'Confirmation Email Sent': '', 'Reschedule Email Sent': '', 'Alternative Date': '', 'Alternative Time': '', row_number: 2 }]
});

const routeStatus = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Route Booking Status',
    parameters: {
      jsCode: "const BOOKING_LINK = 'https://calendar.google.com/calendar/appointments/schedules/REPLACE_WITH_YOUR_SCHEDULE_ID';\nconst results = [];\nfor (const item of $input.all()) {\n  const row = item.json;\n  const bookingStatus = row['Booking Status'] || '';\n  const email = row['Email'] || '';\n  const leadId = row['Lead ID'] || '';\n  if (!email || !leadId) continue;\n  const firstName = (row['Name'] || '').split(' ')[0] || 'there';\n  if (bookingStatus === 'Booked' && !row['Confirmation Email Sent']) {\n    results.push({ json: { ...row, _action: 'booked', _firstName: firstName } });\n  } else if (bookingStatus === 'Needs Reschedule' && !row['Reschedule Email Sent']) {\n    const altDate = row['Alternative Date'] || '';\n    const altTime = row['Alternative Time'] || '';\n    if (altDate && altTime) {\n      results.push({ json: { ...row, _action: 'needs_reschedule', _firstName: firstName, _altDate: altDate, _altTime: altTime, _bookingLink: BOOKING_LINK } });\n    }\n  }\n}\nreturn results;"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', _action: 'booked', _firstName: 'Test', 'Booking Status': 'Booked', 'Confirmation Email Sent': '', row_number: 2 }]
});

const routeByStatus = switchCase({
  version: 3.2,
  config: {
    name: 'Route by Booking Status',
    parameters: {
      rules: {
        values: [
          {
            outputKey: 'booked',
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
              conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'booked' }],
              combinator: 'and'
            }
          },
          {
            outputKey: 'reschedule',
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
              conditions: [{ leftValue: expr('{{ $json._action }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'needs_reschedule' }],
              combinator: 'and'
            }
          }
        ]
      },
      options: {}
    }
  }
});

const fetchCalendarEvent = node({
  type: 'n8n-nodes-base.googleCalendar',
  version: 1.3,
  config: {
    name: 'Fetch Calendar Event',
    alwaysOutputData: true,
    credentials: { googleCalendarOAuth2Api: newCredential('Google Calendar account') },
    parameters: {
      resource: 'event',
      operation: 'getAll',
      calendar: { __rl: true, mode: 'id', value: 'primary' },
      returnAll: false,
      limit: 1,
      timeMin: expr('{{ $now.toISO() }}'),
      options: {
        query: expr('{{ $json.Email }}'),
        singleEvents: true,
        orderBy: 'startTime',
        fields: '*'
      }
    }
  },
  output: [{ id: 'event-id', summary: 'Discovery Call', start: { dateTime: '2026-06-20T14:00:00-04:00', timeZone: 'America/New_York' }, conferenceData: { entryPoints: [{ entryPointType: 'video', uri: 'https://meet.google.com/abc-defg-hij' }] } }]
});

const extractEventDetails = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Extract Event Details',
    parameters: {
      jsCode:
        "const lead = $('Route Booking Status').item.json;\n" +
        "let calDate = '';\n" +
        "let calTime = '';\n" +
        "let meetLink = '';\n" +
        "const events = $input.all();\n" +
        "if (events.length > 0) {\n" +
        "  const ev = events[0].json;\n" +
        "  const entryPoints = (ev.conferenceData && ev.conferenceData.entryPoints) || [];\n" +
        "  for (const ep of entryPoints) {\n" +
        "    if (ep.entryPointType === 'video' && ep.uri) { meetLink = ep.uri; break; }\n" +
        "  }\n" +
        "  const startRaw = (ev.start && ev.start.dateTime) || '';\n" +
        "  if (startRaw) {\n" +
        "    calDate = startRaw.split('T')[0];\n" +
        "    const timePart = (startRaw.split('T')[1] || '').replace(/([+-]\\d{2}:\\d{2}|Z)$/, '');\n" +
        "    const segments = timePart.split(':');\n" +
        "    const h = parseInt(segments[0]) || 0;\n" +
        "    const m = parseInt(segments[1]) || 0;\n" +
        "    const period = h >= 12 ? 'PM' : 'AM';\n" +
        "    const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);\n" +
        "    const tz = (ev.start && ev.start.timeZone) || '';\n" +
        "    const tzLabel = tz.indexOf('New_York') !== -1 ? 'ET' : tz.indexOf('Pacific') !== -1 ? 'PT' : tz.indexOf('Chicago') !== -1 ? 'CT' : 'ET';\n" +
        "    calTime = h12 + ':' + String(m).padStart(2, '0') + ' ' + period + ' ' + tzLabel;\n" +
        "  }\n" +
        "}\n" +
        "return [{ json: { ...lead, _calDate: calDate, _calTime: calTime, _meetLink: meetLink } }];"
    }
  },
  output: [{ 'Lead ID': 'VLEAD-TEST', Email: 'test@example.com', _action: 'booked', _firstName: 'Test', _calDate: '2026-06-20', _calTime: '2:00 PM ET', _meetLink: 'https://meet.google.com/abc-defg-hij', row_number: 2 }]
});

const buildConfirmation = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Confirmation Email',
    parameters: {
      jsCode: "const row = $input.item.json;\nconst firstName = row._firstName || 'there';\nconst subject = 'Your Discovery Call with Valfin Tech Is Confirmed';\nconst html = '<div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a\">' +\n  '<div style=\"background:#0a0a0a;padding:24px 32px;border-radius:8px 8px 0 0\">' +\n  '<span style=\"color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px\">Valfin Tech</span>' +\n  '</div>' +\n  '<div style=\"background:#fff;padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px\">' +\n  '<h2 style=\"margin:0 0 16px;font-size:22px;font-weight:700\">Your discovery call is confirmed, ' + firstName + '.</h2>' +\n  '<p style=\"margin:0 0 16px;color:#444;line-height:1.6\">We have accepted your booking and we are looking forward to speaking with you.</p>' +\n  '<p style=\"margin:0 0 16px;color:#444;line-height:1.6\">Your calendar invitation from Google contains all the details, including the date, time, and Google Meet link.</p>' +\n  '<p style=\"margin:0 0 24px;color:#444;line-height:1.6\">If anything changes, you can use the reschedule or cancellation links in that invitation.</p>' +\n  '<p style=\"margin:0 0 4px;color:#1a1a1a;font-weight:600\">Talk soon,</p>' +\n  '<p style=\"margin:0;color:#1a1a1a;font-weight:600\">Valfin Tech</p>' +\n  '</div>' +\n'</div>';\nreturn [{ json: { ...row, _subject: subject, _html: html } }];"
    }
  },
  output: [{ _subject: 'Your Discovery Call with Valfin Tech Is Confirmed', _html: '<div>...</div>', Email: 'test@example.com', _calDate: '2026-06-20', _calTime: '2:00 PM ET', _meetLink: 'https://meet.google.com/abc-defg-hij', row_number: 2 }]
});

const sendConfirmation = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Confirmation Email',
    credentials: { gmailOAuth2: { id: 'p0CURt6WXyab0h8P', name: 'Gmail OAuth2 API' } },
    onError: 'continueRegularOutput',
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr("{{ $('Build Confirmation Email').item.json.Email }}"),
      subject: expr("{{ $('Build Confirmation Email').item.json._subject }}"),
      emailType: 'html',
      message: expr("{{ $('Build Confirmation Email').item.json._html }}"),
      options: {}
    }
  },
  output: [{ id: 'msg-001', threadId: 'thread-001', labelIds: ['SENT'] }]
});

const prepConfirmationUpdate = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep Confirmation Update',
    parameters: {
      jsCode:
        "const row = $('Build Confirmation Email').item.json;\n" +
        "const now = new Date().toISOString();\n" +
        "return [{ json: {\n" +
        "  row_number: row['row_number'],\n" +
        "  'Confirmation Email Sent': now,\n" +
        "  'Discovery Call Date': row._calDate || '',\n" +
        "  'Discovery Call Time': row._calTime || '',\n" +
        "  'Meet Link': row._meetLink || ''\n" +
        "} }];"
    }
  },
  output: [{ row_number: 2, 'Confirmation Email Sent': '2026-06-16T12:00:00.000Z', 'Discovery Call Date': '2026-06-20', 'Discovery Call Time': '2:00 PM ET', 'Meet Link': 'https://meet.google.com/abc-defg-hij' }]
});

const markConfirmationSent = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Confirmation Sent',
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
          'Confirmation Email Sent': expr("{{ $json['Confirmation Email Sent'] }}"),
          'Discovery Call Date': expr("{{ $json['Discovery Call Date'] }}"),
          'Discovery Call Time': expr("{{ $json['Discovery Call Time'] }}"),
          'Meet Link': expr("{{ $json['Meet Link'] }}")
        }
      },
      options: { cellFormat: 'USER_ENTERED' }
    }
  },
  output: [{ updatedRange: 'Leads!A2:Z2' }]
});

const buildReschedule = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Reschedule Email',
    parameters: {
      jsCode: "const row = $input.item.json;\nconst firstName = row._firstName || 'there';\nconst altDate = row._altDate;\nconst altTime = row._altTime;\nconst bookingLink = row._bookingLink;\nconst subject = \"Let's Find a Better Time\";\nconst html = '<div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a\">' +\n  '<div style=\"background:#0a0a0a;padding:24px 32px;border-radius:8px 8px 0 0\">' +\n  '<span style=\"color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px\">Valfin Tech</span>' +\n  '</div>' +\n  '<div style=\"background:#fff;padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px\">' +\n  '<h2 style=\"margin:0 0 16px;font-size:22px;font-weight:700\">Let\\'s find a better time, ' + firstName + '.</h2>' +\n  '<p style=\"margin:0 0 16px;color:#444;line-height:1.6\">Thank you for scheduling your discovery call with Valfin Tech.</p>' +\n  '<p style=\"margin:0 0 16px;color:#444;line-height:1.6\">Unfortunately, we will not be available at the originally selected time.</p>' +\n  '<p style=\"margin:0 0 8px;color:#444;line-height:1.6\">Would this alternative work for you?</p>' +\n  '<div style=\"background:#f5f5f5;border-radius:6px;padding:16px 20px;margin:0 0 24px\">' +\n  '<p style=\"margin:0 0 4px;font-weight:600;color:#1a1a1a\">Proposed Date: ' + altDate + '</p>' +\n  '<p style=\"margin:0;font-weight:600;color:#1a1a1a\">Proposed Time: ' + altTime + '</p>' +\n  '</div>' +\n  '<p style=\"margin:0 0 16px;color:#444;line-height:1.6\">If this works, simply reply to this email to confirm.</p>' +\n  '<p style=\"margin:0 0 24px;color:#444;line-height:1.6\">Otherwise, you are welcome to select another time using the link below.</p>' +\n  '<a href=\"' + bookingLink + '\" style=\"display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:15px\">Select Another Time</a>' +\n  '<p style=\"margin:24px 0 4px;color:#444;line-height:1.6\">We apologize for the inconvenience and appreciate your flexibility.</p>' +\n  '<p style=\"margin:0 0 4px;color:#1a1a1a;font-weight:600\">Best,</p>' +\n  '<p style=\"margin:0;color:#1a1a1a;font-weight:600\">Valfin Tech</p>' +\n  '</div>' +\n'</div>';\nreturn [{ json: { ...row, _subject: subject, _html: html } }];"
    }
  },
  output: [{ _subject: "Let's Find a Better Time", _html: '<div>...</div>', Email: 'test@example.com', row_number: 2 }]
});

const sendReschedule = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Reschedule Email',
    credentials: { gmailOAuth2: { id: 'p0CURt6WXyab0h8P', name: 'Gmail OAuth2 API' } },
    onError: 'continueRegularOutput',
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr("{{ $('Build Reschedule Email').item.json.Email }}"),
      subject: expr("{{ $('Build Reschedule Email').item.json._subject }}"),
      emailType: 'html',
      message: expr("{{ $('Build Reschedule Email').item.json._html }}"),
      options: {}
    }
  },
  output: [{ id: 'msg-002', threadId: 'thread-002', labelIds: ['SENT'] }]
});

const prepRescheduleUpdate = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prep Reschedule Update',
    parameters: {
      jsCode: "const row = $('Build Reschedule Email').item.json;\nconst now = new Date().toISOString();\nreturn [{ json: { row_number: row['row_number'], 'Reschedule Email Sent': now } }];"
    }
  },
  output: [{ row_number: 2, 'Reschedule Email Sent': '2026-06-16T12:00:00.000Z' }]
});

const markRescheduleSent = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Reschedule Sent',
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
          'Reschedule Email Sent': expr("{{ $json['Reschedule Email Sent'] }}")
        }
      },
      options: { cellFormat: 'USER_ENTERED' }
    }
  },
  output: [{ updatedRange: 'Leads!A2:Z2' }]
});

export default workflow('valfin-status-handler-v2', 'Valfin — Discovery Call Status Handler')
  .add(sheetsTrigger)
  .to(routeStatus)
  .to(routeByStatus
    .onCase(0, fetchCalendarEvent.to(extractEventDetails).to(buildConfirmation).to(sendConfirmation).to(prepConfirmationUpdate).to(markConfirmationSent))
    .onCase(1, buildReschedule.to(sendReschedule).to(prepRescheduleUpdate).to(markRescheduleSent))
  );
