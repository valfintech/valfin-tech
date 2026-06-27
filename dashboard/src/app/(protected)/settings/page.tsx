import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface ConfigRow { key: string; value: string; description: string | null }

const EDITABLE_KEYS: { key: string; label: string; type: string; hint: string }[] = [
  { key: 'company_name',              label: 'Company Name',               type: 'text',     hint: 'Your company name (e.g. Valfin Tech)' },
  { key: 'founder_name',              label: 'Founder Name',               type: 'text',     hint: 'Your name as it appears in email signatures' },
  { key: 'from_email',                label: 'Sending Email',              type: 'email',    hint: 'Gmail address used to send outreach (contact@valfintech.com)' },
  { key: 'website',                   label: 'Website',                    type: 'text',     hint: 'Your website domain without https:// (e.g. valfintech.com)' },
  { key: 'calendly_url',              label: 'Booking Link',               type: 'url',      hint: 'Calendar booking link included in every outreach email' },
  { key: 'email_signature',           label: 'Email Signature',            type: 'textarea', hint: 'Closing block appended to all emails — name, title, contact' },
  { key: 'owner_notification_email',  label: 'Notification Email',         type: 'email',    hint: 'Where new-lead and reply alerts are sent (can be the same as Sending Email)' },
  { key: 'daily_send_limit',          label: 'Daily Send Limit',           type: 'number',   hint: 'Max emails to send per day (WF-07 hard cap). Set 0 for no limit.' },
  { key: 'send_delay_seconds',        label: 'Send Delay (seconds)',        type: 'number',   hint: 'Seconds WF-07 waits between each email send. 60–120 is safe for warm-up.' },
  { key: 'sequence_max_position',     label: 'Max Follow-up Sequence',     type: 'number',   hint: 'How many follow-up emails to send before stopping (1 = initial only).' },
]

export const dynamic = 'force-dynamic'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { saved, error: saveError } = await searchParams
  const db = createAdminClient()
  const { data } = await db.from('platform_config').select('key, value')
  const config = Object.fromEntries(((data as ConfigRow[] | null) ?? []).map((r) => [r.key, r.value]))

  async function save(formData: FormData) {
    'use server'
    const db = createAdminClient()
    const updates = EDITABLE_KEYS.map(({ key }) => ({
      key,
      value: (formData.get(key) as string) ?? '',
    }))
    const { error } = await db.from('platform_config').upsert(updates, { onConflict: 'key' })
    if (error) {
      console.error('[Settings] upsert failed:', error.message)
      redirect('/settings?error=1')
    }
    redirect('/settings?saved=1')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          Platform configuration — changes take effect on the next workflow run
        </p>
      </div>

      {saved === '1' && (
        <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
          ✓ Settings saved
        </div>
      )}
      {saveError === '1' && (
        <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
          ✗ Save failed — check server logs
        </div>
      )}

      <form action={save}>
        <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-semibold text-white">Valfin Configuration</h2>
          </div>
          <div className="px-6 py-5 space-y-5">
            {EDITABLE_KEYS.map(({ key, label, type, hint }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5 text-white">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    name={key}
                    defaultValue={config[key] ?? ''}
                    rows={3}
                    className={config[key] === 'REPLACE_ME' ? 'border-yellow-600' : ''}
                    style={{ fontFamily: 'inherit' }}
                  />
                ) : (
                  <input
                    type={type}
                    name={key}
                    defaultValue={config[key] ?? ''}
                    className={config[key] === 'REPLACE_ME' ? 'border-yellow-600' : ''}
                  />
                )}
                {hint && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{hint}</p>}
                {config[key] === 'REPLACE_ME' && (
                  <p className="text-xs mt-1 text-yellow-500">⚠ This value needs to be set before sending</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          Save Settings
        </button>
      </form>

      <div className="mt-8 rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <h2 className="text-sm font-semibold text-white mb-3">Prompt Configuration</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          The email generation prompt is managed directly in n8n workflow WF-06.
          To update the prompt, open{' '}
          <a href="https://valfin.app.n8n.cloud/workflow/2RRFs0ALCJNVCG4y" target="_blank" rel="noreferrer">
            WF-06 in n8n
          </a>
          {' '}and edit the &ldquo;Generate Email Package&rdquo; node system message.
        </p>
      </div>
    </div>
  )
}
