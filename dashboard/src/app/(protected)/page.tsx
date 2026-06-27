import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface PipelineRow { pipeline_stage: string }
interface EmailRow { status: string }
interface ReplyRow { id: string }
interface MeetingRow { id: string }

export default async function OverviewPage() {
  const db = createAdminClient()

  const [
    { data: companies },
    { data: emails },
    { data: replies },
    { data: meetings },
    { data: logs },
  ] = await Promise.all([
    db.from('roofing_companies').select('pipeline_stage'),
    db.from('outreach_emails').select('status'),
    db.from('email_replies').select('id'),
    db.from('meetings').select('id'),
    db.from('outreach_logs').select('action, created_at, details').order('created_at', { ascending: false }).limit(15),
  ])

  const pipeline = (companies as PipelineRow[] | null) ?? []
  const emailList = (emails as EmailRow[] | null) ?? []

  const count = (arr: unknown[], key: string, val: string) =>
    (arr as Record<string,string>[]).filter((r) => r[key] === val).length

  const stats = {
    total:             pipeline.length,
    discovered:        count(pipeline, 'pipeline_stage', 'discovered'),
    researched:        count(pipeline, 'pipeline_stage', 'researched'),
    generated:         count(pipeline, 'pipeline_stage', 'email_generated'),
    sent:              count(pipeline, 'pipeline_stage', 'email_sent'),
    replied:           count(pipeline, 'pipeline_stage', 'replied'),
    meeting:           count(pipeline, 'pipeline_stage', 'meeting_booked'),
    client:            count(pipeline, 'pipeline_stage', 'client'),
    emailPending:      count(emailList, 'status', 'generated'),
    emailApproved:     count(emailList, 'status', 'approved'),
    emailSent:         count(emailList, 'status', 'sent'),
    emailReplied:      count(emailList, 'status', 'replied'),
    emailRejected:     count(emailList, 'status', 'rejected'),
    emailInvalid:      count(emailList, 'status', 'invalid_email'),
    emailMissing:      count(emailList, 'status', 'missing_email'),
    totalReplies:      (replies ?? []).length,
    totalMeetings:     (meetings ?? []).length,
  }

  const replyRate = stats.emailSent > 0
    ? ((stats.emailReplied / stats.emailSent) * 100).toFixed(1) + '%'
    : '—'

  const meetingRate = stats.emailSent > 0
    ? ((stats.totalMeetings / stats.emailSent) * 100).toFixed(1) + '%'
    : '—'

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Campaign health at a glance</p>
      </div>

      {/* Pipeline funnel */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
          Pipeline
        </h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {[
            { label: 'Total',     val: stats.total,      color: '#8892a4' },
            { label: 'Discovered',val: stats.discovered, color: '#8892a4' },
            { label: 'Researched',val: stats.researched, color: '#60a5fa' },
            { label: 'Generated', val: stats.generated,  color: '#a78bfa' },
            { label: 'Sent',      val: stats.sent,       color: '#818cf8' },
            { label: 'Replied',   val: stats.replied,    color: '#fb923c' },
            { label: 'Meeting',   val: stats.meeting,    color: '#f59e0b' },
            { label: 'Client',    val: stats.client,     color: '#10b981' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Email stats + rates */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
            Emails
          </h2>
          <div className="rounded-xl border p-5 space-y-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {[
              { label: 'Pending review', val: stats.emailPending,  color: '#60a5fa' },
              { label: 'Approved',       val: stats.emailApproved, color: '#10b981' },
              { label: 'Sent',           val: stats.emailSent,     color: '#a78bfa' },
              { label: 'Replied',        val: stats.emailReplied,  color: '#fb923c' },
              { label: 'Rejected',       val: stats.emailRejected, color: '#ef4444' },
              ...(stats.emailInvalid > 0 ? [{ label: 'Invalid email', val: stats.emailInvalid, color: '#dc2626' }] : []),
              ...(stats.emailMissing > 0 ? [{ label: 'No email',      val: stats.emailMissing, color: '#9ca3af' }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                <span className="font-semibold" style={{ color: row.color }}>{row.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
            Performance
          </h2>
          <div className="rounded-xl border p-5 space-y-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {[
              { label: 'Reply rate',   val: replyRate,   note: `${stats.emailReplied} / ${stats.emailSent} sent` },
              { label: 'Meeting rate', val: meetingRate, note: `${stats.totalMeetings} meetings booked` },
              { label: 'Total replies',val: String(stats.totalReplies), note: 'across all campaigns' },
              { label: 'Meetings',     val: String(stats.totalMeetings), note: 'total booked' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <div>
                  <div style={{ color: 'var(--muted)' }}>{row.label}</div>
                  <div className="text-xs" style={{ color: '#4a5568' }}>{row.note}</div>
                </div>
                <span className="font-semibold text-white">{row.val}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
          Recent Activity
        </h2>
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {(logs ?? []).length === 0 ? (
            <p className="p-5 text-sm" style={{ color: 'var(--muted)' }}>No activity yet.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {(logs ?? []).map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-3" style={{ color: 'var(--muted)' }}>
                      {new Date(log.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 font-medium text-white">{log.action as string}</td>
                    <td className="px-5 py-3 truncate max-w-xs" style={{ color: 'var(--muted)' }}>
                      {(() => {
                        const d = log.details as Record<string, unknown> | null
                        if (!d) return '—'
                        if (d.company_name) return String(d.company_name)
                        if (d.subject) return String(d.subject)
                        if (d.error) return String(d.error)
                        if (d.message) return String(d.message)
                        if (d.stage) return `→ ${d.stage}`
                        if (d.reason) return String(d.reason)
                        const str = JSON.stringify(d)
                        return str.length > 70 ? str.slice(0, 70) + '…' : str
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
