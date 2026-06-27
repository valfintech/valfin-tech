'use client'

import { useEffect, useState } from 'react'

interface EmailContext {
  personalizationSummary?: string
  recommendedAngle?: string
  identifiedPainPoints?: string[]
  conversationHooks?: string[]
}

interface CompanyEmail {
  subject: string | null
  personalization_context: EmailContext | null
  generated_at: string
  status: string
}

interface Company {
  id: string
  company_name: string
  city: string | null
  state: string | null
  pipeline_stage: string
  google_rating: number | null
  google_review_count: number | null
  notes: string | null
  last_enriched_at: string | null
  outreach_emails: CompanyEmail[]
}

const STAGE_COLORS: Record<string, string> = {
  discovered: '#8892a4',
  researched: '#60a5fa',
  ready_for_outreach: '#60a5fa',
  email_generated: '#a78bfa',
  email_sent: '#818cf8',
  replied: '#fb923c',
  meeting_booked: '#f59e0b',
  client: '#10b981',
  do_not_contact: '#ef4444',
}

function getLatestEmail(c: Company): CompanyEmail | null {
  if (!c.outreach_emails?.length) return null
  return [...c.outreach_emails].sort(
    (a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
  )[0]
}

export default function ResearchPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Company | null>(null)

  useEffect(() => {
    fetch('/api/research')
      .then((r) => r.json())
      .then((data: Company[]) => {
        setCompanies(data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = companies.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.company_name.toLowerCase().includes(q) ||
      (c.city ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex h-screen overflow-hidden">
      {/* List */}
      <div
        className="flex-1 flex flex-col overflow-hidden border-r"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-lg font-bold text-white mb-4">Research</h1>
          <input
            type="text"
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
            {filtered.length} enriched companies
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
              No results.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.map((c) => {
                const email = getLatestEmail(c)
                const ctx = email?.personalization_context
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="px-5 py-4 cursor-pointer transition-colors"
                    style={{
                      background:
                        selected?.id === c.id ? 'var(--surface2)' : 'transparent',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="font-medium text-white text-sm">
                        {c.company_name}
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background:
                            (STAGE_COLORS[c.pipeline_stage] ?? '#8892a4') + '20',
                          color: STAGE_COLORS[c.pipeline_stage] ?? '#8892a4',
                        }}
                      >
                        {c.pipeline_stage.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
                      {[c.city, c.state].filter(Boolean).join(', ')}
                      {c.google_rating
                        ? ` · ⭐ ${c.google_rating} (${c.google_review_count ?? 0})`
                        : ''}
                    </div>
                    {ctx?.recommendedAngle ? (
                      <div className="text-xs" style={{ color: '#a78bfa' }}>
                        {ctx.recommendedAngle}
                      </div>
                    ) : c.notes ? (
                      <div
                        className="text-xs"
                        style={{
                          color: 'var(--muted)',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {c.notes.slice(0, 140)}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="w-96 flex-shrink-0 overflow-y-auto p-6">
        {selected ? (
          <ResearchDetail company={selected} email={getLatestEmail(selected)} />
        ) : (
          <div className="text-sm text-center mt-20" style={{ color: 'var(--muted)' }}>
            Select a company to view their research brief
          </div>
        )}
      </div>
    </div>
  )
}

function ResearchDetail({
  company,
  email,
}: {
  company: Company
  email: CompanyEmail | null
}) {
  const ctx = email?.personalization_context

  return (
    <>
      <div className="mb-5">
        <h2 className="text-base font-bold text-white">{company.company_name}</h2>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {[company.city, company.state].filter(Boolean).join(', ')}
          {company.google_rating
            ? ` · ⭐ ${company.google_rating} (${company.google_review_count ?? 0} reviews)`
            : ''}
        </div>
        {company.last_enriched_at && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Enriched{' '}
            {new Date(company.last_enriched_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}
      </div>

      {ctx?.recommendedAngle && (
        <InfoSection title="Recommended Angle">
          <p className="text-sm text-white">{ctx.recommendedAngle}</p>
        </InfoSection>
      )}

      {ctx?.personalizationSummary && (
        <InfoSection title="AI Summary">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {ctx.personalizationSummary}
          </p>
        </InfoSection>
      )}

      {company.notes && (
        <InfoSection title="Research Notes">
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--muted)' }}
          >
            {company.notes}
          </p>
        </InfoSection>
      )}

      {ctx?.conversationHooks && ctx.conversationHooks.length > 0 && (
        <InfoSection title="Conversation Hooks">
          <ul className="space-y-2">
            {ctx.conversationHooks.map((h, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--muted)' }}>
                <span style={{ color: '#60a5fa', flexShrink: 0 }}>·</span>
                {h}
              </li>
            ))}
          </ul>
        </InfoSection>
      )}

      {ctx?.identifiedPainPoints && ctx.identifiedPainPoints.length > 0 && (
        <InfoSection title="AI Pain Points">
          <ul className="space-y-2">
            {ctx.identifiedPainPoints.map((p, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--muted)' }}>
                <span style={{ color: '#f59e0b', flexShrink: 0 }}>·</span>
                {p}
              </li>
            ))}
          </ul>
        </InfoSection>
      )}

      {email && (
        <InfoSection title="Generated Email">
          <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
            Subject:{' '}
            <span className="text-white">{email.subject ?? '—'}</span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa' }}
          >
            {email.status}
          </span>
        </InfoSection>
      )}
    </>
  )
}

function InfoSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <div
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--muted)' }}
      >
        {title}
      </div>
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {children}
      </div>
    </div>
  )
}
