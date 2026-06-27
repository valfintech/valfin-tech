import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  async function signIn(formData: FormData) {
    'use server'
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      redirect('/login?error=' + encodeURIComponent('Supabase not configured — add the 3 environment variables to Vercel and redeploy.'))
    }
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) {
      redirect('/login?error=' + encodeURIComponent(error.message))
    }
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white mb-1">Valfin</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Operations Dashboard</div>
        </div>

        <div className="rounded-xl border p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {!supabaseConfigured && (
            <div className="mb-4 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
              <div className="font-semibold mb-1">Setup required</div>
              <div className="text-xs leading-relaxed">
                Add these 3 environment variables in Vercel → valfin-dashboard → Settings → Environment Variables, then redeploy:
                <ul className="mt-1 space-y-0.5 font-mono">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                </ul>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-900/20 rounded-lg px-4 py-3">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--muted)' }}>
          Valfin Tech internal platform
        </p>
      </div>
    </div>
  )
}
