import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface Meeting {
  id: string
  company_id: string
  meeting_type: string | null
  scheduled_at: string | null
  duration_minutes: number | null
  notes: string | null
  status: string | null
  created_at: string
  roofing_companies: { company_name: string } | null
}

export default async function MeetingsPage() {
  const db = createAdminClient()

  // Two separate queries — avoids PostgREST FK join requirement
  const { data: meetingData } = await db
    .from('meetings')
    .select('id, company_id, meeting_type, scheduled_at, duration_minutes, notes, status, created_at')
    .order('scheduled_at', { ascending: false })

  const rows = meetingData ?? []
  const companyIds = [...new Set(rows.map((m) => m.company_id as string))]

  const companyMap: Record<string, string> = {}
  if (companyIds.length > 0) {
    const { data: companies } = await db
      .from('roofing_companies')
      .select('id, company_name')
      .in('id', companyIds)
    ;(companies ?? []).forEach((c) => { companyMap[c.id] = c.company_name })
  }

  const meetings: Meeting[] = rows.map((m) => ({
    ...(m as unknown as Meeting),
    roofing_companies: companyMap[m.company_id as string]
      ? { company_name: companyMap[m.company_id as string] }
      : null,
  }))

  const upcoming = meetings.filter((m) => m.scheduled_at && new Date(m.scheduled_at) >= new Date())
  const past = meetings.filter((m) => !m.scheduled_at || new Date(m.scheduled_at) < new Date())

  function MeetingCard({ m }: { m: Meeting }) {
    const date = m.scheduled_at
      ? new Date(m.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'No date set'

    return (
      <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-white">{m.roofing_companies?.company_name ?? '—'}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{date}</div>
            {m.duration_minutes && (
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{m.duration_minutes} min</div>
            )}
          </div>
          {m.status && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{
                background: m.status === 'completed' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
                color: m.status === 'completed' ? '#10b981' : '#a78bfa',
              }}
            >
              {m.status}
            </span>
          )}
        </div>
        {m.notes && (
          <div className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>{m.notes}</div>
        )}
      </div>
    )
  }

  if (meetings.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-white mb-2">Meetings</h1>
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
          <p>No meetings booked yet.</p>
          <p className="text-xs mt-1">Meetings booked via Google Calendar will appear here automatically.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Meetings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{meetings.length} total — {upcoming.length} upcoming</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((m) => <MeetingCard key={m.id} m={m} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Past</h2>
          <div className="space-y-3">
            {past.map((m) => <MeetingCard key={m.id} m={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
