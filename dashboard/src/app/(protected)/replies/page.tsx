import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface Reply {
  id: string
  company_id: string
  category: string
  body_text: string | null
  created_at: string
  roofing_companies: { company_name: string } | null
}

const CAT_COLORS: Record<string, string> = {
  interested: '#10b981',
  question: '#60a5fa',
  not_interested: '#ef4444',
  bounce: '#8892a4',
  ooo: '#f59e0b',
  referral: '#a78bfa',
  unsubscribe: '#ef4444',
  other: '#8892a4',
  uncategorized: '#8892a4',
}

export default async function RepliesPage() {
  const db = createAdminClient()

  // Two separate queries — avoids PostgREST FK join requirement
  const { data: replyData } = await db
    .from('email_replies')
    .select('id, company_id, category, body_text, created_at')
    .order('created_at', { ascending: false })

  const rows = replyData ?? []
  const companyIds = [...new Set(rows.map((r) => r.company_id as string))]

  const companyMap: Record<string, string> = {}
  if (companyIds.length > 0) {
    const { data: companies } = await db
      .from('roofing_companies')
      .select('id, company_name')
      .in('id', companyIds)
    ;(companies ?? []).forEach((c) => { companyMap[c.id] = c.company_name })
  }

  const replies: Reply[] = rows.map((r) => ({
    ...(r as unknown as Reply),
    roofing_companies: companyMap[r.company_id as string]
      ? { company_name: companyMap[r.company_id as string] }
      : null,
  }))

  const counts: Record<string, number> = {}
  replies.forEach((r) => { counts[r.category] = (counts[r.category] ?? 0) + 1 })

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Replies</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{replies.length} total replies received</p>
      </div>

      {/* Category summary */}
      {replies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(counts).map(([cat, n]) => (
            <span
              key={cat}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: (CAT_COLORS[cat] ?? '#8892a4') + '20', color: CAT_COLORS[cat] ?? '#8892a4' }}
            >
              {cat} · {n}
            </span>
          ))}
        </div>
      )}

      {replies.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
          <p>No replies yet.</p>
          <p className="text-xs mt-1">Replies will appear here once prospects start responding.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {replies.map((r) => (
            <div key={r.id} className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-semibold text-white">{r.roofing_companies?.company_name ?? '—'}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
                  style={{ background: (CAT_COLORS[r.category] ?? '#8892a4') + '20', color: CAT_COLORS[r.category] ?? '#8892a4' }}
                >
                  {r.category}
                </span>
              </div>
              {r.body_text && (
                <div
                  className="text-sm leading-relaxed rounded-lg p-4"
                  style={{ background: 'rgba(0,0,0,0.2)', color: '#cbd5e0', whiteSpace: 'pre-wrap' }}
                >
                  {r.body_text.slice(0, 600)}{r.body_text.length > 600 ? '…' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
