'use client'

import { useState, useCallback } from 'react'
import { N8N } from '@/lib/n8n'

export interface ReviewEmail {
  emailId: string
  companyId: string
  companyName: string
  city: string | null
  state: string | null
  phone: string | null
  recipientEmail: string | null
  websiteUrl: string | null
  googleRating: number | null
  googleReviewCount: number | null
  yearsInBusiness: number | null
  pipelineStage: string
  contactName: string | null
  contactRole: string | null
  subject: string
  bodyText: string
  emailStatus: string
  errorReason: string | null
  personalizationContext: {
    recommendedAngle?: string
    identifiedPainPoints?: string[]
    conversationHooks?: string[]
    personalizationSummary?: string
  }
  sequencePosition: number
  generatedAt: string
  approvedAt: string | null
  sentAt: string | null
  repliedAt: string | null
}

const STATUS_COLORS: Record<string, string> = {
  generated: '#60a5fa',
  approved: '#10b981',
  rejected: '#ef4444',
  skipped: '#f59e0b',
  sent: '#a78bfa',
  replied: '#fb923c',
  sending: '#8892a4',
  invalid_email: '#dc2626',
  missing_email: '#9ca3af',
}

const FILTERS = ['generated', 'approved', 'sent', 'replied', 'rejected', 'skipped', 'invalid_email', 'missing_email', 'all'] as const
type Filter = typeof FILTERS[number]

const STATUS_LABELS: Record<string, string> = {
  generated: 'Pending',
  approved: 'Approved',
  sent: 'Sent',
  replied: 'Replied',
  rejected: 'Rejected',
  skipped: 'Skipped',
  sending: 'Sending',
  invalid_email: 'Invalid Email',
  missing_email: 'No Email',
  all: 'All',
}

export default function EmailReviewUI({ initialEmails }: { initialEmails: ReviewEmail[] }) {
  const [emails, setEmails] = useState<ReviewEmail[]>(initialEmails)
  const [filter, setFilter] = useState<Filter>('generated')
  const [search, setSearch] = useState('')
  const [idx, setIdx] = useState(0)
  const firstEmail = initialEmails.find(e => e.emailStatus === 'generated') ?? initialEmails[0] ?? null
  const [subject, setSubject] = useState(firstEmail?.subject ?? '')
  const [body, setBody] = useState(firstEmail?.bodyText ?? '')
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const showToast = useCallback((msg: string, color = 'blue') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2600)
  }, [])

  const filtered = emails.filter((e) => {
    const matchFilter = filter === 'all' || e.emailStatus === filter
    const matchSearch = !search || e.companyName.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? emails.length : emails.filter((e) => e.emailStatus === f).length
    return acc
  }, {} as Record<string, number>)

  const email = filtered[idx] ?? null

  const loadEmail = useCallback((e: ReviewEmail) => {
    setSubject(e.subject)
    setBody(e.bodyText)
    setIsDirty(false)
    setSaveMsg('')
  }, [])

  const selectEmail = (e: ReviewEmail, newIdx: number) => {
    setIdx(newIdx)
    loadEmail(e)
  }

  const handleFilterChange = (f: Filter) => {
    setFilter(f)
    setIdx(0)
    const newFiltered = emails.filter((e) => {
      const mf = f === 'all' || e.emailStatus === f
      const ms = !search || e.companyName.toLowerCase().includes(search.toLowerCase())
      return mf && ms
    })
    if (newFiltered[0]) loadEmail(newFiltered[0])
  }

  const handleSearch = (q: string) => {
    setSearch(q)
    setIdx(0)
    const newFiltered = emails.filter((e) => {
      const mf = filter === 'all' || e.emailStatus === filter
      const ms = !q || e.companyName.toLowerCase().includes(q.toLowerCase())
      return mf && ms
    })
    if (newFiltered[0]) loadEmail(newFiltered[0])
  }

  const go = (delta: number) => {
    const newIdx = Math.max(0, Math.min(filtered.length - 1, idx + delta))
    setIdx(newIdx)
    if (filtered[newIdx]) loadEmail(filtered[newIdx])
  }

  const saveDraft = async () => {
    if (!email || isSaving || isRegenerating) return
    setIsSaving(true)
    setSaveMsg('Saving…')
    try {
      const r = await fetch(N8N.reviewDecision, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email.emailId, decision: 'save_draft', subject, body }),
      })
      if (!r.ok) throw new Error(r.statusText)
      setEmails((prev) => prev.map((e) => e.emailId === email.emailId ? { ...e, subject, bodyText: body } : e))
      setIsDirty(false)
      setSaveMsg('✓ Saved')
      setTimeout(() => setSaveMsg(''), 2000)
    } catch (err) {
      showToast('Save failed: ' + (err as Error).message, 'red')
      setSaveMsg('')
    } finally {
      setIsSaving(false)
    }
  }

  const decide = async (decision: 'approved' | 'rejected' | 'skipped') => {
    if (!email) return
    if (isDirty && decision === 'approved') {
      await saveDraft()
      if (isDirty) return
    }
    const prevStatus = email.emailStatus
    const emailId = email.emailId
    setEmails((all) => all.map((e) => e.emailId === emailId ? { ...e, emailStatus: decision } : e))
    showToast(
      decision === 'approved'
        ? `✓ Approved — ${email.companyName} queued to send`
        : decision === 'rejected'
        ? `✗ Rejected — ${email.companyName}`
        : `→ Skipped — ${email.companyName}`,
      decision === 'approved' ? 'green' : decision === 'rejected' ? 'red' : 'yellow'
    )
    // Navigate immediately so editor stays in sync with list
    if (filter !== 'all' && decision !== filter) {
      const remaining = filtered.filter((e) => e.emailId !== emailId)
      if (remaining.length > 0) {
        const newIdx = Math.min(idx, remaining.length - 1)
        setIdx(newIdx)
        loadEmail(remaining[newIdx])
      }
    }
    try {
      const r = await fetch(N8N.reviewDecision, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, decision }),
      })
      if (!r.ok) throw new Error(r.statusText)
    } catch (err) {
      setEmails((all) => all.map((e) => e.emailId === emailId ? { ...e, emailStatus: prevStatus } : e))
      showToast('Error: ' + (err as Error).message, 'red')
    }
  }

  const runRegenerate = async (toastMsg: string) => {
    if (!email || isRegenerating) return
    setIsRegenerating(true)
    try {
      const r = await fetch(N8N.reviewDecision, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email.emailId, decision: 'regenerate', companyId: email.companyId }),
      })
      if (!r.ok) throw new Error(r.statusText)
      const data = await r.json()
      if (!data.success || !data.regenerated) throw new Error(data.error || 'Generation failed')
      const ne = data.newEmail
      setEmails((prev) => prev.map((e) =>
        e.emailId === email.emailId
          ? { ...e, emailId: ne.emailId, subject: ne.subject, bodyText: ne.bodyText, emailStatus: 'generated', personalizationContext: ne.personalizationContext ?? e.personalizationContext }
          : e
      ))
      setSubject(ne.subject)
      setBody(ne.bodyText)
      setIsDirty(false)
      showToast(toastMsg, 'green')
    } catch (err) {
      showToast('Generation failed: ' + (err as Error).message, 'red')
    } finally {
      setIsRegenerating(false)
    }
  }

  const regenerate = async () => {
    if (!email || isRegenerating) return
    await runRegenerate(`✓ New version ready for ${email.companyName}`)
  }

  const rejectAndRegenerate = async () => {
    if (!email || isRegenerating) return
    showToast(`✗ Rejected — generating new version for ${email.companyName}`, 'purple')
    await runRegenerate(`✓ New version ready for ${email.companyName}`)
  }

  const isValidationError = email ? (email.emailStatus === 'invalid_email' || email.emailStatus === 'missing_email') : false
  const isContentReadOnly = email ? (email.emailStatus === 'sent' || email.emailStatus === 'replied' || email.emailStatus === 'sending' || isValidationError) : true
  const isActionsLocked = email ? (email.emailStatus === 'sent' || email.emailStatus === 'replied' || email.emailStatus === 'sending') : true
  const isReadOnly = isContentReadOnly
  const wc = body.split(/\s+/).filter(Boolean).length
  const ctx = email?.personalizationContext ?? {}

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: email list */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <input
            type="text"
            placeholder="Search company…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className="text-xs px-2 py-1 rounded-md font-medium transition-colors"
                style={{
                  background: filter === f ? 'var(--accent)' : 'var(--surface2)',
                  color: filter === f ? '#fff' : 'var(--muted)',
                  border: '1px solid',
                  borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                }}
              >
                {STATUS_LABELS[f] ?? f} {counts[f]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-xs text-center" style={{ color: 'var(--muted)' }}>No emails match.</div>
          ) : filtered.map((e, i) => (
            <div
              key={e.emailId}
              onClick={() => selectEmail(e, i)}
              className="px-4 py-3 cursor-pointer border-b transition-colors"
              style={{
                borderColor: 'var(--border)',
                background: i === idx ? 'var(--surface2)' : 'transparent',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="font-medium text-sm text-white truncate">{e.companyName}</div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: (STATUS_COLORS[e.emailStatus] ?? '#8892a4') + '20', color: STATUS_COLORS[e.emailStatus] ?? '#8892a4' }}
                >
                  {STATUS_LABELS[e.emailStatus] ?? e.emailStatus}
                </span>
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{e.subject}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: email editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!email ? (
          <div className="flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--muted)' }}>
            Select an email to review
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="font-semibold text-white">{email.companyName}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {[email.city, email.state].filter(Boolean).join(', ')}
                  {email.sequencePosition > 1 ? ` · Follow-up #${email.sequencePosition - 1}` : ' · Initial email'}
                  {email.recipientEmail ? ` · ${email.recipientEmail}` : ''}
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: (STATUS_COLORS[email.emailStatus] ?? '#8892a4') + '20', color: STATUS_COLORS[email.emailStatus] ?? '#8892a4' }}
              >
                {STATUS_LABELS[email.emailStatus] ?? email.emailStatus}
              </span>
            </div>

            {/* Email content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="max-w-2xl">
                <div className="mb-4">
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Subject</div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); setIsDirty(true) }}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="mb-1 flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Body</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: wc > 160 ? '#ef4444' : wc >= 130 ? '#f59e0b' : wc >= 60 ? '#10b981' : 'var(--muted)' }}>{wc} words</span>
                    {saveMsg && <span className="text-xs" style={{ color: isSaving ? 'var(--muted)' : '#10b981' }}>{saveMsg}</span>}
                    {isDirty && !saveMsg && <span className="text-xs" style={{ color: '#f59e0b' }}>● unsaved</span>}
                  </div>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => { setBody(e.target.value); setIsDirty(true) }}
                  disabled={isReadOnly}
                  rows={12}
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.75', resize: 'vertical' }}
                />

                {/* Validation error banner */}
                {isValidationError && email.errorReason && (
                  <div className="mt-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
                    <span className="font-semibold">{email.emailStatus === 'missing_email' ? 'No email address' : 'Invalid email'}: </span>
                    {email.errorReason}
                  </div>
                )}

                {/* Company profile */}
                <div className="mt-4 border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setShowProfile((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm"
                    style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                  >
                    <span className="font-medium">Company Profile</span>
                    <span>{showProfile ? '▼' : '▶'}</span>
                  </button>
                  {showProfile && (
                    <div className="px-4 py-3 grid grid-cols-2 gap-3 text-sm" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      {[
                        { label: 'Location', val: [email.city, email.state].filter(Boolean).join(', ') || null },
                        { label: 'Phone', val: email.phone },
                        { label: 'Website', val: email.websiteUrl },
                        { label: 'Google', val: email.googleRating ? `${email.googleRating}/5 (${email.googleReviewCount ?? 0} reviews)` : null },
                        { label: 'Contact', val: [email.contactName, email.contactRole].filter(Boolean).join(', ') || null },
                        { label: 'Years in biz', val: email.yearsInBusiness ? `${email.yearsInBusiness} yrs` : null },
                        { label: 'Pipeline', val: email.pipelineStage },
                      ].map(({ label, val }) => val ? (
                        <div key={label}>
                          <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
                          <div className="text-white mt-0.5">{val}</div>
                        </div>
                      ) : null)}
                    </div>
                  )}
                </div>

                {/* Research notes */}
                <div className="mt-3 border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setShowNotes((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm"
                    style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                  >
                    <span className="font-medium">Research Notes</span>
                    <span>{showNotes ? '▼' : '▶'}</span>
                  </button>
                  {showNotes && (
                    <div className="px-4 py-3 space-y-2 text-sm" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      {[
                        { label: 'Angle', val: ctx.recommendedAngle },
                        { label: 'Pain Points', val: (ctx.identifiedPainPoints ?? []).join('; ') || null },
                        { label: 'Hooks', val: (ctx.conversationHooks ?? []).join('; ') || null },
                        { label: 'Summary', val: ctx.personalizationSummary },
                      ].map(({ label, val }) => val ? (
                        <div key={label}>
                          <span className="font-medium text-white">{label}: </span>
                          <span style={{ color: 'var(--muted)' }}>{val}</span>
                        </div>
                      ) : null)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="px-6 py-4 border-t flex items-center gap-3 flex-wrap" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <button
                onClick={saveDraft}
                disabled={!isDirty || isSaving || isReadOnly}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
                style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Save Draft
              </button>
              <button
                onClick={regenerate}
                disabled={isRegenerating || isReadOnly}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
                style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                {isRegenerating ? '⟳ Regenerating…' : '↺ Regenerate'}
              </button>

              <div className="flex-1" />

              <button
                onClick={() => decide('approved')}
                disabled={isActionsLocked || isValidationError}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: '#10b981' }}
              >
                ✓ Approve
              </button>
              <button
                onClick={rejectAndRegenerate}
                disabled={isRegenerating || isActionsLocked || isValidationError}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: '#ef4444' }}
              >
                ✗ Reject
              </button>
              <button
                onClick={() => decide('skipped')}
                disabled={isActionsLocked}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--border)', color: 'var(--text)' }}
              >
                → Skip
              </button>

              <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

              <button onClick={() => go(-1)} disabled={idx === 0} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>←</button>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{idx + 1} / {filtered.length}</span>
              <button onClick={() => go(1)} disabled={idx >= filtered.length - 1} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>→</button>
            </div>

          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 px-4 py-3 rounded-lg text-sm font-medium text-white z-50"
          style={{
            background: toast.color === 'green' ? '#10b981' : toast.color === 'red' ? '#ef4444' : toast.color === 'yellow' ? '#f59e0b' : toast.color === 'purple' ? '#a78bfa' : '#3b82f6',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Regenerating overlay */}
      {isRegenerating && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(15,17,23,0.8)' }}>
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <div className="text-white font-medium">Writing new version with Claude…</div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Takes 15–30 seconds</div>
          </div>
        </div>
      )}
    </div>
  )
}
