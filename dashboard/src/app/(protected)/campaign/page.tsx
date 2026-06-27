'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { N8N } from '@/lib/n8n'

type CampaignTab = 'discover' | 'generate' | 'review'

interface EmailRow {
  status: string
}

const BUSINESS_SUGGESTIONS = [
  'Roofing Contractor',
  'HVAC Company',
  'Plumbing Company',
  'Electrician',
  'Painting Contractor',
  'Landscaping Company',
  'General Contractor',
  'Dentist',
  'Law Firm',
  'Accounting Firm',
  'Med Spa',
  'Real Estate Agency',
  'Insurance Agency',
  'Solar Company',
  'Marketing Agency',
  'Pest Control',
  'Tree Service',
  'Garage Door Repair',
  'Locksmith',
  'Auto Repair',
  'Restaurant',
  'Fitness Gym',
]

const inputStyle = {
  background: 'var(--surface2, #1e2130)',
  border: '1px solid var(--border)',
  color: 'white',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
} as React.CSSProperties

export default function CampaignPage() {
  const [tab, setTab] = useState<CampaignTab>('discover')
  const [stats, setStats] = useState({ researched: 0, pendingReview: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsRefreshing, setStatsRefreshing] = useState(false)

  const [niche, setNiche] = useState('')
  const [town, setTown] = useState('')
  const [discovering, setDiscovering] = useState(false)
  const [discoverToast, setDiscoverToast] = useState('')
  const [nicheOpen, setNicheOpen] = useState(false)
  const nicheRef = useRef<HTMLDivElement>(null)

  const [generating, setGenerating] = useState(false)
  const [generateToast, setGenerateToast] = useState('')

  const [bulkRegenerating, setBulkRegenerating] = useState(false)
  const [bulkRegenerateToast, setBulkRegenerateToast] = useState<{ msg: string; color: string } | null>(null)
  const [bulkConfirmPending, setBulkConfirmPending] = useState(false)

  const loadStats = (initial = false) => {
    if (!initial) setStatsRefreshing(true)
    return fetch('/api/campaign-stats')
      .then((r) => r.json())
      .then(({ researched, emails }: { researched: number; emails: EmailRow[] }) => {
        setStats({
          researched,
          pendingReview: emails.filter((e) => e.status === 'generated').length,
        })
      })
      .catch(() => {})
      .finally(() => {
        setStatsLoading(false)
        setStatsRefreshing(false)
      })
  }

  useEffect(() => { loadStats(true) }, [])

  // Close niche dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (nicheRef.current && !nicheRef.current.contains(e.target as Node)) {
        setNicheOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredSuggestions = niche.trim()
    ? BUSINESS_SUGGESTIONS.filter(s => s.toLowerCase().includes(niche.toLowerCase()))
    : BUSINESS_SUGGESTIONS

  const discover = async () => {
    if (!niche.trim() || !town.trim()) return
    const trimmedTown = town.trim()
    // Reject bare state abbreviations like "MA" — require city+state
    if (/^[A-Z]{1,2}$/.test(trimmedTown) || trimmedTown.length < 4) {
      setDiscoverToast('Enter a city and state — e.g. "Boston, MA" or "Worcester, MA"')
      setTimeout(() => setDiscoverToast(''), 6000)
      return
    }
    setDiscovering(true)
    try {
      const r = await fetch(N8N.launchDiscovery, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ town: trimmedTown, niche: niche.trim() }),
      })
      if (!r.ok) throw new Error(r.statusText)
      setDiscoverToast(`Discovery started for "${niche}" in "${town}". Companies will appear in the Companies page within 5–15 minutes.`)
      setTown('')
      setNiche('')
      setTimeout(() => setDiscoverToast(''), 12000)
    } catch (err) {
      setDiscoverToast('Error: ' + (err as Error).message)
    } finally {
      setDiscovering(false)
    }
  }

  const bulkRegenerate = async () => {
    setBulkRegenerating(true)
    setBulkConfirmPending(false)
    try {
      const r = await fetch(N8N.bulkRegenerate, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      if (!r.ok) throw new Error(r.statusText)
      setBulkRegenerateToast({ msg: stats.pendingReview > 0 ? `Regeneration started for ${stats.pendingReview} emails. New drafts will appear in Email Review over the next ~${Math.ceil(stats.pendingReview * 0.35)} minutes.` : 'Bulk regeneration started. New email drafts will appear in Email Review over the next few minutes.', color: 'rgba(99,102,241,0.15)' })
      setTimeout(() => setBulkRegenerateToast(null), 20000)
    } catch (err) {
      setBulkRegenerateToast({ msg: 'Error starting bulk regeneration: ' + (err as Error).message, color: 'rgba(239,68,68,0.15)' })
    } finally {
      setBulkRegenerating(false)
    }
  }

  const generateEmails = async () => {
    if (stats.researched === 0) return
    setGenerating(true)
    try {
      const r = await fetch(N8N.generateEmails, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!r.ok) throw new Error(r.statusText)
      setGenerateToast(`Email generation started for ${stats.researched} companies. Check Email Review in ~${Math.max(1, Math.ceil(stats.researched * 0.5))} minutes.`)
      setTimeout(() => setGenerateToast(''), 15000)
      // Refresh stats after a delay so counts update
      setTimeout(() => loadStats(), 8000)
    } catch (err) {
      setGenerateToast('Error: ' + (err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  const TABS: { id: CampaignTab; label: string; badge?: number }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'generate', label: 'Generate', badge: stats.researched > 0 ? stats.researched : undefined },
    { id: 'review', label: 'Review Queue', badge: stats.pendingReview > 0 ? stats.pendingReview : undefined },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Campaign</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          Full outreach pipeline control
        </p>
      </div>

      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.id ? '#a5b4fc' : 'var(--muted)',
              background: 'transparent',
              marginBottom: '-1px',
            }}
          >
            {t.label}
            {t.badge !== undefined && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-semibold text-white mb-1">Discover New Companies</h2>
            <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
              Searches Google Places for local businesses, then auto-enriches each with website, contact, and research data.
            </p>

            <div className="space-y-4">
              {/* Business Type combobox */}
              <div ref={nicheRef} className="relative">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                  Business Type
                </label>
                <input
                  type="text"
                  placeholder="Search or type any business (e.g. Dentist, Solar Company…)"
                  value={niche}
                  onChange={e => { setNiche(e.target.value); setNicheOpen(true) }}
                  onFocus={() => setNicheOpen(true)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') setNicheOpen(false)
                    if (e.key === 'Enter' && !nicheOpen) discover()
                  }}
                  style={inputStyle}
                  autoComplete="off"
                />
                {nicheOpen && filteredSuggestions.length > 0 && (
                  <div
                    className="absolute z-20 w-full mt-1 rounded-lg overflow-auto"
                    style={{
                      background: 'var(--surface2, #1e2130)',
                      border: '1px solid var(--border)',
                      maxHeight: '220px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {filteredSuggestions.map(s => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={e => {
                          e.preventDefault()
                          setNiche(s)
                          setNicheOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm transition-colors"
                        style={{ color: 'white', background: 'transparent' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State (e.g. Worcester, MA)"
                  value={town}
                  onChange={e => setTown(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && discover()}
                  style={inputStyle}
                  autoComplete="off"
                />
              </div>

              {/* Discover button */}
              <button
                onClick={discover}
                disabled={discovering || !niche.trim() || !town.trim()}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ background: 'var(--accent)' }}
              >
                {discovering ? 'Starting…' : 'Discover Companies'}
              </button>
            </div>

            {discoverToast && (
              <div className="mt-4 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>
                {discoverToast}
              </div>
            )}
          </div>

          <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>What happens</h3>
            <ol className="space-y-2 mb-4">
              {[
                'Google Places searched for the business type in your city or town',
                'Each result is enriched: website scraped, decision-maker extracted via Claude',
                'A personalized email is generated automatically — no manual step needed',
                'Emails appear in Email Review within 5–15 minutes, ready to approve and send',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-xs font-bold mt-0.5 w-4 flex-shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}</span>
                  <span style={{ color: 'var(--muted)' }}>{step}</span>
                </li>
              ))}
            </ol>
            <div className="text-xs rounded-lg px-3 py-2.5" style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              <span className="font-medium" style={{ color: '#8892a4' }}>Expected results: </span>
              Google Places returns up to 20 businesses per search. Each is checked for duplicates before being added to your pipeline. Run multiple searches with different locations or business types to build a larger list.
            </div>
          </div>
        </div>
      )}

      {tab === 'generate' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-2xl font-bold text-white">{statsLoading ? '…' : stats.researched}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>companies ready for email generation</div>
                </div>
                <button
                  onClick={() => loadStats()}
                  disabled={statsRefreshing}
                  title="Refresh counts"
                  className="text-sm transition-opacity disabled:opacity-40"
                  style={{ color: 'var(--muted)', background: 'transparent', padding: '4px' }}
                >
                  {statsRefreshing ? '⟳' : '↺'}
                </button>
              </div>
              <button
                onClick={generateEmails}
                disabled={generating || stats.researched === 0}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: 'var(--accent)' }}
              >
                {generating ? 'Starting…' : 'Generate Emails'}
              </button>
            </div>
            {generateToast && (
              <div className="mb-4 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>
                {generateToast}
              </div>
            )}
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Each email takes ~30s. WF-06 writes a personalized email using enrichment data + the outreach prompt. Emails auto-generate after discovery — use this button only for companies that were discovered before auto-generation was enabled.
            </div>
          </div>
          {stats.researched === 0 && !statsLoading && (
            <div className="text-sm text-center py-6 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}>
              No researched companies. Run discovery first.
            </div>
          )}

          <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white mb-0.5">Bulk Regenerate</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {stats.pendingReview > 0
                      ? `Replace all ${stats.pendingReview} pending email drafts with fresh versions using the updated prompt.`
                      : 'Generate fresh email drafts for all companies using the latest prompt.'}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {bulkConfirmPending ? (
                    <>
                      <button
                        onClick={() => setBulkConfirmPending(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: 'var(--surface2, #1e2130)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={bulkRegenerate}
                        disabled={bulkRegenerating}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                        style={{ background: '#ef4444' }}
                      >
                        {bulkRegenerating ? 'Starting…' : stats.pendingReview > 0 ? `Replace all ${stats.pendingReview}` : 'Regenerate All'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setBulkConfirmPending(true)}
                      disabled={bulkRegenerating}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                      style={{ background: 'var(--surface2, #1e2130)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                    >
                      Regenerate All
                    </button>
                  )}
                </div>
              </div>
              {bulkConfirmPending && (
                <div className="mt-3 text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>
                  {stats.pendingReview > 0
                    ? `This replaces all ${stats.pendingReview} drafts permanently. Old versions are marked skipped.`
                    : 'This will generate new email drafts for all companies. Existing skipped/rejected emails are not affected.'}
                </div>
              )}
              {bulkRegenerateToast && (
                <div className="mt-3 text-xs rounded-lg px-3 py-2" style={{ background: bulkRegenerateToast.color, color: '#a78bfa' }}>
                  {bulkRegenerateToast.msg}
                </div>
              )}
            </div>
        </div>
      )}

      {tab === 'review' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{statsLoading ? '…' : stats.pendingReview}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>emails pending review</div>
              </div>
              <Link
                href="/emails"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
                style={{ background: 'var(--accent)' }}
              >
                Open Email Review →
              </Link>
            </div>
          </div>
          <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>In Email Review you can</h3>
            <ul className="space-y-2">
              {[
                'Read each email in full before approving',
                'Approve → email queues to send automatically',
                'Edit → save a revised version, then approve separately',
                'Regenerate → writes a fresh email with a different angle',
                'Reject → discards draft and writes a fresh replacement automatically',
                'Skip → removes from review queue (still visible in Skipped filter)',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span style={{ color: '#60a5fa', flexShrink: 0 }}>·</span>
                  <span style={{ color: 'var(--muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  )
}
