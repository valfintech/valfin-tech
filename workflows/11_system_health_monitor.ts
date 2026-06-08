// Workflow 11 — System Health Monitor
// Created 2026-06-07. Closes the "Open Item" flagged in ONBOARDING_SOP.md / CLIENT_DEPLOYMENT_GUIDE.md §6:
// "no automated system-health monitoring... manual weekly spot-checks are *your* job until this workflow exists."
//
// PURPOSE: alert the OPERATOR (not the client) — by SMS, daily — when the live system shows signs that a
// scheduled workflow may not have run as expected. This is retention-critical infrastructure: it protects
// the relationship with client #1 by catching "the reminders silently stopped going out" or "follow-ups
// stopped sending" BEFORE the client notices and loses trust — exactly the thing manual weekly spot-checks
// are too slow and too easy to skip to reliably catch.
//
// DESIGN PRINCIPLE: monitor BUSINESS-OUTCOME FRESHNESS in the live CRM data, not n8n's internal execution
// metadata. This was a deliberate choice — querying n8n's own REST API for execution history would require
// a new `n8nApi`-type credential that does not exist in this instance (confirmed via list_credentials), and
// creating one requires UI access this session doesn't have. Checking actual CRM data freshness instead:
//   (a) requires zero new credentials (reuses the existing Google Sheets + Twilio credentials),
//   (b) catches a STRICTLY LARGER set of failure modes — a workflow that "succeeds" in n8n's eyes but writes
//       wrong data, or silently no-ops on a schema change, would pass an execution-status check but fail
//       a data-freshness check, and
//   (c) mirrors the exact "due for X" logic the live workflows themselves use (see comments in each Code
//       node), so an alert here means "the live workflow's own definition of 'should have happened by now'
//       was not met" — not a guess at a different threshold that could cry wolf.
//
// Two checks run in parallel, merge into one report, and trigger exactly one summary SMS — only if there's
// something to report (the "zero issues" case naturally produces zero downstream items; no IF-gate needed,
// per the SDK's zero-item-safety guidance).
//
//   Check 1 — Appointment Reminders (mirrors workflow 09 "Appointment Reminders," bJcO5ox2u190bxTr):
//     flags any `Status: Scheduled` appointment that is within its 24h or 2h reminder window — using the
//     IDENTICAL date-parsing, +5h offset, and [20,28]/[1,3] hour-window logic workflow 09 itself uses —
//     AND still shows an empty `Reminder 24h` / `Reminder 2h` flag, AND the window has been open long enough
//     (a ~2h / ~1h buffer) that the hourly check should have had at least two/one chance(s) to fire.
//
//   Check 2 — Follow-Up Sequence (mirrors workflow 05 "Follow-Up Sequence," chYfABnQdnPfiHQx):
//     flags any `Status: New|Contacted` lead with `Follow-up Count < 3` whose hours-since-last-contact has
//     exceeded that lead's threshold (24h / 72h / 96h, exactly as workflow 05 defines them) by more than a
//     ~30-hour buffer (one missed daily 9 AM run, plus margin) — using the identical `Last Contact ||
//     Date Created` fallback and native-Date parsing workflow 05 uses.
//
// PER-CLIENT NOTE (cross-reference CLIENT_DEPLOYMENT_GUIDE.md §3): the schedule-trigger time, the owner-phone
// `to` number, the Twilio `from` number, and the CRM spreadsheet ID below are all Valfin-Tech-specific values
// that must be re-pointed for every new client clone — exactly like every other workflow in this build. This
// workflow has been added to that guide's catalog (§3a/§3d) and §6's "optional enhancements" entry has been
// marked complete.

import { workflow, node, trigger, merge, newCredential, expr } from '@n8n/workflow-sdk';

const CRM_SPREADSHEET_ID = '1MxmJouteZhi1K_-KOwgBlJtBFAXtm2G_0H555otTHBQ';
const OWNER_PHONE = '+18575261499';   // per-client value — see CLIENT_DEPLOYMENT_GUIDE.md §3a "Owner phone"
const TWILIO_FROM_NUMBER = '+18889839308'; // per-client value — the client's verified Twilio sending number

// ---------------------------------------------------------------------------
// Trigger — once daily, well clear of both the hourly reminder checks and the
// 9 AM ET daily follow-up run, so a "should have happened by now" check is fair.
// 16:00 UTC = 11 AM EST / 12 PM EDT — comfortably past every relevant schedule
// regardless of daylight saving time.
// ---------------------------------------------------------------------------
const dailyHealthCheckTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Daily Health Check Trigger',
    parameters: {
      rule: { interval: [{ field: 'days', daysInterval: 1, triggerAtHour: 16, triggerAtMinute: 0 }] }
    }
  },
  output: [{ json: { 'Schedule Trigger': true } }]
});

// ---------------------------------------------------------------------------
// Branch 1 — Appointment Reminders check
// ---------------------------------------------------------------------------
const getAllAppointments = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Get All Appointments',
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: CRM_SPREADSHEET_ID, cachedResultName: 'Valfin CRM' },
      sheetName: { __rl: true, mode: 'name', value: 'Appointments' },
      options: {}
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Google Sheets account') }
  },
  output: [{ json: {
    'Appt ID': 'APT-1001', 'Customer Name': 'Jane Doe', 'Status': 'Scheduled',
    'Appt Date': '2026-06-08', 'Appt Time': '2:00 PM', 'Phone': '6175551234',
    'Service Type': 'roof inspection', 'Reminder 24h': '', 'Reminder 2h': ''
  } }]
});

const checkAppointmentReminders = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check Appointment Reminders',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "const items = $input.all();\n" +
        "const issues = [];\n" +
        "const now = new Date();\n" +
        "\n" +
        "// Mirrors workflow 09 'Appointment Reminders' (bJcO5ox2u190bxTr) date parsing EXACTLY:\n" +
        "// separate Date (YYYY-MM-DD) + Time (H:MM AM/PM) columns, combined with a flat +5h UTC offset\n" +
        "// (the live workflow does not adjust for DST -- mirroring it here, not 'fixing' it, is the point:\n" +
        "// an alert should fire only when the LIVE workflow's own definition of 'due' was not met).\n" +
        "for (const item of items) {\n" +
        "  const appt = item.json;\n" +
        "  const status = (appt['Status'] || '').toString().trim();\n" +
        "  if (status !== 'Scheduled') continue;\n" +
        "\n" +
        "  const dateStr = (appt['Appt Date'] || '').toString().trim();\n" +
        "  const timeStr = (appt['Appt Time'] || '').toString().trim();\n" +
        "  const dateMatch = dateStr.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);\n" +
        "  const timeMatch = timeStr.match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)$/i);\n" +
        "  if (!dateMatch || !timeMatch) continue; // unparseable -- the live workflow silently skips these too; a data-quality issue, not a 'missed reminder' issue\n" +
        "\n" +
        "  const year = parseInt(dateMatch[1], 10);\n" +
        "  const month = parseInt(dateMatch[2], 10);\n" +
        "  const day = parseInt(dateMatch[3], 10);\n" +
        "  let hour = parseInt(timeMatch[1], 10);\n" +
        "  const minute = parseInt(timeMatch[2], 10);\n" +
        "  const ampm = timeMatch[3].toUpperCase();\n" +
        "  if (ampm === 'PM' && hour !== 12) hour += 12;\n" +
        "  if (ampm === 'AM' && hour === 12) hour = 0;\n" +
        "\n" +
        "  const apptDateTime = new Date(Date.UTC(year, month - 1, day, hour + 5, minute));\n" +
        "  const hoursUntil = (apptDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);\n" +
        "  if (hoursUntil < 0) continue;\n" +
        "\n" +
        "  const reminder24Sent = (appt['Reminder 24h'] || '').toString().trim().length > 0;\n" +
        "  const reminder2Sent = (appt['Reminder 2h'] || '').toString().trim().length > 0;\n" +
        "  const name = appt['Customer Name'] || 'An appointment';\n" +
        "  const id = appt['Appt ID'] || '(no ID)';\n" +
        "\n" +
        "  // Live workflow's window is [20,28]h / [1,3]h, runs hourly. Flag only once the window has been\n" +
        "  // open long enough (~2h / ~1h buffer) that it should already have fired -- not the instant it opens.\n" +
        "  if (!reminder24Sent && hoursUntil >= 20 && hoursUntil <= 26) {\n" +
        "    issues.push({ json: {\n" +
        "      checkType: 'appointment_reminder', apptId: id, customerName: name, reminderType: '24-hour',\n" +
        "      hoursUntil: Math.round(hoursUntil * 10) / 10,\n" +
        "      detail: name + ' (' + id + ') is ~' + Math.round(hoursUntil) + 'h out and still missing its 24h reminder'\n" +
        "    }});\n" +
        "  }\n" +
        "  if (!reminder2Sent && hoursUntil >= 1 && hoursUntil <= 2) {\n" +
        "    issues.push({ json: {\n" +
        "      checkType: 'appointment_reminder', apptId: id, customerName: name, reminderType: '2-hour',\n" +
        "      hoursUntil: Math.round(hoursUntil * 10) / 10,\n" +
        "      detail: name + ' (' + id + ') is ~' + Math.round(hoursUntil) + 'h out and still missing its 2h reminder'\n" +
        "    }});\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "return issues;"
    }
  },
  output: [{ json: {
    checkType: 'appointment_reminder', apptId: 'APT-1001', customerName: 'Jane Doe',
    reminderType: '24-hour', hoursUntil: 24.3,
    detail: 'Jane Doe (APT-1001) is ~24h out and still missing its 24h reminder'
  } }]
});

// ---------------------------------------------------------------------------
// Branch 2 — Follow-Up Sequence check
// ---------------------------------------------------------------------------
const getAllLeadsForHealthCheck = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Get All Leads (Health Check)',
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: CRM_SPREADSHEET_ID, cachedResultName: 'Valfin CRM' },
      sheetName: { __rl: true, mode: 'name', value: 'Leads' },
      options: {}
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Google Sheets account') }
  },
  output: [{ json: {
    'Lead ID': 'LEAD-2001', 'First Name': 'John', 'Last Name': 'Smith', 'Status': 'New',
    'Follow-up Count': '0', 'Last Contact': '', 'Date Created': '2026-06-04T10:00:00Z', 'Phone': '6175559876'
  } }]
});

const checkFollowUpSequence = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check Follow-Up Sequence',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "const items = $input.all();\n" +
        "const issues = [];\n" +
        "const now = new Date();\n" +
        "\n" +
        "// Mirrors workflow 05 'Follow-Up Sequence' (chYfABnQdnPfiHQx) thresholds and fallback EXACTLY:\n" +
        "// Follow-up Count 0 -> due at 24h, 1 -> due at 72h, 2 -> due at 96h, since (Last Contact || Date Created),\n" +
        "// using native Date parsing (the live workflow's own 'unparseable = 9999h, always overdue' sentinel).\n" +
        "const thresholds = { 0: 24, 1: 72, 2: 96 };\n" +
        "const dayLabel = { 0: 1, 1: 3, 2: 7 };\n" +
        "const BUFFER_HOURS = 30; // one missed daily 9 AM run (~24h) plus a margin -- avoids flagging a lead that simply crossed its threshold a few hours ago and hasn't had its daily run yet\n" +
        "\n" +
        "for (const item of items) {\n" +
        "  const lead = item.json;\n" +
        "  const status = (lead['Status'] || '').toString().trim();\n" +
        "  if (status !== 'New' && status !== 'Contacted') continue;\n" +
        "\n" +
        "  const countRaw = parseInt(lead['Follow-up Count'], 10);\n" +
        "  const count = isNaN(countRaw) ? 0 : countRaw;\n" +
        "  if (count >= 3) continue;\n" +
        "\n" +
        "  const lastTouchRaw = (lead['Last Contact'] || lead['Date Created'] || '').toString().trim();\n" +
        "  let hoursSince = 9999;\n" +
        "  if (lastTouchRaw) {\n" +
        "    const parsed = new Date(lastTouchRaw);\n" +
        "    if (!isNaN(parsed.getTime())) {\n" +
        "      hoursSince = (now.getTime() - parsed.getTime()) / (1000 * 60 * 60);\n" +
        "    }\n" +
        "  }\n" +
        "\n" +
        "  const threshold = thresholds[count];\n" +
        "  if (hoursSince >= threshold + BUFFER_HOURS) {\n" +
        "    const name = ((lead['First Name'] || '') + ' ' + (lead['Last Name'] || '')).trim() || 'A lead';\n" +
        "    const id = lead['Lead ID'] || '(no ID)';\n" +
        "    const overdueBy = Math.round(hoursSince - threshold);\n" +
        "    issues.push({ json: {\n" +
        "      checkType: 'follow_up', leadId: id, customerName: name, followUpCount: count,\n" +
        "      hoursOverdue: overdueBy,\n" +
        "      detail: name + ' (' + id + ') looks ~' + overdueBy + 'h overdue for its Day-' + dayLabel[count] + ' follow-up'\n" +
        "    }});\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "return issues;"
    }
  },
  output: [{ json: {
    checkType: 'follow_up', leadId: 'LEAD-2001', customerName: 'John Smith', followUpCount: 0,
    hoursOverdue: 12, detail: 'John Smith (LEAD-2001) looks ~12h overdue for its Day-1 follow-up'
  } }]
});

// ---------------------------------------------------------------------------
// Merge both issue streams, then build (and conditionally send) the report.
// Zero-item safety: if neither check finds anything, the merge produces zero
// items, "Build Health Report" returns [], and the SMS node simply never runs
// -- no IF-gate needed, exactly per the SDK's documented zero-item pattern.
// ---------------------------------------------------------------------------
const combineHealthIssues = merge({
  version: 3.2,
  config: { name: 'Combine Health Issues', parameters: { mode: 'append' } }
});

const buildHealthReport = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Health Report',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "const items = $input.all();\n" +
        "if (items.length === 0) {\n" +
        "  return []; // nothing to report -- let the zero-item case silently skip the SMS node\n" +
        "}\n" +
        "\n" +
        "const lines = items.map(function (item, idx) { return (idx + 1) + '. ' + item.json.detail; });\n" +
        "const message = 'Valfin System Health Alert\\n\\n' +\n" +
        "  items.length + ' issue(s) detected that may indicate a scheduled workflow did not run as expected:\\n\\n' +\n" +
        "  lines.join('\\n') +\n" +
        "  '\\n\\nCheck n8n executions for Workflow 09 (Appointment Reminders) and/or Workflow 05 (Follow-Up Sequence). ' +\n" +
        "  'This is an automated freshness check, not a guarantee something is broken -- verify in the CRM before assuming the worst (could also be a one-off data-entry issue).';\n" +
        "\n" +
        "return [{ json: { issueCount: items.length, alertMessage: message } }];"
    }
  },
  output: [{ json: {
    issueCount: 1,
    alertMessage: 'Valfin System Health Alert\n\n1 issue(s) detected...\n\n1. Jane Doe (APT-1001) is ~24h out and still missing its 24h reminder\n\nCheck n8n executions for Workflow 09...'
  } }]
});

const sendHealthAlertSms = node({
  type: 'n8n-nodes-base.twilio',
  version: 1,
  config: {
    name: 'Send Health Alert SMS',
    parameters: {
      resource: 'sms',
      operation: 'send',
      from: TWILIO_FROM_NUMBER,
      to: OWNER_PHONE,
      message: expr('{{ $json.alertMessage }}')
    },
    credentials: { twilioApi: newCredential('Twilio account') }
  },
  output: [{ json: { sid: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', status: 'queued', to: OWNER_PHONE, from: TWILIO_FROM_NUMBER } }]
});

export default workflow('11_system_health_monitor', 'System Health Monitor')
  .add(dailyHealthCheckTrigger)
  .to(getAllAppointments.to(checkAppointmentReminders.to(combineHealthIssues.input(0))))
  .add(dailyHealthCheckTrigger)
  .to(getAllLeadsForHealthCheck.to(checkFollowUpSequence.to(combineHealthIssues.input(1))))
  .add(combineHealthIssues)
  .to(buildHealthReport)
  .to(sendHealthAlertSms);
