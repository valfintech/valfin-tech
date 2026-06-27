import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavLinks from './NavLinks'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-10"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="text-base font-bold" style={{ color: 'var(--accent)' }}>Valfin</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Operations</div>
        </div>

        {/* Nav — client component for active state */}
        <NavLinks />

        {/* User */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs mb-3 truncate" style={{ color: 'var(--muted)' }}>
            {user.email}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left text-xs px-3 py-2 rounded-lg transition-colors"
              style={{ color: 'var(--muted)', background: 'transparent' }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
