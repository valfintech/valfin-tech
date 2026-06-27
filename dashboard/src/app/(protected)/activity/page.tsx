import { createAdminClient } from '@/lib/supabase/server'

interface LogRow {
  id: string
  action: string
  details: Record<string, unknown> | null
  created_at: string
  run_id: string | null
  roofing_companies: { company_name: string } | null
}

const ACTION_COLORS: Record<string, string> = {
  email_generated:        '#a78bfa',
  email_sent:             '#818cf8',
  send_skipped:           '#8892a4',
  context_assembled:      '#60a5fa',
  reply_received:         '#fb923c',
  sequence_stopped:       '#ef4444',
  follow_up_scheduled:    '#f59e0b',
  follow_up_sent:         '#818cf8',
  meeting_booked:         '#10b981',
  stage_updated:          '#60a5fa',
  email_validation_failed:'#dc2626',
  generation_failed:      '#f97316',
  error:                  '#ef4444',
}

export const dynamic = 'force-dynamic'

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>
}) {
  const { action: filterAction, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1') || 1)
  const perPage = 100
  const offset = (page - 1) * perPage

  const db = createAdminClient()

  // Two separate queries — avoids PostgREST FK join requirement
  let query = db
    .from('outreach_logs')
    .select('id, action, details, created_at, run_id, company_id', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (filterAction && filterAction !== 'all') {
    query = query.eq('action', filterAction)
  }

  const { data, count } = await query
  const rawLogs = (data as Array<{ id: string; action: string; details: Record<string, unknown> | null; created_at: string; run_id: string | null; company_id: string | null }>) ?? []

  const companyIds = [...new Set(rawLogs.map((l) => l.company_id).filter(Boolean) as string[])]
  const companyMap: Record<string, string> = {}
  if (companyIds.length > 0) {
    const { data: companies } = await db
      .from('roofing_companies')
      .select('id, company_name')
      .in('id', companyIds)
    ;(companies ?? []).forEach((c) => { companyMap[c.id] = c.company_name })
  }

  const logs: LogRow[] = rawLogs.map((l) => ({
    ...l,
    roofing_companies: l.company_id && companyMap[l.company_id]
      ? { company_name: companyMap[l.company_id] }
      : null,
  }))
  const totalPages = Math.ceil((count ?? 0) / perPage)

  const ALL_ACTIONS = [
    'all',
    'email_generated',
    'email_sent',
    'send_skipped',
    'context_assembled',
    'reply_received',
    'sequence_stopped',
    'follow_up_scheduled',
    'follow_up_sent',
    'meeting_booked',
    'stage_updated',
    'email_validation_failed',
    'generation_failed',
    'error',
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Activity Log</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {count ?? 0} events total
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_ACTIONS.map((a) => {
          const isActive = (filterAction ?? 'all') === a
          return (
            <a
              key={a}
              href={`/activity?action=${a}&page=1`}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={{
                background: isActive
                  ? (ACTION_COLORS[a] ?? 'var(--accent)') + '30'
                  : 'var(--surface)',
                color: isActive
                  ? (ACTION_COLORS[a] ?? '#a5b4fc')
                  : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              {a === 'all' ? 'All' : a.replace(/_/g, ' ')}
            </a>
          )
        })}
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border text-sm"
          style={{ color: 'var(--muted)', borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          No activity yet.
        </div>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface2)',
                }}
              >
                {['Time', 'Company', 'Action', 'Details'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td
                    className="px-4 py-3 text-xs whitespace-nowrap"
                    style={{ color: 'var(--muted)' }}
                  >
                    {new Date(log.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {new Date(log.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {log.roofing_companies?.company_name ?? (
                      <span style={{ color: 'var(--muted)' }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background:
                          (ACTION_COLORS[log.action] ?? '#8892a4') + '20',
                        color: ACTION_COLORS[log.action] ?? '#8892a4',
                      }}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs max-w-xs truncate"
                    style={{ color: 'var(--muted)' }}
                  >
                    {log.details
                      ? (() => {
                          const d = log.details
                          if (d.subject) return String(d.subject)
                          if (d.error) return String(d.error)
                          if (d.message) return String(d.message)
                          if (d.stage) return `→ ${d.stage}`
                          const str = JSON.stringify(d)
                          return str.length > 80 ? str.slice(0, 80) + '…' : str
                        })()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/activity?action=${filterAction ?? 'all'}&page=${page - 1}`}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                }}
              >
                ← Prev
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/activity?action=${filterAction ?? 'all'}&page=${page + 1}`}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                }}
              >
                Next →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
