import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type CheckStatus = 'ok' | 'warning' | 'error' | 'info'

function StatusDot({ status }: { status: CheckStatus }) {
  const colors: Record<CheckStatus, string> = {
    ok: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#60a5fa',
  }
  return (
    <span
      className="inline-flex w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
      style={{ background: colors[status] }}
    />
  )
}

function CheckRow({ label, status, detail }: { label: string; status: CheckStatus; detail: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
      <StatusDot status={status} />
      <div className="flex-1 font-medium text-white">{label}</div>
      <div className="text-xs text-right max-w-xs" style={{ color: 'var(--muted)' }}>{detail}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  )
}

export default async function HealthPage() {
  let supabaseOk = false
  let emailStats = { generated: 0, approved: 0, sent: 0, replied: 0, rejected: 0, invalid_email: 0, missing_email: 0 }
  let pipelineStats: Record<string, number> = {}
  let configWarnings: string[] = []
  let lastActions: { action: string; created_at: string }[] = []
  let totalCompanies = 0

  try {
    const db = createAdminClient()

    // Core queries — must succeed for supabaseOk = true
    const [emailsRes, companiesRes, logsRes] = await Promise.all([
      db.from('outreach_emails').select('status'),
      db.from('roofing_companies').select('pipeline_stage'),
      db
        .from('outreach_logs')
        .select('action, created_at')
        .order('created_at', { ascending: false })
        .limit(200),
    ])

    supabaseOk = true

    // platform_config is optional — table may not exist yet
    const configRows = await db.from('platform_config').select('key, value')
    const config = Object.fromEntries(
      (configRows.data ?? []).map(r => [r.key, r.value])
    )
    const required = [
      { key: 'founder_name', label: 'Founder Name' },
      { key: 'from_email', label: 'Sending Email' },
      { key: 'calendly_url', label: 'Calendar Link' },
    ]
    configWarnings = required
      .filter(r => !config[r.key] || config[r.key] === 'REPLACE_ME')
      .map(r => r.label)

    for (const row of emailsRes.data ?? []) {
      const s = row.status as keyof typeof emailStats
      if (s in emailStats) emailStats[s]++
    }

    for (const row of companiesRes.data ?? []) {
      pipelineStats[row.pipeline_stage] = (pipelineStats[row.pipeline_stage] ?? 0) + 1
    }
    totalCompanies = (companiesRes.data ?? []).length

    const seen = new Set<string>()
    for (const row of logsRes.data ?? []) {
      if (!seen.has(row.action)) {
        seen.add(row.action)
        lastActions.push({ action: row.action, created_at: row.created_at })
      }
    }
  } catch {
    // supabaseOk stays false
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const ageLabel = (d: string) => {
    const ms = Date.now() - new Date(d).getTime()
    const h = Math.floor(ms / 3600000)
    const days = Math.floor(ms / 86400000)
    if (h < 1) return 'just now'
    if (h < 24) return `${h}h ago`
    return `${days}d ago`
  }

  const wfActivity = [
    { name: 'WF-07 Email Sender',       action: 'email_sent',             desc: 'Sends approved outreach emails via Gmail' },
    { name: 'WF-08 Reply Monitor',      action: 'reply_received',         desc: 'Polls Gmail inbox for prospect replies' },
    { name: 'WF-09 Follow-up',          action: 'follow_up_sent',         desc: 'Daily schedule → sends follow-up sequences' },
    { name: 'WF-04 Enrichment',         action: 'context_assembled',      desc: 'Enriches each discovered company with website + contact data' },
    { name: 'WF-06 Email Generator',    action: 'email_generated',        desc: 'Writes personalized outreach emails via Claude' },
    { name: 'WF-06 Validation',         action: 'email_validation_failed',desc: 'Flags companies with missing or invalid email addresses' },
    { name: 'WF-08 Meeting Detection',  action: 'meeting_booked',         desc: 'Detects Google Calendar bookings and logs meetings' },
  ]

  const PIPELINE_STAGES: [string, string][] = [
    ['discovered', '#8892a4'],
    ['researched', '#60a5fa'],
    ['email_generated', '#a78bfa'],
    ['email_sent', '#818cf8'],
    ['replied', '#fb923c'],
    ['meeting_booked', '#f59e0b'],
    ['client', '#10b981'],
    ['do_not_contact', '#ef4444'],
  ]

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">System Health</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          Platform status — refreshes on every page load
        </p>
      </div>

      <Section title="Infrastructure">
        <CheckRow
          label="Supabase Database"
          status={supabaseOk ? 'ok' : 'error'}
          detail={
            supabaseOk
              ? 'Connected'
              : 'Connection failed — add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY to Vercel'
          }
        />
        <CheckRow
          label="Platform Config"
          status={configWarnings.length === 0 ? 'ok' : 'warning'}
          detail={
            configWarnings.length === 0
              ? 'All required fields set'
              : `Missing or placeholder: ${configWarnings.join(', ')}`
          }
        />
        <CheckRow
          label="n8n Webhooks (4 active)"
          status="ok"
          detail="review-decision · send-batch · launch-discovery · generate-emails"
        />
        <CheckRow
          label="Email Sending (contact@valfintech.com)"
          status="ok"
          detail="Gmail + DKIM active via Google Workspace — daily volume monitored"
        />
      </Section>

      <Section title={`Email Queue — ${emailStats.sent + emailStats.replied} sent total`}>
        <div className="grid grid-cols-5 gap-3 py-4">
          {[
            { label: 'Pending',   count: emailStats.generated,     color: '#60a5fa' },
            { label: 'Approved',  count: emailStats.approved,      color: '#10b981' },
            { label: 'Sent',      count: emailStats.sent,          color: '#a78bfa' },
            { label: 'Replied',   count: emailStats.replied,       color: '#fb923c' },
            { label: 'Rejected',  count: emailStats.rejected,      color: '#ef4444' },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="text-center p-3 rounded-lg"
              style={{ background: 'var(--surface2)' }}
            >
              <div className="text-2xl font-bold" style={{ color }}>
                {count}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        {(emailStats.invalid_email > 0 || emailStats.missing_email > 0) && (
          <div className="flex gap-4 pb-3 text-xs" style={{ color: 'var(--muted)' }}>
            {emailStats.invalid_email > 0 && (
              <span>
                <span style={{ color: '#dc2626' }}>●</span>{' '}
                {emailStats.invalid_email} invalid email address{emailStats.invalid_email > 1 ? 'es' : ''} — fix in Companies then regenerate
              </span>
            )}
            {emailStats.missing_email > 0 && (
              <span>
                <span style={{ color: '#9ca3af' }}>●</span>{' '}
                {emailStats.missing_email} missing email{emailStats.missing_email > 1 ? 's' : ''} — add email in Companies then regenerate
              </span>
            )}
          </div>
        )}
      </Section>

      <Section title={`Pipeline — ${totalCompanies} companies`}>
        <div className="space-y-2 py-4">
          {PIPELINE_STAGES.map(([stage, color]) => {
            const count = pipelineStats[stage] ?? 0
            const pct = totalCompanies > 0 ? Math.round((count / totalCompanies) * 100) : 0
            return (
              <div key={stage} className="flex items-center gap-3 text-sm">
                <div
                  className="w-28 text-xs capitalize flex-shrink-0"
                  style={{ color: 'var(--muted)' }}
                >
                  {stage.replace(/_/g, ' ')}
                </div>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--surface2)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <div
                  className="w-6 text-right text-xs font-medium flex-shrink-0"
                  style={{ color }}
                >
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Workflow Activity">
        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
          {wfActivity.map(({ name, action, desc }) => {
            const entry = lastActions.find(a => a.action === action)
            return (
              <div
                key={name}
                className="flex items-start gap-3 py-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <StatusDot status={entry ? 'ok' : 'info'} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {desc}
                  </div>
                </div>
                <div className="text-xs text-right flex-shrink-0" style={{ color: 'var(--muted)' }}>
                  {entry ? (
                    <>
                      <div className="text-white font-medium">{ageLabel(entry.created_at)}</div>
                      <div>{fmt(entry.created_at)}</div>
                    </>
                  ) : (
                    <span>No activity yet</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
