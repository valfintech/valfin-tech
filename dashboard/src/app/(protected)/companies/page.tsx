'use client'

import { useEffect, useState } from 'react'

interface Company {
  id: string
  company_name: string
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  website_url: string | null
  google_rating: number | null
  google_review_count: number | null
  years_in_business: number | null
  pipeline_stage: string
  notes: string | null
  last_enriched_at: string | null
}

interface CompanyEmail {
  id: string
  subject: string
  body_text: string
  status: string
  sequence_position: number
  generated_at: string
  sent_at: string | null
  personalization_context: {
    recommendedAngle?: string
    personalizationSummary?: string
    identifiedPainPoints?: string[]
    conversationHooks?: string[]
  } | null
}

interface LogEntry {
  id: string
  action: string
  details: Record<string, unknown> | null
  created_at: string
}

type Tab = 'profile' | 'research' | 'emails' | 'history'

const STAGES = [
  'all', 'discovered', 'researched', 'ready_for_outreach', 'email_generated',
  'email_sent', 'replied', 'meeting_booked', 'client', 'do_not_contact',
]

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

const EMAIL_STATUS_COLORS: Record<string, string> = {
  generated:     '#60a5fa',
  approved:      '#10b981',
  sent:          '#a78bfa',
  replied:       '#fb923c',
  rejected:      '#ef4444',
  skipped:       '#8892a4',
  sending:       '#8892a4',
  invalid_email: '#dc2626',
  missing_email: '#9ca3af',
}

const ACTION_COLORS: Record<string, string> = {
  email_generated:         '#a78bfa',
  email_sent:              '#818cf8',
  send_skipped:            '#8892a4',
  context_assembled:       '#60a5fa',
  reply_received:          '#fb923c',
  sequence_stopped:        '#ef4444',
  follow_up_scheduled:     '#f59e0b',
  follow_up_sent:          '#818cf8',
  meeting_booked:          '#10b981',
  stage_updated:           '#60a5fa',
  email_validation_failed: '#dc2626',
  generation_failed:       '#f97316',
  error:                   '#ef4444',
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('all')
  const [selected, setSelected] = useState<Company | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [companyEmails, setCompanyEmails] = useState<CompanyEmail[]>([])
  const [companyHistory, setCompanyHistory] = useState<LogEntry[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data: Company[]) => {
        setCompanies(data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) return
    setDetailLoading(true)
    setCompanyEmails([])
    setCompanyHistory([])
    fetch(`/api/companies/${selected.id}/details`)
      .then((r) => r.json())
      .then(({ emails, logs }: { emails: CompanyEmail[]; logs: LogEntry[] }) => {
        setCompanyEmails(emails ?? [])
        setCompanyHistory(logs ?? [])
        setDetailLoading(false)
      })
      .catch(() => setDetailLoading(false))
  }, [selected])

  const filtered = companies.filter((c) => {
    const matchSearch =
      !search ||
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStage = stage === 'all' || c.pipeline_stage === stage
    return matchSearch && matchStage
  })

  const selectCompany = (c: Company) => {
    setSelected(c)
    setActiveTab('profile')
    setExpandedEmail(null)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* List pane */}
      <div
        className="flex-1 flex flex-col overflow-hidden border-r"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-lg font-bold text-white mb-4">Companies</h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-48"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All stages' : s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
            {filtered.length} companies
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
              No companies match.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--surface)',
                  }}
                >
                  {['Company', 'Location', 'Rating', 'Stage'].map((h) => (
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
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => selectCompany(c)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background:
                        selected?.id === c.id ? 'var(--surface2)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {c.company_name}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>
                      {[c.city, c.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>
                      {c.google_rating
                        ? `⭐ ${c.google_rating} (${c.google_review_count ?? 0})`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background:
                            (STAGE_COLORS[c.pipeline_stage] ?? '#8892a4') + '20',
                          color: STAGE_COLORS[c.pipeline_stage] ?? '#8892a4',
                        }}
                      >
                        {c.pipeline_stage.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail pane */}
      <div
        className="w-96 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ borderLeft: selected ? undefined : 'none' }}
      >
        {selected ? (
          <>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-base font-bold text-white mb-1">
                {selected.company_name}
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background:
                    (STAGE_COLORS[selected.pipeline_stage] ?? '#8892a4') + '20',
                  color: STAGE_COLORS[selected.pipeline_stage] ?? '#8892a4',
                }}
              >
                {selected.pipeline_stage.replace(/_/g, ' ')}
              </span>

              {/* Tabs */}
              <div className="flex gap-0 mt-4">
                {(['profile', 'research', 'emails', 'history'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                    style={{
                      borderBottom:
                        activeTab === t
                          ? '2px solid var(--accent)'
                          : '2px solid transparent',
                      color: activeTab === t ? '#a5b4fc' : 'var(--muted)',
                      background: 'transparent',
                    }}
                  >
                    {t}
                    {t === 'emails' && companyEmails.length > 0
                      ? ` (${companyEmails.length})`
                      : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-5">
              {detailLoading ? (
                <div className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
                  Loading…
                </div>
              ) : (
                <>
                  {activeTab === 'profile' && (
                    <ProfileTab company={selected} />
                  )}
                  {activeTab === 'research' && (
                    <ResearchTab company={selected} emails={companyEmails} />
                  )}
                  {activeTab === 'emails' && (
                    <EmailsTab
                      emails={companyEmails}
                      expanded={expandedEmail}
                      onToggle={(id) =>
                        setExpandedEmail((prev) => (prev === id ? null : id))
                      }
                    />
                  )}
                  {activeTab === 'history' && (
                    <HistoryTab logs={companyHistory} currentStage={selected.pipeline_stage} />
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="text-sm text-center mt-20 px-6" style={{ color: 'var(--muted)' }}>
            Select a company to see details
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileTab({ company }: { company: Company }) {
  return (
    <div className="space-y-4">
      {[
        {
          label: 'Location',
          val: [company.city, company.state].filter(Boolean).join(', ') || null,
        },
        { label: 'Phone', val: company.phone },
        { label: 'Email', val: company.email },
        {
          label: 'Google',
          val: company.google_rating
            ? `${company.google_rating}/5 · ${company.google_review_count ?? 0} reviews`
            : null,
        },
        {
          label: 'Years in business',
          val: company.years_in_business ? `${company.years_in_business} years` : null,
        },
        {
          label: 'Last enriched',
          val: company.last_enriched_at
            ? new Date(company.last_enriched_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null,
        },
      ]
        .filter((r) => r.val)
        .map(({ label, val }) => (
          <div key={label}>
            <div
              className="text-xs font-medium mb-0.5"
              style={{ color: 'var(--muted)' }}
            >
              {label}
            </div>
            <div className="text-sm text-white">{val}</div>
          </div>
        ))}

      {company.website_url && (
        <div>
          <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
            Website
          </div>
          <a
            href={company.website_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm"
            style={{ color: 'var(--accent)' }}
          >
            {company.website_url}
          </a>
        </div>
      )}

      {company.notes && (
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
            Notes
          </div>
          <div
            className="text-xs leading-relaxed p-3 rounded-lg"
            style={{
              color: 'var(--muted)',
              background: 'var(--surface2)',
            }}
          >
            {company.notes}
          </div>
        </div>
      )}
    </div>
  )
}

function ResearchTab({
  company,
  emails,
}: {
  company: Company
  emails: CompanyEmail[]
}) {
  const latest = emails[0]
  const ctx = latest?.personalization_context

  if (!ctx && !company.notes) {
    return (
      <div className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
        No research data yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ctx?.recommendedAngle && (
        <FieldBlock label="Recommended Angle">
          <p className="text-sm text-white">{ctx.recommendedAngle}</p>
        </FieldBlock>
      )}

      {ctx?.personalizationSummary && (
        <FieldBlock label="AI Summary">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {ctx.personalizationSummary}
          </p>
        </FieldBlock>
      )}

      {company.notes && (
        <FieldBlock label="Research Notes">
          <p
            className="text-xs leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--muted)' }}
          >
            {company.notes}
          </p>
        </FieldBlock>
      )}

      {ctx?.conversationHooks && ctx.conversationHooks.length > 0 && (
        <FieldBlock label="Conversation Hooks">
          <ul className="space-y-2">
            {ctx.conversationHooks.map((h, i) => (
              <li
                key={i}
                className="text-xs flex gap-2"
                style={{ color: 'var(--muted)' }}
              >
                <span style={{ color: '#60a5fa', flexShrink: 0 }}>·</span>
                {h}
              </li>
            ))}
          </ul>
        </FieldBlock>
      )}

      {ctx?.identifiedPainPoints && ctx.identifiedPainPoints.length > 0 && (
        <FieldBlock label="AI Pain Points">
          <ul className="space-y-2">
            {ctx.identifiedPainPoints.map((p, i) => (
              <li
                key={i}
                className="text-xs flex gap-2"
                style={{ color: 'var(--muted)' }}
              >
                <span style={{ color: '#f59e0b', flexShrink: 0 }}>·</span>
                {p}
              </li>
            ))}
          </ul>
        </FieldBlock>
      )}
    </div>
  )
}

function EmailsTab({
  emails,
  expanded,
  onToggle,
}: {
  emails: CompanyEmail[]
  expanded: string | null
  onToggle: (id: string) => void
}) {
  if (emails.length === 0) {
    return (
      <div className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
        No emails generated yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {emails.map((e) => (
        <div
          key={e.id}
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
            style={{ background: 'var(--surface2)' }}
            onClick={() => onToggle(e.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">
                {e.subject}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Seq {e.sequence_position} ·{' '}
                {new Date(e.generated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
                {e.sent_at
                  ? ` · sent ${new Date(e.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : ''}
              </div>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{
                background: (EMAIL_STATUS_COLORS[e.status] ?? '#8892a4') + '20',
                color: EMAIL_STATUS_COLORS[e.status] ?? '#8892a4',
              }}
            >
              {e.status}
            </span>
          </div>
          {expanded === e.id && (
            <div className="px-4 py-4" style={{ background: 'var(--surface)' }}>
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap font-sans"
                style={{ color: '#cbd5e0' }}
              >
                {e.body_text}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function HistoryTab({ logs, currentStage }: { logs: LogEntry[]; currentStage: string }) {
  const MILESTONES: Array<{ stage: string; label: string; action: string | null }> = [
    { stage: 'discovered',      label: 'Found',  action: null },
    { stage: 'researched',      label: 'Rich',   action: 'context_assembled' },
    { stage: 'email_generated', label: 'Email',  action: 'email_generated' },
    { stage: 'email_sent',      label: 'Sent',   action: 'email_sent' },
    { stage: 'replied',         label: 'Reply',  action: 'reply_received' },
    { stage: 'meeting_booked',  label: 'Mtg',    action: 'meeting_booked' },
    { stage: 'client',          label: 'Client', action: null },
  ]

  const STAGE_ORDER = [
    'discovered', 'researched', 'ready_for_outreach',
    'email_generated', 'email_sent', 'replied', 'meeting_booked', 'client',
  ]
  const currentIdx = Math.max(0, STAGE_ORDER.indexOf(currentStage))

  // First occurrence of each action (logs are DESC; iterate oldest→newest)
  const dateMap: Record<string, string> = {}
  for (let i = logs.length - 1; i >= 0; i--) {
    if (!(logs[i].action in dateMap)) dateMap[logs[i].action] = logs[i].created_at
  }

  return (
    <div>
      {/* Pipeline timeline */}
      <div className="mb-5 pt-1">
        <div className="flex items-start">
          {MILESTONES.map((m, i) => {
            const mIdx = STAGE_ORDER.indexOf(m.stage)
            const reached = mIdx <= currentIdx
            const isCurrent =
              m.stage === currentStage ||
              (currentStage === 'ready_for_outreach' && m.stage === 'researched')
            const date = m.action ? dateMap[m.action] : undefined
            const nextReached =
              i < MILESTONES.length - 1 &&
              STAGE_ORDER.indexOf(MILESTONES[i + 1].stage) <= currentIdx

            return (
              <div key={m.stage} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div
                        className="flex-1 h-px"
                        style={{ background: reached ? '#4b5563' : 'var(--border)' }}
                      />
                    )}
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: reached ? (isCurrent ? 'var(--accent)' : '#374151') : 'var(--surface2)',
                        border: isCurrent
                          ? '2px solid #818cf8'
                          : `1px solid ${reached ? '#4b5563' : 'var(--border)'}`,
                        fontSize: '9px',
                        color: reached ? 'white' : 'var(--muted)',
                      }}
                    >
                      {reached ? '✓' : ''}
                    </div>
                    {i < MILESTONES.length - 1 && (
                      <div
                        className="flex-1 h-px"
                        style={{ background: nextReached ? '#4b5563' : 'var(--border)' }}
                      />
                    )}
                  </div>
                  <div className="mt-1.5 w-full text-center">
                    <div
                      style={{
                        fontSize: '10px',
                        color: reached ? (isCurrent ? '#a5b4fc' : '#9ca3af') : 'var(--muted)',
                      }}
                    >
                      {m.label}
                    </div>
                    {date && (
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t mb-4" style={{ borderColor: 'var(--border)' }} />

      {logs.length === 0 ? (
        <div className="text-sm text-center py-6" style={{ color: 'var(--muted)' }}>
          No activity logged yet.
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-xs">
              <div
                className="mt-0.5 flex-shrink-0"
                style={{ color: 'var(--muted)', width: '72px' }}
              >
                {new Date(log.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
                <br />
                {new Date(log.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block px-2 py-0.5 rounded-full font-medium mb-1"
                  style={{
                    background: (ACTION_COLORS[log.action] ?? '#8892a4') + '20',
                    color: ACTION_COLORS[log.action] ?? '#8892a4',
                  }}
                >
                  {log.action.replace(/_/g, ' ')}
                </span>
                {log.details && (
                  <div style={{ color: 'var(--muted)' }} className="truncate">
                    {(() => {
                      const d = log.details
                      if (d.subject) return String(d.subject)
                      if (d.error) return String(d.error)
                      if (d.message) return String(d.message)
                      if (d.stage) return `→ ${d.stage}`
                      return ''
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FieldBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        className="text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </div>
      <div
        className="rounded-lg p-3"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
      >
        {children}
      </div>
    </div>
  )
}
